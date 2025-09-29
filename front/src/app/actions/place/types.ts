export type PlaceStatus = "draft" | "active" | "archived";

export interface PlaceContact {
  phone?: string;
  email?: string;
  website?: string;
  social?: string[];
}

export interface PlaceCenter {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface PlaceArea {
  type: "MultiPolygon";
  coordinates: number[][][][];
}

export interface PlaceMetadata {
  views?: number;
  favorites?: number;
  rating?: number;
}

export interface PlaceGalleryItem {
  _id: string;
  name: string;
  alt_text?: string;
}

export interface PlaceTag {
  _id: string;
  name: string;
  color?: string;
}

export interface PlaceCategory {
  _id: string;
  name: string;
  color?: string;
}

export interface Registrar {
  _id: string;
  first_name: string;
  last_name: string;
}

export interface Place {
  _id: string;
  name: string;
  description: string;
  slug?: string;
  center: PlaceCenter;
  area?: PlaceArea;
  address?: string;
  contact?: PlaceContact;
  hoursOfOperation?: string;
  status: PlaceStatus;
  createdAt: string;
  updatedAt: string;
  registrar?: Registrar;
  category?: PlaceCategory;
  tags?: PlaceTag[];
  gallery?: PlaceGalleryItem[];
  meta?: PlaceMetadata;
}

export const statusOptions = [
  { value: "draft", label: "پیش‌نویس" },
  { value: "active", label: "منتشر شده" },
  { value: "archived", label: "آرشیو شده" },
];

export const getStatusColor = (status: PlaceStatus): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "draft":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "archived":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusText = (status: PlaceStatus): string => {
  switch (status) {
    case "active":
      return "منتشر شده";
    case "draft":
      return "پیش‌نویس";
    case "archived":
      return "آرشیو شده";
    default:
      return "نامشخص";
  }
};
