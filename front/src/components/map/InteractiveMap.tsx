"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useMapStore } from "@/stores/mapStore";
import { useAuth } from "@/context/AuthContext";
import MapControls from "./MapControls";
import { gets } from "@/app/actions/place/gets";
import PlaceMarker, { PlaceData } from "@/components/atoms/PlaceMarker";
import PlaceDetailsModal from "@/components/organisms/PlaceDetailsModal";
import { toast } from "react-hot-toast";
import PlaceSidebar from "@/components/map/PlaceSidebar";
import RoutePanel from "@/components/map/RoutePanel";
import MapLayerSwitcher from "@/components/map/MapLayerSwitcher";
import MyVertualTour from "../organisms/MyVertualTour";
import { getLesanBaseUrl } from "@/services/api";
import { placeSchema } from "@/types/declarations/selectInp";

// Use placeSchema from selectInp as the base type
type Place = placeSchema;
type VirtualTour = placeSchema["virtual_tours"][0];

interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

const MAPTILER_KEY = "PWAcntNh2dhVx9XsqifY";

const MAP_LAYERS: MapLayer[] = [
  {
    id: "osm-dark",
    name: "Dark",
    url: "https://cartodb-basemaps-c.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19,
  },
  {
    id: "osm-dark-vector",
    name: "Dark Vector",
    url: `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`,
    attribution:
      '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 22,
  },
  {
    id: "satellite",
    name: "Satellite",
    url: `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`,
    attribution:
      '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>',
    maxZoom: 22,
  },
  {
    id: "terrain",
    name: "Terrain",
    url: `https://api.maptiler.com/maps/outdoor-v2-dark/style.json?key=${MAPTILER_KEY}`,
    attribution:
      '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 22,
  },
];

const IRAN_BOUNDS: [[number, number], [number, number]] = [
  [44.0, 25.0], // Southwest
  [63.5, 39.8], // Northeast
];

interface InteractiveMapProps {
  onLoad?: () => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ onLoad }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());
  const markerElementsRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const markerRootsRef = useRef<Map<string, any>>(new Map());

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayer>(MAP_LAYERS[0]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const [selectedVirtualTour, setSelectedVirtualTour] =
    useState<VirtualTour | null>(null);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const [tourError, setTourError] = useState<string | null>(null);
  const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showTopLoader, setShowTopLoader] = useState(false);

  // Refs for debouncing, request cancellation, and bounds tracking
  const mapMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousBoundsRef = useRef<{
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  } | null>(null);

  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const {
    filters,
    searchQuery,
    center,
    zoom,
    setCenter,
    setZoom,
    getCurrentBounds,
    setBounds,
  } = useMapStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: currentLayer.url.endsWith(".json")
        ? currentLayer.url // Use the JSON style URL for vector layers
        : // For raster layers, create a proper style object
          {
            version: 8,
            sources: {
              "osm-raster": {
                type: "raster",
                tiles: [currentLayer.url],
                tileSize: 256,
                attribution: currentLayer.attribution,
                maxzoom: currentLayer.maxZoom,
              },
            },
            layers: [
              {
                id: "background",
                type: "background",
                paint: {
                  "background-color": "#0a0a00",
                },
              },
              {
                id: "osm-raster",
                type: "raster",
                source: "osm-raster",
                minzoom: 0,
                maxzoom: currentLayer.maxZoom,
              },
            ],
          },
      center: center ? [center.lng, center.lat] : [51.389, 35.6892], // Default to Tehran
      zoom: zoom || 6,
      maxBounds: IRAN_BOUNDS,
      attributionControl: false,
    });

    // // Add navigation controls
    // map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // // Add geolocate control
    // const geolocateControl = new maplibregl.GeolocateControl({
    //   positionOptions: {
    //     enableHighAccuracy: true,
    //   },
    //   trackUserLocation: true,
    // });
    // map.current.addControl(geolocateControl, "top-right");

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({ maxWidth: 200 }),
      "bottom-left",
    );

    // Add attribution control
    map.current.addControl(
      new maplibregl.AttributionControl({
        compact: true,
      }),
      "bottom-right",
    );

    // Handle map events
    map.current.on("moveend", () => {
      if (map.current) {
        const mapCenter = map.current.getCenter();
        setCenter({ lng: mapCenter.lng, lat: mapCenter.lat });
        setZoom(map.current.getZoom());

        // Update bounds in store
        const bounds = map.current.getBounds();
        setBounds({
          sw: { lat: bounds.getSouth(), lng: bounds.getWest() },
          ne: { lat: bounds.getNorth(), lng: bounds.getEast() },
        });

        // Trigger the debounced handler to load places based on new bounds
        handleMapMove();
      }
    });

    // Also call onLoad when the map is fully loaded
    map.current.on("load", () => {
      if (onLoad) {
        onLoad();
      }
    });

    // Load places data for initial view (without bounds)
    loadPlaces(false);

    // Cleanup
    return () => {
      // Clear any pending timeouts
      if (mapMoveTimeoutRef.current) {
        clearTimeout(mapMoveTimeoutRef.current);
      }

      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      map.current?.remove();
    };
    // We intentionally limit dependencies to avoid unnecessary re-initializations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add markers to the map
  const addMarkers = useCallback(
    (placesToAdd: Place[]) => {
      if (!map.current) return;

      // If there are no places, don't proceed with marker creation
      if (!placesToAdd || placesToAdd.length === 0) {
        return;
      }

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();

      // Clear existing marker element references and their roots
      markerElementsRef.current.forEach((el, id) => {
        if (el && el.parentElement) {
          // Unmount the React component properly
          const root = markerRootsRef.current.get(id);
          if (root) {
            root.unmount();
          }

          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
        }
      });
      markerElementsRef.current.clear();
      markerRootsRef.current.clear();

      // Add new markers
      placesToAdd.forEach((place) => {
        // Create div element for the marker
        const markerElement = document.createElement("div");
        markerElement.className = "marker-container";
        markerElementsRef.current.set(place._id!, markerElement);

        // Create a React root and render PlaceMarker
        const root = createRoot(markerElement);
        markerRootsRef.current.set(place._id!, root);
        root.render(
          <PlaceMarker
            place={place}
            isSelected={selectedPlace?._id === place._id}
            onClick={(clickedPlace) => {
              setSelectedPlace(clickedPlace);
              setShowPlaceDetails(true);

              // Fly to location
              map.current?.flyTo({
                center: clickedPlace.center.coordinates as [number, number],
                zoom: 14,
                essential: true,
              });
            }}
          />,
        );

        // Create maplibre marker
        const marker = new maplibregl.Marker({
          element: markerElement,
          anchor: "bottom",
        })
          .setLngLat(place.center.coordinates as [number, number])
          .addTo(map.current!);

        markersRef.current.set(place._id!, marker);
      });
    },
    [
      map,
      markersRef,
      markerElementsRef,
      markerRootsRef,
      setShowPlaceDetails,
      setSelectedPlace,
      selectedPlace?._id,
    ],
  );

  // Load places from backend with AbortController for request cancellation
  const loadPlaces = useCallback(
    async (useBounds = false) => {
      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Only show top loader for map-driven requests (not initial load)
      if (useBounds) {
        setShowTopLoader(true);
      } else {
        setIsLoading(true);
      }

      setIsFetchingPlaces(true);

      try {
        // Prepare the base request parameters
        let setParams: any = {
          page: 1,
          limit: 50,
          status: "active",
        };

        // If we're using bounds for the request, add geospatial filters
        if (useBounds && map.current) {
          const bounds = map.current.getBounds();
          const center = map.current.getCenter();
          const zoom = map.current.getZoom();

          // Calculate approximate distance from zoom level (meters)
          // This is a rough estimation: distance decreases as zoom increases
          const approxDistance =
            (40075000 * Math.cos((center.lat * Math.PI) / 180)) /
            Math.pow(2, zoom + 8);

          // Use the bounds to create a polygon for the area filter
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();

          // Create a polygon from the bounds
          const polygon = {
            type: "Polygon" as const,
            coordinates: [
              [
                [sw.lng, sw.lat],
                [ne.lng, sw.lat],
                [ne.lng, ne.lat],
                [sw.lng, ne.lat],
                [sw.lng, sw.lat], // Close the polygon
              ],
            ] as any[][],
          };

          // Add the area filter to the request
          setParams = {
            ...setParams,
            area: polygon,
            // Alternative: use near + maxDistance if area doesn't work
            // near: {
            //   type: "Point" as const,
            //   coordinates: [center.lng, center.lat]
            // },
            // maxDistance: approxDistance
          };
        }

        // Call the backend API to fetch places
        const response = await gets({
          set: setParams,
          get: {
            data: {
              _id: 1,
              name: 1,
              description: 1,
              center: 1,
              address: 1,
              contact: 1,
              hoursOfOperation: 1,
              category: {
                _id: 1,
                name: 1,
                color: 1,
                icon: 1,
              },
              tags: {
                _id: 1,
                name: 1,
                color: 1,
                icon: 1,
              },
              thumbnail: {
                _id: 1,
                name: 1,
              },
              gallery: {
                _id: 1,
                name: 1,
                mimType: 1,
                size: 1,
              },
              virtual_tours: {
                _id: 1,
                name: 1,
                description: 1,
                panorama: {
                  _id: 1,
                  name: 1,
                },
                hotspots: 1,
                status: 1,
              },
              updatedAt: 1,
              createdAt: 1,
            },
            metadata: {
              total: 1,
              page: 1,
              limit: 1,
              pageCount: 1,
            },
          },
        });

        // For server actions, we can't truly cancel the request
        // but we can still check if the component is still mounted before updating state
        if (abortController.signal.aborted) {
          // Request was cancelled, don't update state
          return;
        }

        if (response.success) {
          // Extract place data from response
          const placesData = Array.isArray(response.body)
            ? response.body
            : response.body?.data || [];

          // Convert string dates to Date objects for compatibility
          const convertedPlacesData = placesData.map((place: any) => ({
            ...place,
            updatedAt:
              typeof place.updatedAt === "string"
                ? new Date(place.updatedAt)
                : place.updatedAt,
            createdAt:
              typeof place.createdAt === "string"
                ? new Date(place.createdAt)
                : place.createdAt,
          }));

          if (convertedPlacesData.length > 0) {
            setPlaces(convertedPlacesData);
            setFilteredPlaces(convertedPlacesData);
            addMarkers(convertedPlacesData);

            // If first load, zoom to fit all places
            if (isFirstLoad && !useBounds) {
              fitMapToPlaces(convertedPlacesData);
              setIsFirstLoad(false);
            }
          } else {
            // Don't clear places if it's a bounds update and we already have places
            if (!useBounds || places.length === 0) {
              setPlaces([]);
              setFilteredPlaces([]);
              if (!useBounds) {
                toast(t("map.noPlacesFound") || "No places found");
              }
            }
          }
        } else {
          // Don't clear places if it's a bounds update and we already have places
          if (!useBounds || places.length === 0) {
            setPlaces([]);
            setFilteredPlaces([]);
            if (!useBounds) {
              toast.error(
                t("errors.failedToFetchPlaces") || "Failed to fetch places",
              );
            }
          }
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          // Request was cancelled, don't show error
        } else {
          if (!useBounds) {
            toast.error(t("map.errorLoadingPlaces") || "Error loading places");
            setPlaces([]);
            setFilteredPlaces([]);
          }
        }
      } finally {
        if (!abortController.signal.aborted) {
          if (useBounds) {
            setShowTopLoader(false);
          } else {
            setIsLoading(false);
          }
          setIsFetchingPlaces(false);
        }
      }
    },
    [
      t,
      isFirstLoad,
      setFilteredPlaces,
      setIsFirstLoad,
      setIsFetchingPlaces,
      setPlaces,
      addMarkers,
      places.length, // Add places.length to the dependency array for the conditional logic
    ],
  );

  // Debounced handler for map movement events with bounds comparison
  const handleMapMove = useCallback(() => {
    if (!map.current) return;

    // Get current bounds
    const currentBounds = map.current.getBounds();
    const currentBoundsObj = {
      sw: { lat: currentBounds.getSouth(), lng: currentBounds.getWest() },
      ne: { lat: currentBounds.getNorth(), lng: currentBounds.getEast() },
    };

    // Check if bounds have changed significantly (threshold: 0.001 degrees ~ 111 meters)
    if (previousBoundsRef.current) {
      const latDiff =
        Math.abs(currentBoundsObj.sw.lat - previousBoundsRef.current.sw.lat) +
        Math.abs(currentBoundsObj.ne.lat - previousBoundsRef.current.ne.lat);
      const lngDiff =
        Math.abs(currentBoundsObj.sw.lng - previousBoundsRef.current.sw.lng) +
        Math.abs(currentBoundsObj.ne.lng - previousBoundsRef.current.ne.lng);

      // If bounds haven't changed significantly, don't fetch again
      if (latDiff < 0.002 && lngDiff < 0.002) {
        return;
      }
    }

    // Update previous bounds
    previousBoundsRef.current = currentBoundsObj;

    // Clear any existing timeout
    if (mapMoveTimeoutRef.current) {
      clearTimeout(mapMoveTimeoutRef.current);
    }

    // Set a new timeout to wait for 200ms after the last movement
    mapMoveTimeoutRef.current = setTimeout(() => {
      // Fetch places using the current map bounds
      loadPlaces(true); // Use bounds for this request
    }, 200);
  }, [loadPlaces]);

  // The addMarkers function has been moved up before loadPlaces

  // Handle launching virtual tour
  const handleLaunchVirtualTour = (tourId: string) => {
    setTourError(null);
    setIsTourLoading(true);

    // Reset any existing tour first
    setSelectedVirtualTour(null);

    if (
      !selectedPlace?.virtual_tours ||
      selectedPlace.virtual_tours.length === 0
    ) {
      setTourError("This place does not have virtual tours available");
      setIsTourLoading(false);
      return;
    }

    // Type assertion to handle API response with panorama
    const tourWithPanorama = selectedPlace.virtual_tours.find(
      (vt) => vt._id === tourId,
    ) as
      | (VirtualTour & { panorama: { _id?: string; name: string } })
      | undefined;

    if (tourWithPanorama && tourWithPanorama.panorama?.name) {
      setSelectedVirtualTour(tourWithPanorama);
      setShowPlaceDetails(false);
      setIsTourLoading(false);
    } else {
      setTourError("This virtual tour is missing its panorama image");
      setIsTourLoading(false);
    }
  };

  // Close the virtual tour
  const handleCloseTour = () => {
    setSelectedVirtualTour(null);
    setTourError(null);
    setIsTourLoading(false);
  };

  // Fit map to show all places
  const fitMapToPlaces = (places: Place[]) => {
    if (!map.current || !places || places.length === 0) return;

    try {
      // Create a bounds object and extend it with all place coordinates
      const bounds = new maplibregl.LngLatBounds();

      places.forEach((place) => {
        if (
          place.center &&
          place.center.coordinates &&
          Array.isArray(place.center.coordinates) &&
          place.center.coordinates.length >= 2
        ) {
          bounds.extend([
            place.center.coordinates[0],
            place.center.coordinates[1],
          ] as [number, number]);
        }
      });

      // Only fit bounds if we added coordinates
      if (!bounds.isEmpty()) {
        map.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 15,
        });
      }
    } catch (error) {
      // Error handling for fitMapToPlaces can be added if needed
    }
  };

  // Update markers when selected place changes
  useEffect(() => {
    if (!map.current) return;

    // Wait a bit to ensure map is loaded, then re-render markers to update selected state
    const timer = setTimeout(() => {
      if (!map.current) return;

      filteredPlaces.forEach((place) => {
        const markerElement = markerElementsRef.current.get(place._id!);
        if (markerElement) {
          // Reuse existing root instead of creating a new one
          const root = markerRootsRef.current.get(place._id!);
          if (root) {
            root.render(
              <PlaceMarker
                place={place}
                isSelected={selectedPlace?._id === place._id}
                onClick={(clickedPlace) => {
                  setSelectedPlace(clickedPlace);
                  setShowPlaceDetails(true);

                  // Fly to location
                  map.current?.flyTo({
                    center: clickedPlace.center.coordinates as [number, number],
                    zoom: 14,
                    essential: true,
                  });
                }}
              />,
            );
          }
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [selectedPlace?._id, filteredPlaces, map]);

  // Filter places based on search and filters
  useEffect(() => {
    let filtered = [...places];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.tags?.some((tag) => {
            const tagName = typeof tag === "object" ? tag.name : tag;
            return tagName.toLowerCase().includes(searchQuery.toLowerCase());
          }),
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((place) => {
        const categoryName =
          typeof place.category === "object"
            ? place.category.name
            : place.category;
        return categoryName && filters.categories?.includes(categoryName);
      });
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((place) =>
        place.tags?.some((tag) => {
          const tagName = typeof tag === "object" ? tag.name : tag;
          return filters.tags?.includes(tagName);
        }),
      );
    }

    setFilteredPlaces(filtered);
    addMarkers(filtered);
  }, [searchQuery, filters, places, addMarkers]);

  // Close place details when ESC is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showPlaceDetails) {
          setShowPlaceDetails(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPlaceDetails, setShowPlaceDetails]);

  // Handle layer change
  const handleLayerChange = (layer: MapLayer) => {
    if (!map.current) return;

    setCurrentLayer(layer);

    // Update map style
    if (layer.url.endsWith(".json")) {
      // Vector tile style - we need to load the style and ensure background
      map.current.setStyle(layer.url);
    } else {
      // Raster tiles - create a proper style object
      map.current.setStyle({
        version: 8,
        sources: {
          "osm-raster": {
            type: "raster",
            tiles: [layer.url],
            tileSize: 256,
            attribution: layer.attribution,
            maxzoom: layer.maxZoom,
          },
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#0a0a00",
            },
          },
          {
            id: "osm-raster",
            type: "raster",
            source: "osm-raster",
            minzoom: 0,
            maxzoom: layer.maxZoom,
          },
        ],
      });
    }

    // Re-add markers after style change
    // Wait for the style to load before adding markers
    map.current.once("styledata", () => {
      addMarkers(filteredPlaces);
    });
  };

  // Handle route calculation
  const calculateRoute = async (
    start: [number, number],
    end: [number, number],
  ) => {
    if (!map.current) return;

    try {
      // TODO: Replace with actual routing API
      // const response = await fetch(`/api/route?start=${start}&end=${end}`);
      // const route = await response.json();

      // For now, draw a simple line
      const route = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [start, end],
        },
      };

      // Add route layer
      if (map.current.getSource("route")) {
        (map.current.getSource("route") as any).setData(route);
      } else {
        map.current.addSource("route", {
          type: "geojson",
          data: route as any,
        });

        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3b82f6",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      }

      // Fit map to route
      const bounds = new maplibregl.LngLatBounds();
      bounds.extend(start);
      bounds.extend(end);
      map.current.fitBounds(bounds, { padding: 100 });
    } catch (error) {
      // Error handling for calculateRoute can be added if needed
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-progress {
          animation: progress 1.5s infinite ease-in-out;
        }
      `}</style>
      <div className="relative w-full h-full">
        {/* Top progress bar loader - only for map-driven requests */}
        {showTopLoader && (
          <div className="absolute top-0 left-0 right-0 h-1 z-50 overflow-hidden bg-[#333]">
            <div
              className="animate-progress bg-[#FF007A] h-full w-full transition-all duration-200 ease-out"
              style={{ width: "100%" }}
            ></div>
          </div>
        )}

        {/* Map container */}
        <div ref={mapContainer} className="w-full h-full bg-[#0a0a00]" />

        {/* Map controls */}
        <MapControls
          onZoomIn={() => map.current?.zoomIn()}
          onZoomOut={() => map.current?.zoomOut()}
          onResetView={() => {
            map.current?.flyTo({
              center: [51.389, 35.6892],
              zoom: 6,
              essential: true,
            });
          }}
          onToggleRouting={() => setShowRoutePanel(!showRoutePanel)}
          onLocateUser={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  map.current?.flyTo({
                    center: [
                      position.coords.longitude,
                      position.coords.latitude,
                    ],
                    zoom: 14,
                    essential: true,
                  });
                },
                (error) => {
                  // Error getting user location can be handled here if needed
                },
              );
            }
          }}
        />

        {/* Layer switcher */}
        <MapLayerSwitcher
          layers={MAP_LAYERS}
          currentLayer={currentLayer}
          onLayerChange={handleLayerChange}
        />

        {/* Place sidebar */}
        <AnimatePresence>
          {showSidebar && selectedPlace && (
            <PlaceSidebar
              place={{
                ...selectedPlace,
                _id: selectedPlace._id || "",
                name: selectedPlace.name || "",
                description: selectedPlace.description || "",
                center: (selectedPlace.center as {
                  type: "Point";
                  coordinates: [number, number];
                }) || {
                  type: "Point",
                  coordinates: [0, 0],
                },
                category:
                  typeof selectedPlace.category === "object"
                    ? selectedPlace.category.name
                    : selectedPlace.category || "",
                tags: Array.isArray(selectedPlace.tags)
                  ? selectedPlace.tags.map((tag) =>
                      typeof tag === "object" ? tag.name : tag,
                    )
                  : selectedPlace.tags || [],
                images:
                  selectedPlace.gallery?.map(
                    (img) =>
                      `${getLesanBaseUrl()}/uploads/images/${typeof img === "object" ? img.name : img || ""}`,
                  ) || [],
              }}
              onClose={() => {
                setShowSidebar(false);
                setSelectedPlace(null);
              }}
              onNavigate={(coords: [number, number]) => {
                setRouteEnd(coords);
                setShowRoutePanel(true);
              }}
              isAuthenticated={isAuthenticated}
            />
          )}
        </AnimatePresence>

        {/* Route panel */}
        <AnimatePresence>
          {showRoutePanel && (
            <RoutePanel
              start={routeStart}
              end={routeEnd}
              onClose={() => setShowRoutePanel(false)}
              onCalculateRoute={calculateRoute}
              onSetStart={setRouteStart}
              onSetEnd={setRouteEnd}
            />
          )}
        </AnimatePresence>

        {/* Stats overlay */}
        <div className="absolute bottom-20 left-4 bg-[#121212]/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm border border-[#333]">
          <div className="flex items-center gap-2 text-[#a0a0a0]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-white">
              {filteredPlaces.length} {t("Location.locationsFound")}
            </span>
          </div>
        </div>

        {/* Place Details Modal */}
        {selectedPlace && showPlaceDetails && (
          <PlaceDetailsModal
            place={selectedPlace}
            onClose={() => setShowPlaceDetails(false)}
            onLaunchVirtualTour={handleLaunchVirtualTour}
          />
        )}

        {(() => {
          // Type assertion to handle API response with panorama
          const tourWithPanorama = selectedVirtualTour as
            | (VirtualTour & { panorama: { _id?: string; name: string } })
            | undefined;
          return tourWithPanorama && tourWithPanorama.panorama?.name ? (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
              {/* Tour Header */}
              <div className="bg-[#121212] text-white p-2 flex justify-between items-center border-b border-[#333]">
                <h2 className="text-lg font-medium">
                  {selectedPlace?.name || "Virtual Tour"}
                </h2>
                <button
                  onClick={handleCloseTour}
                  className="p-1 rounded-full hover:bg-[#1e1e1e] text-white"
                  aria-label="Close tour"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              {/* Tour Viewer */}
              <div className="flex-1">
                <MyVertualTour
                  imageUrl={`${getLesanBaseUrl()}/uploads/images/${tourWithPanorama.panorama.name}`}
                />
              </div>
            </div>
          ) : null;
        })()}

        {/* Tour Error Message */}
        {tourError && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-[#121212] p-6 rounded-lg max-w-md text-center border border-[#333]">
              <div className="text-[#FF007A] mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                Virtual Tour Error
              </h3>
              <p className="text-[#a0a0a0] mb-4">{tourError}</p>
              <button
                onClick={handleCloseTour}
                className="bg-[#FF007A] text-white px-4 py-2 rounded hover:bg-[#ff339c]"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InteractiveMap;
