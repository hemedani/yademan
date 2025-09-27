export interface Location {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  historicalPeriod?: string;
  features: string[];
  accessibility?: string;
  visitingHours?: string;
  ticketPrice?: string;
  website?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationsResponse {
  locations: Location[];
  total: number;
  page: number;
  limit: number;
}

export interface LocationsFilters {
  category?: string;
  rating?: number;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  page?: number;
  limit?: number;
}

// Mock data for demonstration
const mockLocations: Location[] = [
  {
    id: "1",
    title: "تخت جمشید",
    description:
      "تخت جمشید یکی از مهم‌ترین آثار باستانی ایران و از میراث جهانی یونسکو است که در دوره هخامنشی ساخته شده است.",
    category: "مکان تاریخی",
    rating: 4.8,
    reviewCount: 1250,
    images: [
      "/images/persepolis-1.jpg",
      "/images/persepolis-2.jpg",
      "/images/persepolis-3.jpg",
    ],
    address: "فارس، ایران، مرودشت",
    coordinates: { lat: 29.9356, lng: 52.8916 },
    historicalPeriod: "دوره هخامنشی",
    features: ["معماری کهن", "نقوش سنگی", "محوطه باستانی", "میراث جهانی"],
    accessibility: "دسترسی آسان با وسایل نقلیه",
    visitingHours: "۸:۰۰ تا ۱۸:۰۰",
    ticketPrice: "۵۰,۰۰۰ تومان",
    website: "https://persepolis.ir",
    phone: "۰۷۱-۱۲۳۴۵۶۷۸",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    title: "میدان نقش جهان",
    description:
      "میدان نقش جهان در اصفهان یکی از بزرگ‌ترین میادین جهان و از میراث جهانی یونسکو است.",
    category: "میراث جهانی",
    rating: 4.9,
    reviewCount: 850,
    images: ["/images/naghsh-jahan-1.jpg", "/images/naghsh-jahan-2.jpg"],
    address: "اصفهان، میدان امام",
    coordinates: { lat: 32.6575, lng: 51.6779 },
    historicalPeriod: "دوره صفویه",
    features: ["معماری اسلامی", "بازار تاریخی", "مسجد شاه", "کاخ عالی قاپو"],
    accessibility: "دسترسی آسان با متروی اصفهان",
    visitingHours: "۶:۰۰ تا ۲۲:۰۰",
    ticketPrice: "رایگان",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    title: "برج آزادی",
    description:
      "برج آزادی نماد شهر تهران و یکی از مهم‌ترین بناهای یادبود ایران است.",
    category: "بنای یادبود",
    rating: 4.6,
    reviewCount: 2100,
    images: [
      "/images/azadi-tower-1.jpg",
      "/images/azadi-tower-2.jpg",
      "/images/azadi-tower-3.jpg",
    ],
    address: "تهران، میدان آزادی",
    coordinates: { lat: 35.6958, lng: 51.3384 },
    historicalPeriod: "دوره پهلوی",
    features: ["معماری مدرن", "موزه", "منظره شهری", "نمای شبانه"],
    accessibility: "دسترسی با مترو و اتوبوس",
    visitingHours: "۹:۰۰ تا ۱۷:۰۰",
    ticketPrice: "۳۰,۰۰۰ تومان",
    website: "https://azaditower.ir",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

export async function getLocations(
  filters: LocationsFilters = {},
): Promise<LocationsResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredLocations = [...mockLocations];

  // Apply filters
  if (filters.category) {
    filteredLocations = filteredLocations.filter((location) =>
      location.category.includes(filters.category!),
    );
  }

  if (filters.rating) {
    filteredLocations = filteredLocations.filter(
      (location) => location.rating >= filters.rating!,
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredLocations = filteredLocations.filter(
      (location) =>
        location.title.toLowerCase().includes(searchTerm) ||
        location.description.toLowerCase().includes(searchTerm) ||
        location.address.toLowerCase().includes(searchTerm),
    );
  }

  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedLocations = filteredLocations.slice(startIndex, endIndex);

  return {
    locations: paginatedLocations,
    total: filteredLocations.length,
    page,
    limit,
  };
}

export async function getLocationById(id: string): Promise<Location | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const location = mockLocations.find((loc) => loc.id === id);
  return location || null;
}

export async function getRelatedLocations(
  locationId: string,
  limit: number = 3,
): Promise<Location[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const currentLocation = mockLocations.find((loc) => loc.id === locationId);
  if (!currentLocation) return [];

  // Find locations with similar category or nearby
  const relatedLocations = mockLocations
    .filter((loc) => loc.id !== locationId)
    .filter((loc) => loc.category === currentLocation.category)
    .slice(0, limit);

  return relatedLocations;
}

export async function searchLocations(query: string): Promise<Location[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();
  return mockLocations.filter(
    (location) =>
      location.title.toLowerCase().includes(searchTerm) ||
      location.description.toLowerCase().includes(searchTerm) ||
      location.address.toLowerCase().includes(searchTerm) ||
      location.category.toLowerCase().includes(searchTerm),
  );
}

export async function getNearbyLocations(
  lat: number,
  lng: number,
  radius: number = 50,
): Promise<Location[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // Simple distance calculation (not accurate for real use)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return mockLocations.filter((location) => {
    const distance = calculateDistance(
      lat,
      lng,
      location.coordinates.lat,
      location.coordinates.lng,
    );
    return distance <= radius;
  });
}

export interface CreateLocationRequest {
  title: string;
  description: string;
  category: string;
  images: string[];
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  historicalPeriod?: string;
  features: string[];
  accessibility?: string;
  visitingHours?: string;
  ticketPrice?: string;
  website?: string;
  phone?: string;
}

export interface UpdateLocationRequest extends Partial<CreateLocationRequest> {
  id: string;
}

export async function createLocation(
  data: CreateLocationRequest,
): Promise<Location> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const newLocation: Location = {
    id: Math.random().toString(36).substring(2, 15),
    ...data,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // In a real app, this would save to the database
  mockLocations.push(newLocation);

  return newLocation;
}

export async function updateLocation(
  data: UpdateLocationRequest,
): Promise<Location | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const index = mockLocations.findIndex((loc) => loc.id === data.id);
  if (index === -1) return null;

  const updatedLocation = {
    ...mockLocations[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // In a real app, this would update the database
  mockLocations[index] = updatedLocation;

  return updatedLocation;
}

export async function deleteLocation(id: string): Promise<boolean> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const index = mockLocations.findIndex((loc) => loc.id === id);
  if (index === -1) return false;

  // In a real app, this would delete from the database
  mockLocations.splice(index, 1);

  return true;
}
