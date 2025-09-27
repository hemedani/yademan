export interface Category {
  _id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  registrar?: {
    _id: string;
    first_name: string;
    last_name: string;
    father_name?: string;
    gender?: string;
    birth_date?: string;
    summary?: string;
    address?: string;
    level?: string;
    email: string;
    is_verified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface CategoryFormData {
  name: string;
  description: string;
  color?: string;
  icon?: string;
}

export interface CategoryUpdateData extends CategoryFormData {
  _id: string;
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  name?: string;
}

// Extended available icons list for categories
export const availableIcons = [
  "🍽️", // Restaurant & Cafe
  "🏛️", // Museum & Gallery
  "🌳", // Park & Green Space
  "🕌", // Mosque & Shrine
  "🏪", // Shop & Store
  "🏥", // Hospital & Medical
  "🎭", // Theater & Performance
  "🏋️", // Gym & Sports
  "☕", // Coffee Shop
  "🛍️", // Shopping Center
  "🏨", // Hotel & Accommodation
  "⛽", // Gas Station
  "💊", // Pharmacy
  "📚", // Library & Books
  "🎪", // Entertainment
  "🏊", // Swimming Pool
  "📍", // General Location
  "🎯", // Target & Goal
  "🎨", // Art & Creativity
  "🎵", // Music & Audio
  "💼", // Business & Office
  "🚗", // Car & Auto
  "✈️", // Airport & Travel
  "🎢", // Amusement Park
  "🏰", // Castle & Fort
  "🏯", // Temple & Palace
  "🏟️", // Stadium & Arena
  "🎓", // Education & School
  "🏦", // Bank & Finance
  "🚉", // Train Station
  "🚌", // Bus Station
  "🚢", // Port & Harbor
  "🏢", // Office Building
  "🏭", // Factory & Industry
  "🌉", // Bridge & Infrastructure
  "⛪", // Church
  "🕍", // Synagogue
  "⛩️", // Shrine
  "🕋", // Kaaba & Sacred
  "🌍", // World & Global
  "🏖️", // Beach & Resort
  "⛰️", // Mountain & Nature
  "🏗️", // Construction
  "🎡", // Ferris Wheel
  "🎰", // Casino & Gaming
  "🏪", // Convenience Store
  "🍕", // Pizza & Fast Food
  "🍔", // Burger Restaurant
  "🍜", // Noodle & Asian Food
];

// Extended available colors list
export const availableColors = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#A855F7", // Violet
  "#F43F5E", // Rose
  "#22C55E", // Emerald
  "#0EA5E9", // Sky
  "#FACC15", // Yellow
  "#64748B", // Slate
  "#71717A", // Zinc
  "#737373", // Neutral
  "#78716C", // Stone
  "#DC2626", // Red 600
  "#059669", // Emerald 600
  "#2563EB", // Blue 600
  "#7C3AED", // Violet 600
  "#DB2777", // Pink 600
  "#EA580C", // Orange 600
  "#65A30D", // Lime 600
  "#0891B2", // Cyan 600
  "#4338CA", // Indigo 700
  "#B91C1C", // Red 700
];

// Helper function to transform backend category to frontend format
export const transformCategory = (backendCategory: any): Category => {
  return {
    _id: backendCategory._id || "",
    name: backendCategory.name || "",
    description: backendCategory.description || "",
    color: backendCategory.color || "#3B82F6",
    icon: backendCategory.icon || "📍",
    createdAt: backendCategory.createdAt || new Date().toISOString(),
    updatedAt: backendCategory.updatedAt || new Date().toISOString(),
    registrar: backendCategory.registrar,
  };
};

// Helper function to get default category values
export const getDefaultCategoryFormData = (): CategoryFormData => {
  return {
    name: "",
    description: "",
    icon: "📍",
    color: "#3B82F6",
  };
};
