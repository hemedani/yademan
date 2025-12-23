"use client";
// File Address
// src/components/map/InteractiveMap.tsx

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { useMapStore } from "@/stores/mapStore";
import MapControls from "./MapControls";
import { gets } from "@/app/actions/place/gets";
import PlaceMarker from "@/components/atoms/PlaceMarker";
import PlaceDetailsModal from "@/components/organisms/PlaceDetailsModal";
import PlaceHoverTooltip from "./PlaceHoverTooltip";
import { toast } from "react-hot-toast";
import RoutePanel from "@/components/map/RoutePanel";
import LayerControl from "./LayerControl";
import MapStatsIndicator from "@/components/map/MapStatsIndicator";
import { placeSchema } from "@/types/declarations/selectInp";

// Enable RTL text support for Persian, Arabic, Hebrew, etc.
const maplibreglGlobal = maplibregl as any; // To access the global setRTLTextPlugin

// Use placeSchema from selectInp as the base type
type Place = placeSchema;

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
    id: "darkmatter",
    name: "Dark Matter",
    url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
    maxZoom: 18,
  },
  {
    id: "standard",
    name: "Standard OSM",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  {
    id: "humanitarian",
    name: "Humanitarian",
    url: "https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/">Humanitarian OpenStreetMap Team</a>',
    maxZoom: 18,
  },
  {
    id: "cyclosm",
    name: "CyclOSM",
    url: "https://a.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution:
      '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  },
  {
    id: "openfreemap_dark",
    name: "OpenFreeMap Dark",
    url: "https://tiles.openfreemap.org/styles/dark",
    attribution:
      '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors | <a href="https://openfreemap.org">OpenFreeMap</a>',
    maxZoom: 22,
  },
  {
    id: "openfreemap_liberty",
    name: "OpenFreeMap Liberty",
    url: "https://tiles.openfreemap.org/styles/liberty",
    attribution:
      '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors | <a href="https://openfreemap.org">OpenFreeMap</a>',
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
  const attributionControlRef = useRef<maplibregl.AttributionControl | null>(
    null,
  );

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayer>(
    MAP_LAYERS.find((layer) => layer.id === "darkmatter") || MAP_LAYERS[0],
  );
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const [isFetchingPlaces, setIsFetchingPlaces] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showTopLoader, setShowTopLoader] = useState(false);
  const [hoveredPlace, setHoveredPlace] = useState<Place | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const hasInitialized = useRef(false);

  // Refs for debouncing, request cancellation, and bounds tracking
  const mapMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const previousBoundsRef = useRef<{
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  } | null>(null);

  // Cache for API responses to prevent duplicate requests
  const apiResponseCache = useRef<Map<string, Place[]>>(new Map());

  const t = useTranslations();
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

  const setMapStoreAreaFilter = useMapStore((state) => state.setAreaFilter);

  // Create a cache key from the request parameters
  const createCacheKey = useCallback((): string => {
    const params = [
      filters.categoryIds?.join(",") || "nocat",
      filters.tagIds?.join(",") || "notag",
      filters.name || "noname",
      filters.slug || "noslug",
      filters.status || "nostatus",
      filters.province || "noprovince",
      filters.city || "nocity",
      filters.city_zone || "nocityzone",
      filters.antiquity?.toString() || "noantiquity",
      // Include area in cache key if present
      filters.area ? JSON.stringify(filters.area) : "noarea",
    ].join("|");

    return params;
  }, [filters]);

  // Efficiently update markers based on selection changes
  const updateMarkerSelection = useCallback(() => {
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
  }, [selectedPlace?._id, filteredPlaces, map]);

  // Efficiently add or update markers
  const updateMarkers = useCallback(
    (placesToUpdate: Place[]) => {
      if (!map.current) return;

      // If no places to show, clear all markers
      if (!placesToUpdate || placesToUpdate.length === 0) {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current.clear();
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
        return;
      }

      // Create a set of IDs for the new places for quick lookup
      const newPlaceIds = new Set(placesToUpdate.map((place) => place._id));

      // Remove markers for places that are no longer in the list
      for (const [id, marker] of markersRef.current) {
        if (!newPlaceIds.has(id)) {
          marker.remove();
          markersRef.current.delete(id);

          const markerElement = markerElementsRef.current.get(id);
          if (markerElement) {
            const root = markerRootsRef.current.get(id);
            if (root) {
              root.unmount();
            }

            while (markerElement.firstChild) {
              markerElement.removeChild(markerElement.firstChild);
            }

            markerElementsRef.current.delete(id);
            markerRootsRef.current.delete(id);
          }
        }
      }

      // Add or update markers for the current places
      placesToUpdate.forEach((place) => {
        // Check if marker already exists
        if (!markersRef.current.has(place._id!)) {
          // Create div element for the new marker
          const markerElement = document.createElement("div");
          markerElement.className = "marker-container";
          markerElementsRef.current.set(place._id!, markerElement);

          // Create a React root and render PlaceMarker
          const root = createRoot(markerElement);
          markerRootsRef.current.set(place._id!, root);

          // Add event listeners to the marker container for hover effects
          markerElement.addEventListener("mouseenter", (e) => {
            // Calculate position from the marker's coordinates relative to the map container
            const screenCoords = map.current!.project(
              place.center.coordinates as [number, number],
            );
            // Adjust coordinates to be relative to the screen (not map container)
            const rect = mapContainer.current?.getBoundingClientRect();
            setTooltipPosition({
              x: screenCoords.x + (rect?.left || 0),
              y: screenCoords.y + (rect?.top || 0),
            });
            setHoveredPlace(place);
          });

          markerElement.addEventListener("mouseleave", () => {
            setHoveredPlace(null);
          });

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
        } else {
          // Update the existing marker's content
          const markerElement = markerElementsRef.current.get(place._id!);
          if (markerElement) {
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
                      center: clickedPlace.center.coordinates as [
                        number,
                        number,
                      ],
                      zoom: 14,
                      essential: true,
                    });
                  }}
                />,
              );
            }
          }
        }
      });
    },
    [map, selectedPlace?._id, mapContainer],
  );

  // Load places from backend with AbortController for request cancellation
  const loadPlaces = useCallback(async () => {
    // Create cache key to check if we've already loaded this view
    const cacheKey = createCacheKey(); // Use the updated cache key function

    // Check if we have cached results
    if (apiResponseCache.current.has(cacheKey)) {
      const cachedPlaces = apiResponseCache.current.get(cacheKey)!;
      setPlaces(cachedPlaces);
      // setFilteredPlaces will be updated by the search effect
      updateMarkers(cachedPlaces);

      // If first load, zoom to fit all places
      if (isFirstLoad) {
        fitMapToPlaces(cachedPlaces);
        setIsFirstLoad(false);
      }
      return;
    }

    // Cancel any in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Always show loading indicators
    setIsLoading(true);
    setShowTopLoader(true);

    setIsFetchingPlaces(true);

    try {
      // Prepare the base request parameters
      let setParams: any = {
        page: 1,
        limit: 50,
        status: "active",
      };

      // Add all filters from the store to the API request
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        setParams = { ...setParams, categoryIds: filters.categoryIds };
      }

      if (filters.tagIds && filters.tagIds.length > 0) {
        setParams = { ...setParams, tagIds: filters.tagIds };
      }

      if (filters.name) {
        setParams = { ...setParams, name: filters.name };
      }

      if (filters.slug) {
        setParams = { ...setParams, slug: filters.slug };
      }

      if (filters.status) {
        setParams = { ...setParams, status: filters.status };
      }

      if (filters.province) {
        setParams = { ...setParams, province: filters.province };
      }

      if (filters.city) {
        setParams = { ...setParams, city: filters.city };
      }

      if (filters.city_zone) {
        setParams = { ...setParams, cityZone: filters.city_zone };
      }

      // Add antiquity filter to be sent to backend, rounded to integer
      if (filters.antiquity !== undefined && filters.antiquity >= 0) {
        setParams = {
          ...setParams,
          antiquity: Math.floor(filters.antiquity),
        };
      }

      // Add area filter if available
      if (filters.area) {
        setParams = { ...setParams, area: filters.area };
      }

      // Add search query to the API request if available
      if (searchQuery) {
        setParams = { ...setParams, name: searchQuery };
      }

      // Call the backend API to fetch places
      const response = await gets({
        set: setParams,
        get: {
          data: {
            _id: 1,
            name: 1,
            center: 1,
            description: 1,
            category: {
              _id: 1,
              name: 1,
              color: 1,
              icon: 1,
            },
            thumbnail: {
              _id: 1,
              name: 1,
            },
            tags: {
              _id: 1,
              name: 1,
              color: 1,
              icon: 1,
            },
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
          // setFilteredPlaces will be updated by the search effect
          updateMarkers(convertedPlacesData);

          // Cache the response
          apiResponseCache.current.set(cacheKey, convertedPlacesData);

          // If first load, zoom to fit all places
          if (isFirstLoad) {
            fitMapToPlaces(convertedPlacesData);
            setIsFirstLoad(false);
          }
        } else {
          setPlaces([]);
          // setFilteredPlaces will be updated by the search effect
          // Only show toast if we have a cache miss to avoid duplicate toasts when cached results are empty
          if (!apiResponseCache.current.has(cacheKey)) {
            toast(t("map.noPlacesFound") || "No places found");
          }

          // Still cache the empty result to prevent re-fetching with same parameters
          apiResponseCache.current.set(cacheKey, []);
        }
      } else {
        setPlaces([]);
        // setFilteredPlaces will be updated by the search effect
        // Only show toast if we have a cache miss to avoid duplicate toasts when cached results are empty
        if (!apiResponseCache.current.has(cacheKey)) {
          toast.error(
            t("errors.failedToFetchPlaces") || "Failed to fetch places",
          );
        }

        // Still cache the failure to prevent re-fetching with same parameters
        apiResponseCache.current.set(cacheKey, []);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        // Request was cancelled, don't show error
      } else {
        // Only show toast if we have a cache miss to avoid duplicate toasts when cached results are empty
        if (!apiResponseCache.current.has(cacheKey)) {
          toast.error(t("map.errorLoadingPlaces") || "Error loading places");
        }
        setPlaces([]);
        // setFilteredPlaces will be updated by the search effect

        // Still cache the failure to prevent re-fetching with same parameters
        apiResponseCache.current.set(cacheKey, []);
      }
    } finally {
      if (!abortController.signal.aborted) {
        setIsLoading(false);
        setIsFetchingPlaces(false);
        setShowTopLoader(false);
      }
    }
  }, [
    t,
    isFirstLoad,
    setIsFirstLoad,
    setIsFetchingPlaces,
    setPlaces,
    updateMarkers,
    places.length, // Add places.length to the dependency array for the conditional logic
    filters,
    map,
    createCacheKey,
    searchQuery,
  ]);

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
      // Update area filter in store
      const polygon = {
        type: "Polygon" as const,
        coordinates: [
          [
            [currentBoundsObj.sw.lng, currentBoundsObj.sw.lat],
            [currentBoundsObj.ne.lng, currentBoundsObj.sw.lat],
            [currentBoundsObj.ne.lng, currentBoundsObj.ne.lat],
            [currentBoundsObj.sw.lng, currentBoundsObj.ne.lat],
            [currentBoundsObj.sw.lng, currentBoundsObj.sw.lat], // Close the polygon
          ],
        ] as number[][][],
      };

      setBounds(currentBoundsObj);
      setMapStoreAreaFilter(polygon);
    }, 200);
  }, [setBounds, setMapStoreAreaFilter]);

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
          // Add extra padding at the bottom to account for the timeline slider
          padding: {
            top: 90,
            bottom: 205, // Increased padding for bottom to account for timeline
            left: 60,
            right: 60,
          },
          maxZoom: 15,
        });
      }
    } catch (error) {
      // Error handling for fitMapToPlaces can be added if needed
    }
  };

  // Update markers when selected place changes
  useEffect(() => {
    updateMarkerSelection();
  }, [selectedPlace?._id, updateMarkerSelection]);

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

    // Enable RTL text support for Persian, Arabic, Hebrew, etc.
    // Only set the plugin if it hasn't been set already to avoid "setRTLTextPlugin cannot be called multiple times" error
    if (
      !maplibreglGlobal.getRTLTextPluginStatus ||
      maplibreglGlobal.getRTLTextPluginStatus() === "unavailable"
    ) {
      maplibreglGlobal.setRTLTextPlugin(
        "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
        true, // lazy load – improves performance
      );
    }

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({ maxWidth: 200 }),
      "bottom-left",
    );

    // Add attribution control and store reference
    const attributionControl = new maplibregl.AttributionControl({
      compact: true,
    });
    map.current.addControl(attributionControl, "bottom-right");
    attributionControlRef.current = attributionControl;

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

      // Load places data for initial view only once
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        loadPlaces(); // Initial load
      }
    });

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

      // Remove all markers
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current.clear();
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

      map.current?.remove();
      attributionControlRef.current = null;
    };
    // We intentionally limit dependencies to avoid unnecessary re-initializations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload places when any filter changes - watch the entire filters object
  useEffect(() => {
    // Only load places after the map has been initialized to prevent duplicate calls
    if (hasInitialized.current) {
      loadPlaces(); // Reload places with all current filters
    }
  }, [filters, loadPlaces]);

  // Apply client-side filtering when places or search query changes
  useEffect(() => {
    let filtered = [...places];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (place) =>
          place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          place.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          place.tags?.some((tag) => {
            const tagName = typeof tag === "object" ? tag.name : tag;
            return tagName.toLowerCase().includes(searchQuery.toLowerCase());
          }),
      );
    }

    setFilteredPlaces(filtered);
    updateMarkers(filtered);
  }, [places, searchQuery, updateMarkers]);

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

  // Handle layer change - robust implementation to prevent WebGL context errors
  const handleLayerChange = (layer: MapLayer) => {
    if (!map.current) return;

    setCurrentLayer(layer);

    // Proactively remove ALL route and pathfinding layers/sources before changing style
    // This prevents WebGL context errors when switching to vector styles
    const layersToRemove = ["route", "start-marker"];
    const sourcesToRemove = ["route", "start-marker"];

    // Add pathfinding place markers to removal list
    pathfindingPath.forEach((_, index) => {
      layersToRemove.push(`place-marker-${index}`);
      sourcesToRemove.push(`place-source-${index}`);
    });

    // Remove all route-related layers and sources
    layersToRemove.forEach((layerId) => {
      if (map.current && map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId);
      }
    });

    sourcesToRemove.forEach((sourceId) => {
      if (map.current && map.current.getSource(sourceId)) {
        map.current.removeSource(sourceId);
      }
    });

    // Remove existing attribution control
    if (attributionControlRef.current) {
      map.current.removeControl(attributionControlRef.current);
      attributionControlRef.current = null;
    }

    try {
      // Update map style
      if (
        layer.url.endsWith(".json") ||
        layer.id === "openfreemap_dark" ||
        layer.id === "openfreemap_liberty"
      ) {
        // Vector tile style - use the style URL directly
        map.current.setStyle(layer.url);

        // Use 'styledata' event to re-add markers and route after style change
        map.current.once("styledata", () => {
          // Re-add markers
          updateMarkers(filteredPlaces);

          // Re-add pathfinding elements if active
          if (isPathfindingActive && pathfindingRouteGeometry.length > 0) {
            addPathToMap(pathfindingRouteGeometry);
          }

          // Re-add the attribution control with updated attribution
          const newAttributionControl = new maplibregl.AttributionControl({
            compact: true,
          });
          map.current!.addControl(newAttributionControl, "bottom-right");
          attributionControlRef.current = newAttributionControl;
        });

        // Handle style load errors with fallback
        map.current.once("error", (e) => {
          console.error("Map style loading error:", e.error);
          toast.error(
            t("map.layerLoadError") ||
              "Failed to load map layer, using default layer",
          );

          // Fallback to the original "darkmatter" raster layer
          const fallbackLayer =
            MAP_LAYERS.find((l) => l.id === "darkmatter") || MAP_LAYERS[0];
          if (fallbackLayer && fallbackLayer.id !== currentLayer.id) {
            handleLayerChange(fallbackLayer);
          }
        });
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

        // For raster layers, update markers after style change
        map.current.once("styledata", () => {
          updateMarkers(filteredPlaces);

          // Re-add pathfinding elements if active
          if (isPathfindingActive && pathfindingRouteGeometry.length > 0) {
            addPathToMap(pathfindingRouteGeometry);
          }

          // Re-add the attribution control with updated attribution
          const newAttributionControl = new maplibregl.AttributionControl({
            compact: true,
          });
          map.current!.addControl(newAttributionControl, "bottom-right");
          attributionControlRef.current = newAttributionControl;
        });
      }
    } catch (error) {
      console.error("Error changing map layer:", error);
      toast.error(t("map.layerChangeError") || "Error changing map layer");

      // Fallback to the original "darkmatter" raster layer
      const fallbackLayer =
        MAP_LAYERS.find((l) => l.id === "darkmatter") || MAP_LAYERS[0];
      if (fallbackLayer && fallbackLayer.id !== currentLayer.id) {
        handleLayerChange(fallbackLayer);
      }
    }
  };

  // Handle map move to update tooltip position when map moves
  useEffect(() => {
    if (!map.current || !hoveredPlace) return;

    const handleMapMove = () => {
      // If we have a hovered place, update its tooltip position when map moves
      if (hoveredPlace) {
        // Convert the place's coordinates to screen coordinates
        const screenCoords = map.current!.project(
          hoveredPlace.center.coordinates as [number, number],
        );
        // Adjust coordinates to be relative to the screen (not map container)
        const mapRect = mapContainer.current?.getBoundingClientRect();
        setTooltipPosition({
          x: screenCoords.x + (mapRect?.left || 0),
          y: screenCoords.y + (mapRect?.top || 0),
        });
      }
    };

    map.current.on("move", handleMapMove);

    return () => {
      if (map.current) {
        map.current.off("move", handleMapMove);
      }
    };
  }, [hoveredPlace]);

  // Pathfinding state
  const isPathfindingActive = useMapStore((state) => state.isPathfindingActive);
  const pathfindingStartLocation = useMapStore(
    (state) => state.pathfindingStartLocation,
  );
  const pathfindingPlaces = useMapStore((state) => state.pathfindingPlaces);
  const pathfindingPath = useMapStore((state) => state.pathfindingPath);
  const pathfindingTotalDistance = useMapStore(
    (state) => state.pathfindingTotalDistance,
  );
  const pathfindingRouteGeometry = useMapStore(
    (state) => state.pathfindingRouteGeometry,
  );
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([]);

  // Add the path to the map
  const addPathToMap = (path: [number, number][]) => {
    if (!map.current) return;

    // Remove existing route if it exists
    if (map.current.getLayer("route")) {
      map.current.removeLayer("route");
    }
    if (map.current.getSource("route")) {
      map.current.removeSource("route");
    }

    // Add path if there's more than one point
    if (path.length > 1) {
      const route = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: path,
        },
      };

      // Add route source
      map.current.addSource("route", {
        type: "geojson",
        data: route as any,
      });

      // Add route layer
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

      // Add start marker
      if (pathfindingStartLocation) {
        // Remove existing start marker if it exists
        if (map.current.getLayer("start-marker")) {
          map.current.removeLayer("start-marker");
        }
        if (map.current.getSource("start-marker")) {
          map.current.removeSource("start-marker");
        }

        const startMarker = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: pathfindingStartLocation,
          },
          properties: {
            title: "شما",
          },
        };

        map.current.addSource("start-marker", {
          type: "geojson",
          data: startMarker,
        });

        map.current.addLayer({
          id: "start-marker",
          type: "circle",
          source: "start-marker",
          paint: {
            "circle-radius": 10,
            "circle-color": "#10B981", // Green for start
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
          },
        });
      }

      // Add place markers for each stop
      pathfindingPath.forEach((place, index) => {
        const markerId = `place-marker-${index}`;
        const sourceId = `place-source-${index}`;

        // Remove existing marker if it exists
        if (map && map.current && map.current.getLayer(markerId)) {
          map.current.removeLayer(markerId);
        }
        if (map && map.current && map.current.getSource(sourceId)) {
          map.current.removeSource(sourceId);
        }

        const placeMarker = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: place.coordinates,
          },
          properties: {
            title: place.name,
            index: index + 1,
          },
        };

        map.current!.addSource(sourceId, {
          type: "geojson",
          data: placeMarker,
        });

        map.current!.addLayer({
          id: markerId,
          type: "circle",
          source: sourceId,
          paint: {
            "circle-radius": index === 0 ? 10 : 8, // Make first place slightly larger
            "circle-color": index === 0 ? "#F59E0B" : "#EF4444", // Yellow for first, red for others
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
          },
        });
      });
    }
  };

  // Effect to handle path updates
  useEffect(() => {
    if (isPathfindingActive && pathfindingRouteGeometry.length > 0) {
      setRouteGeometry(pathfindingRouteGeometry);

      // Wait for map to be loaded before adding path
      if (map.current) {
        addPathToMap(pathfindingRouteGeometry);

        // Fit map to show the entire route
        const bounds = new maplibregl.LngLatBounds();
        pathfindingRouteGeometry.forEach((coord) => bounds.extend(coord));
        map.current.fitBounds(bounds, {
          padding: {
            top: 100,
            bottom: 190, // Increased padding for bottom to account for timeline
            left: 100,
            right: 100,
          },
        });
      }
    } else if (!isPathfindingActive) {
      // Remove path if pathfinding is not active
      if (map.current) {
        if (map.current.getLayer("route")) {
          map.current.removeLayer("route");
        }
        if (map.current.getSource("route")) {
          map.current.removeSource("route");
        }
        if (map.current.getLayer("start-marker")) {
          map.current.removeLayer("start-marker");
        }
        if (map.current.getSource("start-marker")) {
          map.current.removeSource("start-marker");
        }

        // Remove all place markers
        pathfindingPath.forEach((_, index) => {
          const markerId = `place-marker-${index}`;
          const sourceId = `place-source-${index}`;

          if (map.current && map.current.getLayer(markerId)) {
            map.current.removeLayer(markerId);
          }
          if (map.current && map.current.getSource(sourceId)) {
            map.current.removeSource(sourceId);
          }
        });
      }
      setRouteGeometry([]);
    }
  }, [isPathfindingActive, pathfindingRouteGeometry, pathfindingPath]);

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
      map.current.fitBounds(bounds, {
        padding: {
          top: 100,
          bottom: 190, // Increased padding for bottom to account for timeline
          left: 100,
          right: 100,
        },
      });
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
        <div
          ref={mapContainer}
          className="w-full h-full bg-[#0a0a00]"
          lang="fa"
        />

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

        {/* Layer control */}
        <LayerControl
          layers={MAP_LAYERS}
          currentLayer={currentLayer}
          onLayerChange={handleLayerChange}
        />

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

        {/* Stats indicator positioned just below LayerControl - stretches on hover */}
        <MapStatsIndicator count={filteredPlaces.length} />

        {/* Place Details Modal */}
        {selectedPlace && showPlaceDetails && (
          <PlaceDetailsModal
            placeId={selectedPlace._id!}
            onClose={() => setShowPlaceDetails(false)}
          />
        )}

        {/* Place Hover Tooltip */}
        {hoveredPlace && (
          <PlaceHoverTooltip place={hoveredPlace} position={tooltipPosition} />
        )}
      </div>
    </>
  );
};

export default InteractiveMap;
