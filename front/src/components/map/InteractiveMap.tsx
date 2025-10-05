"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
import PlacePopup from "@/components/map/PlacePopup";
import PlaceSidebar from "@/components/map/PlaceSidebar";
import RoutePanel from "@/components/map/RoutePanel";
import MapLayerSwitcher from "@/components/map/MapLayerSwitcher";
import MyVertualTour from "../organisms/MyVertualTour";
import { getLesanBaseUrl } from "@/services/api";

// Types
// Custom Place interface compatible with PlaceData
interface Place {
  _id: string;
  name: string;
  description: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
  category?:
  | {
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  }
  | string;
  tags?:
  | Array<{
    _id?: string;
    name: string;
    color?: string;
    icon?: string;
  }>
  | string[];
  thumbnail?: {
    _id?: string;
    name: string;
  };
  gallery?: {
    _id?: string;
    name: string;
    mimType: string;
    size: number;
    alt_text?: string;
  }[];
  virtual_tours?: {
    _id: string;
    name: string;
    description?: string;
    panorama: {
      _id?: string;
      name: string;
    };
    hotspots?: {
      pitch: number;
      yaw: number;
      description?: string;
      target?: string;
    }[];
    status: "draft" | "active" | "archived";
  }[];
  address?: string;
  hoursOfOperation?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    social?: string[];
  };
  updatedAt: Date;
  createdAt: Date;
}

// For virtual tour type
interface VirtualTour {
  _id: string;
  name: string;
  description?: string;
  panorama: {
    _id?: string;
    name: string;
  };
  hotspots?: {
    pitch: number;
    yaw: number;
    description?: string;
    target?: string;
  }[];
  status: "draft" | "active" | "archived";
}

interface MapLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

const MAP_LAYERS: MapLayer[] = [
  {
    id: "osm-standard",
    name: "OpenStreetMap",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: "osm-vector",
    name: "Vector Tiles",
    url: "https://api.maptiler.com/maps/streets-v2/style.json?key=YOUR_MAPTILER_KEY",
    attribution:
      '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    maxZoom: 22,
  },
  {
    id: "satellite",
    name: "Satellite",
    url: "https://api.maptiler.com/maps/hybrid/style.json?key=YOUR_MAPTILER_KEY",
    attribution:
      '© <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a>',
    maxZoom: 22,
  },
  {
    id: "terrain",
    name: "Terrain",
    url: "https://api.maptiler.com/maps/outdoor-v2/style.json?key=YOUR_MAPTILER_KEY",
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
      style: {
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

        // Places are loaded via the dedicated effect with debounce
      }
    });

    // Also call onLoad when the map is fully loaded
    map.current.on("load", () => {
      if (onLoad) {
        onLoad();
      }
    });

    // Load places data
    loadPlaces();

    // Notify that map is loaded
    if (onLoad) {
      onLoad();
    }

    // Cleanup
    return () => {
      map.current?.remove();
    };
    // We intentionally limit dependencies to avoid unnecessary re-initializations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onLoad]);

  // Add markers to the map
  const addMarkers = (placesToAdd: Place[]) => {
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
      markerElementsRef.current.set(place._id, markerElement);

      // Ensure we have a valid place object
      const placeData = place;

      // Create a React root and render PlaceMarker
      const root = createRoot(markerElement);
      markerRootsRef.current.set(place._id, root);
      root.render(
        <PlaceMarker
          place={placeData as any}
          isSelected={selectedPlace?._id === place._id}
          onClick={(clickedPlace) => {
            setSelectedPlace(clickedPlace);
            setShowPlaceDetails(true);

            // Fly to location
            map.current?.flyTo({
              center: clickedPlace.center.coordinates,
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
        .setLngLat(place.center.coordinates)
        .addTo(map.current!);

      markersRef.current.set(place._id, marker);
    });
  };

  // Load places from backend
  const loadPlaces = useCallback(async () => {
    if (isFetchingPlaces) return;

    setIsLoading(true);
    setIsFetchingPlaces(true);

    try {
      // Get current map bounds to fetch places within visible area
      const mapBounds = getCurrentBounds();

      // Call the backend API to fetch places
      const response = await gets({
        set: {
          page: 1,
          limit: 50,
          status: "active",
        },
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

      if (response.success) {
        // Extract place data from response
        const placesData = Array.isArray(response.body)
          ? response.body
          : response.body?.data || [];

        if (placesData.length > 0) {
          setPlaces(placesData);
          setFilteredPlaces(placesData);
          addMarkers(placesData);

          // If first load, zoom to fit all places
          if (isFirstLoad) {
            fitMapToPlaces(placesData);
            setIsFirstLoad(false);
          }
        } else {
          setPlaces([]);
          setFilteredPlaces([]);
          toast(t("map.noPlacesFound") || "No places found");
        }
      } else {
        setPlaces([]);
        setFilteredPlaces([]);
        toast.error(
          t("errors.failedToFetchPlaces") || "Failed to fetch places",
        );
      }
    } catch (error) {
      console.error("Error loading places:", error);
      toast.error(t("map.errorLoadingPlaces") || "Error loading places");
      setPlaces([]);
      setFilteredPlaces([]);
    } finally {
      setIsLoading(false);
      setIsFetchingPlaces(false);
    }
  }, [
    getCurrentBounds,
    t,
    isFirstLoad,
    setFilteredPlaces,
    setIsFirstLoad,
    setIsFetchingPlaces,
    setIsLoading,
    setPlaces,
    addMarkers,
  ]);

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
      console.warn("No virtual tours available for this place");
      setTourError("This place does not have virtual tours available");
      setIsTourLoading(false);
      return;
    }

    const tour = selectedPlace.virtual_tours.find(
      (tour) => tour._id === tourId,
    );

    if (tour && tour.panorama && tour.panorama.name) {
      console.log("Loading virtual tour:", tour.panorama.name);
      setSelectedVirtualTour(tour);
      setShowPlaceDetails(false);
      setIsTourLoading(false);
    } else {
      console.error("Virtual tour is missing panorama image:", tour);
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
        if (place.center && place.center.coordinates) {
          bounds.extend(place.center.coordinates as [number, number]);
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
      console.error("Error fitting map to places:", error);
    }
  };

  // Update markers when selected place changes
  useEffect(() => {
    if (!map.current) return;

    // Re-render markers to update selected state
    filteredPlaces.forEach((place) => {
      const markerElement = markerElementsRef.current.get(place._id);
      if (markerElement) {
        // Reuse existing root instead of creating a new one
        const root = markerRootsRef.current.get(place._id);
        if (root) {
          root.render(
            <PlaceMarker
              place={
                {
                  ...place,
                  category:
                    typeof place.category === "string"
                      ? { name: place.category, color: "#4f46e5" }
                      : place.category,
                  tags: Array.isArray(place.tags)
                    ? place.tags.map((tag) =>
                      typeof tag === "string" ? { name: tag } : tag,
                    )
                    : place.tags,
                } as any
              }
              isSelected={selectedPlace?._id === place._id}
              onClick={(clickedPlace) => {
                setSelectedPlace(clickedPlace);
                setShowPlaceDetails(true);

                // Fly to location
                map.current?.flyTo({
                  center: clickedPlace.center.coordinates,
                  zoom: 14,
                  essential: true,
                });
              }}
            />,
          );
        }
      }
    });
  }, [selectedPlace?._id, filteredPlaces, map]);

  // Legacy function for backward compatibility - can be removed later
  const getMarkerIcon = (category: any): string => {
    // Check if category is undefined/null
    if (!category) return DEFAULT_ICON;

    // Convert category object to string if needed
    const categoryName =
      typeof category === "object" ? category?.name : category;

    if (!categoryName) return DEFAULT_ICON;

    const iconMap: { [key: string]: string } = {
      historical:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23a855f7" viewBox="0 0 24 24"%3E%3Cpath d="M12 2l3 7h7l-5.5 4 2 7-6.5-5-6.5 5 2-7L2 9h7l3-7z"%3E%3C/path%3E%3C/svg%3E\')',
      monument:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%233b82f6" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"%3E%3C/path%3E%3C/svg%3E\')',
      nature:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%2310b981" viewBox="0 0 24 24"%3E%3Cpath d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z"%3E%3C/path%3E%3C/svg%3E\')',
      default:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23ef4444" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"%3E%3C/path%3E%3C/svg%3E\')',
    };

    // Convert to lowercase string safely
    let categoryKey = "";
    if (typeof categoryName === "string") {
      categoryKey = categoryName.toLowerCase();
    }
    return iconMap[categoryKey] || iconMap.default;
  };

  // Default icon for fallback
  const DEFAULT_ICON =
    'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23ef4444" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"%3E%3C/path%3E%3C/svg%3E\')';

  // Filter places based on search and filters
  useEffect(() => {
    let filtered = [...places];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((place) =>
        filters.categories?.includes(place.category || ""),
      );
    }

    // Apply tag filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((place) =>
        place.tags?.some((tag) => filters.tags?.includes(tag)),
      );
    }

    setFilteredPlaces(filtered);
    addMarkers(filtered);
  }, [searchQuery, filters, places]);

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
      // Vector tile style
      map.current.setStyle(layer.url);
    } else {
      // Raster tiles
      map.current.setStyle({
        version: 8,
        sources: {
          "new-source": {
            type: "raster",
            tiles: [layer.url],
            tileSize: 256,
            attribution: layer.attribution,
            maxzoom: layer.maxZoom,
          },
        },
        layers: [
          {
            id: "new-layer",
            type: "raster",
            source: "new-source",
            minzoom: 0,
            maxzoom: layer.maxZoom,
          },
        ],
      });
    }

    // Re-add markers after style change
    setTimeout(() => addMarkers(filteredPlaces), 500);
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
      console.error("Error calculating route:", error);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
          >
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">{t("Common.loading")}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />

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
                  center: [position.coords.longitude, position.coords.latitude],
                  zoom: 14,
                  essential: true,
                });
              },
              (error) => {
                console.error("Error getting location:", error);
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
            place={selectedPlace}
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
      <div className="absolute bottom-20 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
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
          <span>
            {filteredPlaces.length} {t("Location.locationsFound")}
          </span>
        </div>
      </div>

      {/* Place Details Modal */}
      {selectedPlace && showPlaceDetails && (
        <PlaceDetailsModal
          place={selectedPlace as PlaceData}
          onClose={() => setShowPlaceDetails(false)}
          onLaunchVirtualTour={handleLaunchVirtualTour}
        />
      )}

      {selectedVirtualTour &&
        selectedVirtualTour.panorama &&
        selectedVirtualTour.panorama.name && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
            {/* Tour Header */}
            <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
              <h2 className="text-lg font-medium">
                {selectedPlace?.name || "Virtual Tour"}
              </h2>
              <button
                onClick={handleCloseTour}
                className="p-1 rounded-full hover:bg-gray-700"
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
                imageUrl={`${getLesanBaseUrl()}/uploads/images/${selectedVirtualTour.panorama.name}`}
              />
            </div>
          </div>
        )}

      {/* Tour Error Message */}
      {tourError && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md text-center">
            <div className="text-red-500 mb-4">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Virtual Tour Error
            </h3>
            <p className="text-gray-600 mb-4">{tourError}</p>
            <button
              onClick={handleCloseTour}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
