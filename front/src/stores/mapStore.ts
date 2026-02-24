// Purpose: Zustand store for managing map state including center, zoom, style, and layers

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import maplibregl from "maplibre-gl";

export interface MapBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export interface MapCenter {
  lat: number;
  lng: number;
}

interface MapState {
  // Map instance
  map: maplibregl.Map | null;

  // Map configuration
  center: MapCenter;
  zoom: number;
  style: string;
  bounds: MapBounds | null;

  // Layer toggles
  showTraffic: boolean;
  showTerrain: boolean;
  showClusters: boolean;

  // UI state
  isLoading: boolean;
  error: string | null;
  showCategoryList: boolean;

  // Interaction modes
  isAddingLocation: boolean;
  isDrawingPolygon: boolean;
  selectedLocationId: string | null;

  // Search and filters
  searchQuery: string;
  filters: {
    categories?: string[];
    tags?: string[];
    rating?: number;
    distance?: number;
    antiquity?: number;
    name?: string;
    slug?: string;
    status?: string;
    province?: string;
    city?: string;
    registrarId?: string;
    categoryIds?: string[];
    tagIds?: string[];
    maxDistance?: number;
    minDistance?: number;
    area?: {
      type: "Polygon";
      coordinates: number[][][];
    };
  };

  // Pathfinding
  isPathfindingActive: boolean;
  pathfindingStartLocation: [number, number] | null;
  pathfindingPlaces: {
    coordinates: [number, number];
    name: string;
    id: string;
  }[];
  pathfindingPath: {
    coordinates: [number, number];
    name: string;
    id: string;
  }[];
  pathfindingTotalDistance: number;
  pathfindingRouteGeometry: [number, number][];

  // Actions
  setMap: (map: maplibregl.Map | null) => void;
  setCenter: (center: MapCenter) => void;
  setZoom: (zoom: number) => void;
  setStyle: (style: string) => void;
  setBounds: (bounds: MapBounds | null) => void;
  setShowTraffic: (show: boolean) => void;
  setShowTerrain: (show: boolean) => void;
  setShowClusters: (show: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsAddingLocation: (isAdding: boolean) => void;
  setIsDrawingPolygon: (isDrawing: boolean) => void;
  setSelectedLocationId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setShowCategoryList: (show: boolean) => void;
  setAntiquityFilter: (antiquity: number | undefined) => void;
  setFilters: (filters: Partial<MapState["filters"]>) => void;
  setPlaceFilters: (filters: Partial<MapState["filters"]>) => void;
  setAreaFilter: (area: { type: "Polygon"; coordinates: number[][][] } | null) => void;

  // Pathfinding actions
  setIsPathfindingActive: (active: boolean) => void;
  setPathfindingStartLocation: (location: [number, number] | null) => void;
  setPathfindingPlaces: (
    places: { coordinates: [number, number]; name: string; id: string }[],
  ) => void;
  setPathfindingPath: (path: { coordinates: [number, number]; name: string; id: string }[]) => void;
  setPathfindingTotalDistance: (distance: number) => void;
  setPathfindingRouteGeometry: (geometry: [number, number][]) => void;
  resetPathfinding: () => void;

  // Convenience methods
  flyTo: (center: MapCenter, zoom?: number) => void;
  fitToBounds: (bounds: MapBounds, padding?: number) => void;
  resetView: () => void;
  getCurrentBounds: () => MapBounds | null;
}

// Default map center (Tehran, Iran)
const DEFAULT_CENTER: MapCenter = {
  lat: 35.6892,
  lng: 51.389,
};

const DEFAULT_ZOOM = 10;
const DEFAULT_STYLE = "https://api.maptiler.com/maps/streets/style.json?key=YOUR_MAPTILER_KEY";

export const useMapStore = create<MapState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        map: null,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        style: DEFAULT_STYLE,
        bounds: null,
        showTraffic: false,
        showTerrain: false,
        showClusters: true,
        isLoading: false,
        error: null,
        showCategoryList: true,
        isAddingLocation: false,
        isDrawingPolygon: false,
        selectedLocationId: null,
        searchQuery: "",
        filters: {},
        isPathfindingActive: false,
        pathfindingStartLocation: null,
        pathfindingPlaces: [],
        pathfindingPath: [],
        pathfindingTotalDistance: 0,
        pathfindingRouteGeometry: [],

        // Basic setters
        setMap: (map) => set({ map }),
        setCenter: (center) => set({ center }),
        setZoom: (zoom) => set({ zoom }),
        setStyle: (style) => set({ style }),
        setBounds: (bounds) => set({ bounds }),
        setShowTraffic: (showTraffic) => set({ showTraffic }),
        setShowTerrain: (showTerrain) => set({ showTerrain }),
        setShowClusters: (showClusters) => set({ showClusters }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setIsAddingLocation: (isAddingLocation) => set({ isAddingLocation }),
        setIsDrawingPolygon: (isDrawingPolygon) => set({ isDrawingPolygon }),
        setSelectedLocationId: (selectedLocationId) => set({ selectedLocationId }),
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        setShowCategoryList: (showCategoryList) => set({ showCategoryList }),
        setAntiquityFilter: (antiquity) =>
          set((state) => ({
            filters: { ...state.filters, antiquity },
          })),
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),
        setPlaceFilters: (newPlaceFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newPlaceFilters },
          })),
        setAreaFilter: (area) =>
          set((state) => ({
            filters: { ...state.filters, area: area || undefined },
          })),

        // Pathfinding setters
        setIsPathfindingActive: (isPathfindingActive) => set({ isPathfindingActive }),
        setPathfindingStartLocation: (pathfindingStartLocation) => set({ pathfindingStartLocation }),
        setPathfindingPlaces: (pathfindingPlaces) => set({ pathfindingPlaces }),
        setPathfindingPath: (pathfindingPath) => set({ pathfindingPath }),
        setPathfindingTotalDistance: (pathfindingTotalDistance) => set({ pathfindingTotalDistance }),
        setPathfindingRouteGeometry: (pathfindingRouteGeometry) => set({ pathfindingRouteGeometry }),
        resetPathfinding: () =>
          set({
            isPathfindingActive: false,
            pathfindingStartLocation: null,
            pathfindingPlaces: [],
            pathfindingPath: [],
            pathfindingTotalDistance: 0,
            pathfindingRouteGeometry: [],
          }),

        // Convenience methods
        flyTo: (center, zoom) => {
          const { map } = get();
          if (map) {
            map.flyTo({
              center: [center.lng, center.lat],
              zoom: zoom || get().zoom,
              duration: 1000,
            });
          }
          set({ center, zoom: zoom || get().zoom });
        },

        fitToBounds: (bounds, padding = 50) => {
          const { map } = get();
          if (map) {
            map.fitBounds(
              [
                [bounds.sw.lng, bounds.sw.lat],
                [bounds.ne.lng, bounds.ne.lat],
              ],
              { padding },
            );
          }
          set({ bounds });
        },

        resetView: () => {
          const { map } = get();
          if (map) {
            map.flyTo({
              center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
              zoom: DEFAULT_ZOOM,
              duration: 1000,
            });
          }
          set({
            center: DEFAULT_CENTER,
            zoom: DEFAULT_ZOOM,
            bounds: null,
            selectedLocationId: null,
            isAddingLocation: false,
            isDrawingPolygon: false,
            searchQuery: "",
            filters: {},
          });
        },

        getCurrentBounds: () => {
          const { map } = get();
          if (!map) return null;

          const bounds = map.getBounds();
          return {
            sw: { lat: bounds.getSouth(), lng: bounds.getWest() },
            ne: { lat: bounds.getNorth(), lng: bounds.getEast() },
          };
        },
      }),
      {
        name: "map-store",
        // Only persist certain values
        partialize: (state) => ({
          center: state.center,
          zoom: state.zoom,
          style: state.style,
          showTraffic: state.showTraffic,
          showTerrain: state.showTerrain,
          showClusters: state.showClusters,
        }),
      },
    ),
    {
      name: "map-store",
    },
  ),
);

// Selectors for commonly used combinations
export const useMapCenter = () => useMapStore((state) => state.center);
export const useMapZoom = () => useMapStore((state) => state.zoom);
export const useMapStyle = () => useMapStore((state) => state.style);
export const useMapBounds = () => useMapStore((state) => state.bounds);
export const useMapLoading = () => useMapStore((state) => state.isLoading);
export const useMapError = () => useMapStore((state) => state.error);
export const useSelectedLocation = () => useMapStore((state) => state.selectedLocationId);
export const useInteractionModes = () =>
  useMapStore((state) => ({
    isAddingLocation: state.isAddingLocation,
    isDrawingPolygon: state.isDrawingPolygon,
  }));
