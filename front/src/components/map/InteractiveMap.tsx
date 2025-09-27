"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useMapStore } from "@/stores/mapStore";
import { useAuth } from "@/context/AuthContext";
import MapControls from "./MapControls";
import PlacePopup from "@/components/map/PlacePopup";
import PlaceSidebar from "@/components/map/PlaceSidebar";
import RoutePanel from "@/components/map/RoutePanel";
import MapLayerSwitcher from "@/components/map/MapLayerSwitcher";

// Types
interface Place {
  _id: string;
  name: string;
  description: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
  category?: string;
  tags?: string[];
  images?: string[];
  rating?: number;
  address?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
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

const InteractiveMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRoutePanel, setShowRoutePanel] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<MapLayer>(MAP_LAYERS[0]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [routeStart, setRouteStart] = useState<[number, number] | null>(null);
  const [routeEnd, setRouteEnd] = useState<[number, number] | null>(null);

  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const { filters, searchQuery, center, zoom, setCenter, setZoom } =
    useMapStore();

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

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Add geolocate control
    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });
    map.current.addControl(geolocateControl, "top-right");

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
      }
    });

    // Load places data (mock data for now)
    loadPlaces();

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, []);

  // Load places from backend
  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/places');
      // const data = await response.json();

      // Mock data for demonstration
      const mockPlaces: Place[] = [
        {
          _id: "1",
          name: "آرامگاه حافظ",
          description: "آرامگاه حافظ شیرازی، شاعر بزرگ ایران",
          center: { type: "Point", coordinates: [52.5589, 29.6257] },
          category: "historical",
          tags: ["تاریخی", "فرهنگی", "شیراز"],
          rating: 4.8,
          address: "شیراز، خیابان حافظ",
        },
        {
          _id: "2",
          name: "برج آزادی",
          description: "نماد شهر تهران و یادبود ورود به دروازه تمدن",
          center: { type: "Point", coordinates: [51.3381, 35.6997] },
          category: "monument",
          tags: ["یادبود", "معماری", "تهران"],
          rating: 4.6,
          address: "تهران، میدان آزادی",
        },
        {
          _id: "3",
          name: "پل خواجو",
          description: "یکی از زیباترین پل‌های تاریخی اصفهان",
          center: { type: "Point", coordinates: [51.681, 32.6353] },
          category: "historical",
          tags: ["پل", "معماری", "اصفهان"],
          rating: 4.7,
          address: "اصفهان، زاینده‌رود",
        },
      ];

      setPlaces(mockPlaces);
      setFilteredPlaces(mockPlaces);
      addMarkers(mockPlaces);
    } catch (error) {
      console.error("Error loading places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add markers to map
  const addMarkers = (placesToAdd: Place[]) => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    placesToAdd.forEach((place) => {
      // Create custom marker element
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundImage = getMarkerIcon(place.category);
      el.style.backgroundSize = "cover";
      el.style.cursor = "pointer";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      el.style.transition = "transform 0.2s";

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.1)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1)";
      });

      // Create marker
      const marker = new maplibregl.Marker({
        element: el,
        anchor: "center",
      })
        .setLngLat(place.center.coordinates)
        .setPopup(
          new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
              <div class="p-3 min-w-[200px] max-w-[300px]">
                <h3 class="font-semibold text-lg mb-1">${place.name}</h3>
                <p class="text-sm text-gray-600 mb-2">${place.description}</p>
                ${
                  place.rating
                    ? `
                  <div class="flex items-center gap-1 mb-2">
                    <span class="text-yellow-500">★</span>
                    <span class="text-sm">${place.rating}</span>
                  </div>
                `
                    : ""
                }
                ${
                  place.address
                    ? `
                  <p class="text-xs text-gray-500">📍 ${place.address}</p>
                `
                    : ""
                }
              </div>
            `),
        )
        .addTo(map.current!);

      // Handle marker click
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedPlace(place);
        setShowSidebar(true);

        // Fly to location
        map.current?.flyTo({
          center: place.center.coordinates,
          zoom: 14,
          essential: true,
        });
      });

      markersRef.current.set(place._id, marker);
    });
  };

  // Get marker icon based on category
  const getMarkerIcon = (category?: string): string => {
    const iconMap: { [key: string]: string } = {
      historical:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23a855f7" viewBox="0 0 24 24"%3E%3Cpath d="M12 2l3 7h7l-5.5 4 2 7-6.5-5-6.5 5 2-7L2 9h7l3-7z"%3E%3C/path%3E%3C/svg%3E\')',
      monument:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%233b82f6" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"%3E%3C/path%3E%3C/svg%3E\')',
      nature:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%2310b981" viewBox="0 0 24 24"%3E%3Cpath d="M14 6l-4.22 5.63 1.25 1.67L14 9.33 19 16h-8.46l-4.01-5.37L1 18h22L14 6zM5 16l1.52-2.03L8.04 16H5z"%3E%3C/path%3E%3C/svg%3E\')',
      default:
        'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="%23ef4444" viewBox="0 0 24 24"%3E%3Cpath d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"%3E%3C/path%3E%3C/svg%3E\')',
    };
    return iconMap[category || "default"] || iconMap.default;
  };

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
    </div>
  );
};

export default InteractiveMap;
