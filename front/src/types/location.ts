// Purpose: TypeScript type definitions for location-related data structures

export type LocationCategory =
  | 'restaurant'
  | 'hotel'
  | 'attraction'
  | 'shopping'
  | 'entertainment'
  | 'transport'
  | 'health'
  | 'education'
  | 'service'
  | 'other';

export type PriceRange = 'budget' | 'mid-range' | 'luxury';

export type LocationStatus = 'active' | 'pending' | 'rejected' | 'archived';

export interface Location {
  id: string;
  name: string;
  description?: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;

  // Contact information
  phone?: string;
  email?: string;
  website?: string;

  // Media
  images?: string[];
  videos?: string[];

  // Rating and reviews
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];

  // Business information
  hours?: OpeningHours;
  priceRange?: PriceRange;
  amenities?: string[];
  tags?: string[];

  // Status and metadata
  status: LocationStatus;
  isVerified: boolean;
  isOpen?: boolean;
  isFeatured?: boolean;

  // User interaction
  isFavorite?: boolean;
  distance?: number; // Distance from user's current location in km

  // Timestamps
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy?: string;

  // Additional properties
  properties?: Record<string, any>;
}

export interface Review {
  id: string;
  locationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
  holidays?: DayHours;
}

export interface DayHours {
  open: string; // Format: "HH:MM"
  close: string; // Format: "HH:MM"
  isClosed?: boolean;
  isAllDay?: boolean;
}

export interface LocationBounds {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}

export interface LocationFilters {
  category?: LocationCategory | null;
  search?: string;
  bounds?: LocationBounds | null;
  minRating?: number;
  maxDistance?: number | null; // in kilometers
  priceRange?: PriceRange | null;
  amenities?: string[];
  tags?: string[];
  isOpen?: boolean;
  isVerified?: boolean;
  isFeatured?: boolean;
  sortBy?: 'name' | 'rating' | 'distance' | 'created_at' | 'updated_at';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface CreateLocationData {
  name: string;
  description?: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  images?: string[];
  hours?: OpeningHours;
  priceRange?: PriceRange;
  amenities?: string[];
  tags?: string[];
  properties?: Record<string, any>;
}

export interface UpdateLocationData extends Partial<CreateLocationData> {
  id: string;
}

export interface LocationSearchResult {
  locations: Location[];
  total: number;
  hasMore: boolean;
  filters: LocationFilters;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  category: LocationCategory;
  address?: string;
  distance?: number;
}

export interface LocationStats {
  totalLocations: number;
  verifiedLocations: number;
  averageRating: number;
  categoryDistribution: Record<LocationCategory, number>;
  recentAdditions: number;
}

// Geolocation types
export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface GeolocationPosition {
  coords: Coordinates;
  timestamp: number;
}

export interface GeolocationError {
  code: number;
  message: string;
}

// Map interaction types
export interface MapClickEvent {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface MarkerClickEvent {
  location: Location;
  coordinates: { latitude: number; longitude: number };
}

// API response types
export interface LocationAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LocationListResponse extends LocationAPIResponse {
  data: {
    locations: Location[];
    total: number;
    hasMore: boolean;
    page: number;
    limit: number;
  };
}

export interface LocationDetailResponse extends LocationAPIResponse {
  data: Location;
}

// Form types
export interface LocationFormData {
  name: string;
  description: string;
  category: LocationCategory;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  priceRange: PriceRange;
  amenities: string[];
  tags: string[];
  images: File[];
}

export interface LocationFormErrors {
  name?: string;
  description?: string;
  category?: string;
  latitude?: string;
  longitude?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  general?: string;
}

// Constants
export const LOCATION_CATEGORIES: Record<LocationCategory, string> = {
  restaurant: 'Restaurant',
  hotel: 'Hotel',
  attraction: 'Attraction',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  transport: 'Transport',
  health: 'Health',
  education: 'Education',
  service: 'Service',
  other: 'Other',
};

export const PRICE_RANGES: Record<PriceRange, string> = {
  budget: 'Budget',
  'mid-range': 'Mid-range',
  luxury: 'Luxury',
};

export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'rating', label: 'Rating' },
  { value: 'distance', label: 'Distance' },
  { value: 'created_at', label: 'Date Added' },
] as const;

export const DEFAULT_MAP_CENTER = {
  latitude: 35.6892,
  longitude: 51.3890, // Tehran, Iran
};

export const DEFAULT_MAP_ZOOM = 10;
