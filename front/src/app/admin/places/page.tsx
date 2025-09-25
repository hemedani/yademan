"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";

interface Place {
  _id: string;
  name: string;
  description: string;
  slug?: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
  area?: {
    type: "MultiPolygon";
    coordinates: any[];
  };
  address?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    social?: string[];
  };
  hoursOfOperation?: string;
  status: "draft" | "active" | "archived";
  createdAt: string;
  updatedAt: string;
  registrar?: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  category?: {
    _id: string;
    name: string;
    color?: string;
  };
  tags?: Array<{
    _id: string;
    name: string;
    color?: string;
  }>;
  gallery?: Array<{
    _id: string;
    name: string;
    alt_text?: string;
  }>;
  meta?: {
    views?: number;
    favorites?: number;
    rating?: number;
  };
}

interface Category {
  _id: string;
  name: string;
  description: string;
  color?: string;
  icon?: string;
}

interface PlaceFilters {
  search: string;
  category: string;
  status: string;
  registrar: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

const PlacesManagement: React.FC = () => {
  const router = useRouter();
  const { user, userLevel } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  // Filters
  const [filters, setFilters] = useState<PlaceFilters>({
    search: "",
    category: "",
    status: "",
    registrar: "",
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const formatPersianNumber = useCallback((num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  }, []);

  const formatPersianDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Tehran",
    }).format(date);
  }, []);

  const getStatusColor = useCallback((status: string) => {
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
  }, []);

  const getStatusText = useCallback((status: string) => {
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
  }, []);

  // Fetch places data
  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const api = AppApi();

      // Build query parameters based on filters
      const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: filters.search,
        category: filters.category,
        status: filters.status,
        registrar: filters.registrar,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      };

      const response = await api.send({
        model: "place",
        act: "getPaginatedPlaces",
        details: {
          set: queryParams,
          get: {
            name: true,
            description: true,
            slug: true,
            center: true,
            address: true,
            contact: true,
            hoursOfOperation: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            registrar: {
              first_name: true,
              last_name: true,
            },
            category: {
              name: true,
              color: true,
            },
            tags: {
              name: true,
              color: true,
            },
            gallery: {
              name: true,
              alt_text: true,
            },
            meta: true,
          },
        },
      });

      if (response.success) {
        setPlaces(response.body.places || []);
        setTotalPages(Math.ceil((response.body.total || 0) / itemsPerPage));
      } else {
        setError(response.body?.message || "خطا در دریافت اطلاعات مکان‌ها");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters, itemsPerPage]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const api = AppApi();
      const response = await api.send({
        model: "category",
        act: "getCategories",
        details: {
          set: {},
          get: {
            name: true,
            description: true,
            color: true,
            icon: true,
          },
        },
      });

      if (response.success) {
        setCategories(response.body || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Delete place
  const handleDeletePlace = async (placeId: string) => {
    if (!placeId) return;

    try {
      setActionLoading(placeId);
      const api = AppApi();

      const response = await api.send({
        model: "place",
        act: "deletePlace",
        details: {
          set: { _id: placeId },
          get: {},
        },
      });

      if (response.success) {
        setPlaces(places.filter((p) => p._id !== placeId));
        setShowDeleteModal(false);
        setSelectedPlace(null);
      } else {
        setError(response.body?.message || "خطا در حذف مکان");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setActionLoading(null);
    }
  };

  // Update place status
  const handleStatusChange = async (placeId: string, newStatus: string) => {
    try {
      setActionLoading(placeId);
      const api = AppApi();

      const response = await api.send({
        model: "place",
        act: "updatePlaceStatus",
        details: {
          set: { _id: placeId, status: newStatus },
          get: {},
        },
      });

      if (response.success) {
        setPlaces(
          places.map((p) =>
            p._id === placeId ? { ...p, status: newStatus as any } : p,
          ),
        );
      } else {
        setError(response.body?.message || "خطا در به‌روزرسانی وضعیت");
      }
    } catch (err) {
      setError("خطا در اتصال به سرور");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFilterChange = useCallback(
    (key: keyof PlaceFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setCurrentPage(1); // Reset to first page when filtering
    },
    [],
  );

  const filteredPlaces = useMemo(() => {
    return places; // Filtering is done on server-side
  }, [places]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading && places.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">
              در حال بارگذاری مکان‌ها
            </h2>
            <p className="text-slate-600">لطفاً منتظر بمانید...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              مدیریت مکان‌ها
            </h1>
            <p className="text-slate-600 text-lg">
              مدیریت مکان‌های فرهنگی و تاریخی شهر ایران
            </p>
            <div className="flex items-center space-x-reverse space-x-4 text-sm text-slate-500">
              <span>مجموع {formatPersianNumber(places.length)} مکان</span>
              <span>•</span>
              <span>
                صفحه {formatPersianNumber(currentPage)} از{" "}
                {formatPersianNumber(totalPages)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-reverse space-x-4">
            <button
              onClick={() => router.push("/admin/places/add")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center space-x-reverse space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>افزودن مکان جدید</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
            جستجو و فیلتر
          </h2>
          <div className="flex items-center space-x-reverse space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showFilters
                  ? "bg-blue-100 text-blue-600"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
            </button>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="جستجو در نام، توضیحات، یا آدرس مکان..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                دسته‌بندی
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه دسته‌ها</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                وضعیت
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه وضعیت‌ها</option>
                <option value="active">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
                <option value="archived">آرشیو شده</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                مرتب‌سازی بر اساس
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="updatedAt">تاریخ بروزرسانی</option>
                <option value="createdAt">تاریخ ایجاد</option>
                <option value="name">نام</option>
                <option value="views">تعداد بازدید</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ترتیب
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange(
                    "sortOrder",
                    e.target.value as "asc" | "desc",
                  )
                }
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">نزولی</option>
                <option value="asc">صعودی</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-reverse space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="w-5 h-5 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="flex-shrink-0 mr-auto"
          >
            <svg
              className="w-4 h-4 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Places Grid/List */}
      {places.length === 0 && !loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-slate-400"
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
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            هیچ مکانی یافت نشد
          </h3>
          <p className="text-slate-600 mb-6">
            هنوز هیچ مکانی ثبت نشده است. اولین مکان را اضافه کنید.
          </p>
          <button
            onClick={() => router.push("/admin/places/add")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            افزودن مکان جدید
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlaces.map((place, index) => (
                <div
                  key={place._id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Place Image */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-100 to-purple-100">
                    {place.gallery && place.gallery.length > 0 ? (
                      <img
                        src={`/api/files/${place.gallery[0].name}`}
                        alt={place.gallery[0].alt_text || place.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/api/placeholder/place";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-slate-300"
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
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          place.status,
                        )}`}
                      >
                        {getStatusText(place.status)}
                      </span>
                    </div>

                    {/* Stats Overlay */}
                    {place.meta && (
                      <div className="absolute bottom-3 left-3 flex items-center space-x-reverse space-x-2">
                        {place.meta.views && (
                          <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center space-x-reverse space-x-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{formatPersianNumber(place.meta.views)}</span>
                          </div>
                        )}
                        {place.meta.favorites && (
                          <div className="bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center space-x-reverse space-x-1">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>
                              {formatPersianNumber(place.meta.favorites)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {place.name}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {place.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-500">
                      {place.address && (
                        <div className="flex items-center space-x-reverse space-x-2">
                          <svg
                            className="w-4 h-4 flex-shrink-0"
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
                          </svg>
                          <span className="truncate">{place.address}</span>
                        </div>
                      )}

                      {place.category && (
                        <div className="flex items-center space-x-reverse space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                place.category.color || "#6B7280",
                            }}
                          ></div>
                          <span>{place.category.name}</span>
                        </div>
                      )}

                      {place.registrar && (
                        <div className="flex items-center space-x-reverse space-x-2">
                          <svg
                            className="w-4 h-4 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>
                            {place.registrar.first_name}{" "}
                            {place.registrar.last_name}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-slate-400">
                          {formatPersianDate(place.updatedAt)}
                        </span>

                        {place.tags && place.tags.length > 0 && (
                          <div className="flex items-center space-x-reverse space-x-1">
                            {place.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag._id}
                                className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md"
                                style={{
                                  backgroundColor: tag.color
                                    ? `${tag.color}20`
                                    : undefined,
                                  color: tag.color || undefined,
                                }}
                              >
                                {tag.name}
                              </span>
                            ))}
                            {place.tags.length > 3 && (
                              <span className="text-xs text-slate-400">
                                +{formatPersianNumber(place.tags.length - 3)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center space-x-reverse space-x-2">
                        {/* View Button */}
                        <button
                          onClick={() =>
                            router.push(
                              `/fa/location/${place.slug || place._id}`,
                            )
                          }
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="مشاهده در سایت"
                        >
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() =>
                            router.push(`/admin/places/edit/${place._id}`)
                          }
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                          title="ویرایش"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        {userLevel === "Manager" && (
                          <button
                            onClick={() => {
                              setSelectedPlace(place);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="حذف"
                          >
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Status Actions */}
                      <div className="flex items-center space-x-reverse space-x-1">
                        <select
                          value={place.status}
                          onChange={(e) =>
                            handleStatusChange(place._id, e.target.value)
                          }
                          disabled={actionLoading === place._id}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                        >
                          <option value="draft">پیش‌نویس</option>
                          <option value="active">منتشر شده</option>
                          <option value="archived">آرشیو شده</option>
                        </select>

                        {actionLoading === place._id && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredPlaces.map((place, index) => (
                <div
                  key={place._id}
                  className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-reverse space-x-6">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden flex-shrink-0">
                      {place.gallery && place.gallery.length > 0 ? (
                        <img
                          src={`/api/files/${place.gallery[0].name}`}
                          alt={place.gallery[0].alt_text || place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-8 h-8 text-slate-300"
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
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 mb-1">
                            {place.name}
                          </h3>
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {place.description}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            place.status,
                          )}`}
                        >
                          {getStatusText(place.status)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-reverse space-x-4 text-sm text-slate-500">
                          {place.category && (
                            <div className="flex items-center space-x-reverse space-x-1">
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                  backgroundColor:
                                    place.category.color || "#6B7280",
                                }}
                              ></div>
                              <span>{place.category.name}</span>
                            </div>
                          )}
                          <span>{formatPersianDate(place.updatedAt)}</span>
                          {place.meta?.views && (
                            <div className="flex items-center space-x-reverse space-x-1">
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path
                                  fillRule="evenodd"
                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>
                                {formatPersianNumber(place.meta.views)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-reverse space-x-2">
                          <button
                            onClick={() =>
                              router.push(
                                `/fa/location/${place.slug || place._id}`,
                              )
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            title="مشاهده در سایت"
                          >
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() =>
                              router.push(`/admin/places/edit/${place._id}`)
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                            title="ویرایش"
                          >
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>

                          {userLevel === "Manager" && (
                            <button
                              onClick={() => {
                                setSelectedPlace(place);
                                setShowDeleteModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="حذف"
                            >
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
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600">
              صفحه {formatPersianNumber(currentPage)} از{" "}
              {formatPersianNumber(totalPages)}
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200"
              >
                قبلی
              </button>

              <div className="flex items-center space-x-reverse space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {formatPersianNumber(pageNumber)}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 rounded-lg hover:bg-slate-50 transition-all duration-200"
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPlace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  حذف مکان
                </h3>
                <p className="text-slate-600 mb-1">
                  آیا از حذف این مکان اطمینان دارید؟
                </p>
                <p className="text-lg font-medium text-slate-800 mb-4">
                  {selectedPlace.name}
                </p>
                <p className="text-sm text-red-600 mb-6">
                  این عمل غیرقابل بازگشت است و تمام اطلاعات مربوطه حذف خواهد شد.
                </p>

                <div className="flex items-center space-x-reverse space-x-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setSelectedPlace(null);
                    }}
                    className="flex-1 px-4 py-3 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => handleDeletePlace(selectedPlace._id)}
                    disabled={actionLoading === selectedPlace._id}
                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {actionLoading === selectedPlace._id
                      ? "در حال حذف..."
                      : "حذف"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PlacesManagement;
