// Purpose: Zustand store for managing location data, filters, and favorites

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { Location, LocationFilters, LocationCategory } from '@/types/location';

interface LocationState {
  // Location data
  locations: Location[];
  filteredLocations: Location[];
  favoriteLocations: Location[];
  selectedLocation: Location | null;

  // Loading states
  isLoading: boolean;
  isFavoritesLoading: boolean;
  error: string | null;

  // Filters
  filters: LocationFilters;
  searchQuery: string;
  selectedCategory: LocationCategory | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;

  // Actions
  setLocations: (locations: Location[]) => void;
  addLocation: (location: Location) => void;
  updateLocation: (id: string, updates: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  setSelectedLocation: (location: Location | null) => void;

  // Filter actions
  setFilters: (filters: Partial<LocationFilters>) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: LocationCategory | null) => void;
  clearFilters: () => void;

  // Favorites
  addToFavorites: (locationId: string) => void;
  removeFromFavorites: (locationId: string) => void;
  setFavoriteLocations: (locations: Location[]) => void;
  isFavorite: (locationId: string) => boolean;

  // Loading states
  setIsLoading: (loading: boolean) => void;
  setIsFavoritesLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Pagination
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setHasMore: (hasMore: boolean) => void;

  // Utility methods
  getLocationById: (id: string) => Location | undefined;
  getLocationsByCategory: (category: LocationCategory) => Location[];
  getNearbyLocations: (lat: number, lng: number, radius: number) => Location[];
  applyFilters: () => void;
  resetStore: () => void;
}

const DEFAULT_FILTERS: LocationFilters = {
  category: null,
  search: '',
  bounds: null,
  minRating: 0,
  maxDistance: null,
  priceRange: null,
  amenities: [],
  sortBy: 'name',
  sortOrder: 'asc',
  limit: 50,
  offset: 0,
};

export const useLocationStore = create<LocationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        locations: [],
        filteredLocations: [],
        favoriteLocations: [],
        selectedLocation: null,
        isLoading: false,
        isFavoritesLoading: false,
        error: null,
        filters: DEFAULT_FILTERS,
        searchQuery: '',
        selectedCategory: null,
        currentPage: 1,
        totalPages: 1,
        hasMore: false,

        // Location management
        setLocations: (locations) => {
          set({ locations });
          get().applyFilters();
        },

        addLocation: (location) => {
          const { locations } = get();
          const newLocations = [...locations, location];
          set({ locations: newLocations });
          get().applyFilters();
        },

        updateLocation: (id, updates) => {
          const { locations } = get();
          const newLocations = locations.map(location =>
            location.id === id ? { ...location, ...updates } : location
          );
          set({ locations: newLocations });
          get().applyFilters();

          // Update selected location if it's the one being updated
          const { selectedLocation } = get();
          if (selectedLocation?.id === id) {
            set({ selectedLocation: { ...selectedLocation, ...updates } });
          }
        },

        removeLocation: (id) => {
          const { locations, favoriteLocations } = get();
          const newLocations = locations.filter(location => location.id !== id);
          const newFavorites = favoriteLocations.filter(location => location.id !== id);

          set({
            locations: newLocations,
            favoriteLocations: newFavorites,
            selectedLocation: get().selectedLocation?.id === id ? null : get().selectedLocation
          });
          get().applyFilters();
        },

        setSelectedLocation: (location) => set({ selectedLocation: location }),

        // Filter management
        setFilters: (newFilters) => {
          const { filters } = get();
          const updatedFilters = { ...filters, ...newFilters };
          set({ filters: updatedFilters });
          get().applyFilters();
        },

        setSearchQuery: (query) => {
          set({ searchQuery: query });
          get().setFilters({ search: query });
        },

        setSelectedCategory: (category) => {
          set({ selectedCategory: category });
          get().setFilters({ category });
        },

        clearFilters: () => {
          set({
            filters: DEFAULT_FILTERS,
            searchQuery: '',
            selectedCategory: null,
            filteredLocations: get().locations
          });
        },

        // Favorites management
        addToFavorites: (locationId) => {
          const { locations, favoriteLocations } = get();
          const location = locations.find(l => l.id === locationId);

          if (location && !favoriteLocations.find(f => f.id === locationId)) {
            set({ favoriteLocations: [...favoriteLocations, location] });
          }
        },

        removeFromFavorites: (locationId) => {
          const { favoriteLocations } = get();
          const newFavorites = favoriteLocations.filter(location => location.id !== locationId);
          set({ favoriteLocations: newFavorites });
        },

        setFavoriteLocations: (locations) => set({ favoriteLocations: locations }),

        isFavorite: (locationId) => {
          const { favoriteLocations } = get();
          return favoriteLocations.some(location => location.id === locationId);
        },

        // Loading states
        setIsLoading: (isLoading) => set({ isLoading }),
        setIsFavoritesLoading: (isFavoritesLoading) => set({ isFavoritesLoading }),
        setError: (error) => set({ error }),

        // Pagination
        setCurrentPage: (currentPage) => set({ currentPage }),
        setTotalPages: (totalPages) => set({ totalPages }),
        setHasMore: (hasMore) => set({ hasMore }),

        // Utility methods
        getLocationById: (id) => {
          const { locations } = get();
          return locations.find(location => location.id === id);
        },

        getLocationsByCategory: (category) => {
          const { locations } = get();
          return locations.filter(location => location.category === category);
        },

        getNearbyLocations: (lat, lng, radius) => {
          const { locations } = get();
          return locations.filter(location => {
            const distance = calculateDistance(lat, lng, location.latitude, location.longitude);
            return distance <= radius;
          });
        },

        applyFilters: () => {
          const { locations, filters, searchQuery } = get();
          let filtered = [...locations];

          // Apply search filter
          if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(location =>
              location.name.toLowerCase().includes(query) ||
              location.description?.toLowerCase().includes(query) ||
              location.address?.toLowerCase().includes(query)
            );
          }

          // Apply category filter
          if (filters.category) {
            filtered = filtered.filter(location => location.category === filters.category);
          }

          // Apply rating filter
          if (filters.minRating && filters.minRating > 0) {
            filtered = filtered.filter(location =>
              location.rating && location.rating >= filters.minRating!
            );
          }

          // Apply bounds filter
          if (filters.bounds) {
            filtered = filtered.filter(location =>
              location.latitude >= filters.bounds!.sw.lat &&
              location.latitude <= filters.bounds!.ne.lat &&
              location.longitude >= filters.bounds!.sw.lng &&
              location.longitude <= filters.bounds!.ne.lng
            );
          }

          // Apply amenities filter
          if (filters.amenities && filters.amenities.length > 0) {
            filtered = filtered.filter(location =>
              location.amenities?.some(amenity =>
                filters.amenities!.includes(amenity)
              )
            );
          }

          // Apply sorting
          filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (filters.sortBy) {
              case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
              case 'rating':
                aValue = a.rating || 0;
                bValue = b.rating || 0;
                break;
              case 'created_at':
                aValue = new Date(a.createdAt || 0);
                bValue = new Date(b.createdAt || 0);
                break;
              default:
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
            }

            if (aValue < bValue) return filters.sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return filters.sortOrder === 'asc' ? 1 : -1;
            return 0;
          });

          set({ filteredLocations: filtered });
        },

        resetStore: () => {
          set({
            locations: [],
            filteredLocations: [],
            selectedLocation: null,
            isLoading: false,
            error: null,
            filters: DEFAULT_FILTERS,
            searchQuery: '',
            selectedCategory: null,
            currentPage: 1,
            totalPages: 1,
            hasMore: false,
          });
        },
      }),
      {
        name: 'location-store',
        // Only persist certain values
        partialize: (state) => ({
          favoriteLocations: state.favoriteLocations,
          filters: state.filters,
          selectedCategory: state.selectedCategory,
        }),
      }
    ),
    {
      name: 'location-store',
    }
  )
);

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Selectors for commonly used combinations
export const useFilteredLocations = () => useLocationStore((state) => state.filteredLocations);
export const useFavoriteLocations = () => useLocationStore((state) => state.favoriteLocations);
export const useSelectedLocation = () => useLocationStore((state) => state.selectedLocation);
export const useLocationFilters = () => useLocationStore((state) => state.filters);
export const useLocationLoading = () => useLocationStore((state) => state.isLoading);
export const useLocationError = () => useLocationStore((state) => state.error);
export const useSearchQuery = () => useLocationStore((state) => state.searchQuery);
export const useSelectedCategory = () => useLocationStore((state) => state.selectedCategory);
