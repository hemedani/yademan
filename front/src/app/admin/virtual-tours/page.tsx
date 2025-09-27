"use client";

import React, { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

interface VirtualTour {
  _id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  tourUrl: string;
  place: {
    _id: string;
    name: string;
  };
  viewCount: number;
  duration: number; // in minutes
  isActive: boolean;
  createdBy: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function VirtualToursPage() {
  const {} = useAuth();
  const [tours, setTours] = useState<VirtualTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTours: VirtualTour[] = [
        {
          _id: "1",
          title: "تور مجازی تخت جمشید",
          description: "گشتی مجازی در شکوه باستانی تخت جمشید",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          tourUrl: "https://example.com/virtual-tour/persepolis",
          place: {
            _id: "place1",
            name: "تخت جمشید",
          },
          viewCount: 1250,
          duration: 15,
          isActive: true,
          createdBy: {
            _id: "user1",
            first_name: "احمد",
            last_name: "محمدی",
          },
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-20T14:30:00Z",
        },
        {
          _id: "2",
          title: "تور مجازی باغ ارم",
          description: "سیری در زیبایی‌های باغ ارم شیراز",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1586710068365-eac9e2b3222c?w=400",
          tourUrl: "https://example.com/virtual-tour/eram-garden",
          place: {
            _id: "place2",
            name: "باغ ارم",
          },
          viewCount: 890,
          duration: 12,
          isActive: true,
          createdBy: {
            _id: "user2",
            first_name: "فاطمه",
            last_name: "احمدی",
          },
          createdAt: "2024-01-12T11:20:00Z",
          updatedAt: "2024-01-18T16:45:00Z",
        },
        {
          _id: "3",
          title: "تور مجازی آرامگاه حافظ",
          description: "بازدید مجازی از آرامگاه حافظ شیرازی",
          thumbnailUrl:
            "https://images.unsplash.com/photo-1578662997865-bc3fe2e9adf4?w=400",
          tourUrl: "https://example.com/virtual-tour/hafez-tomb",
          place: {
            _id: "place3",
            name: "آرامگاه حافظ",
          },
          viewCount: 2100,
          duration: 8,
          isActive: false,
          createdBy: {
            _id: "user3",
            first_name: "علی",
            last_name: "رضایی",
          },
          createdAt: "2024-01-08T09:15:00Z",
          updatedAt: "2024-01-15T12:30:00Z",
        },
      ];

      setTours(mockTours);
    } catch (error) {
      console.error("Error loading virtual tours:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTourSelect = (tourId: string) => {
    setSelectedTours((prev) =>
      prev.includes(tourId)
        ? prev.filter((id) => id !== tourId)
        : [...prev, tourId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTours.length === filteredTours.length) {
      setSelectedTours([]);
    } else {
      setSelectedTours(filteredTours.map((tour) => tour._id));
    }
  };

  const handleToggleStatus = async (tourId: string) => {
    const tour = tours.find((t) => t._id === tourId);
    if (!tour) return;

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTours((prev) =>
        prev.map((t) =>
          t._id === tourId
            ? {
                ...t,
                isActive: !t.isActive,
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );
    } catch (error) {
      console.error("Error toggling tour status:", error);
      alert("خطا در تغییر وضعیت تور");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (tourIds: string[]) => {
    if (
      !confirm(
        `آیا مطمئن هستید که می‌خواهید ${tourIds.length} تور مجازی را حذف کنید؟`,
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setTours((prev) => prev.filter((tour) => !tourIds.includes(tour._id)));
      setSelectedTours([]);
      alert("تورهای مجازی با موفقیت حذف شدند!");
    } catch (error) {
      console.error("Error deleting tours:", error);
      alert("خطا در حذف تورهای مجازی");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTours = tours.filter(
    (tour) =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.place.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTours = filteredTours.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const formatPersianNumber = (num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const formatPersianDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Tehran",
    }).format(date);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                تورهای مجازی
              </h1>
              <p className="text-slate-600 mt-2">
                {formatPersianNumber(tours.length)} تور مجازی موجود
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
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
              <span>تور مجازی جدید</span>
            </button>
          </div>

          {/* Controls */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="جستجو در تورهای مجازی..."
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  />
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
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

              <div className="flex items-center gap-3">
                {/* Selection Actions */}
                {selectedTours.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">
                      {formatPersianNumber(selectedTours.length)} انتخاب شده
                    </span>
                    <button
                      onClick={() => handleDelete(selectedTours)}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSelectAll}
                  className="px-3 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  {selectedTours.length === filteredTours.length
                    ? "لغو انتخاب"
                    : "انتخاب همه"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {paginatedTours.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎥</div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              هیچ تور مجازی یافت نشد
            </h3>
            <p className="text-slate-500 mb-4">
              {searchTerm
                ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                : "هنوز هیچ تور مجازی ایجاد نکرده‌اید"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                اولین تور مجازی را ایجاد کنید
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedTours.map((tour) => (
              <div
                key={tour._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative mb-4">
                  <img
                    src={tour.thumbnailUrl}
                    alt={tour.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={selectedTours.includes(tour._id)}
                      onChange={() => handleTourSelect(tour._id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs">
                    {formatPersianNumber(tour.duration)} دقیقه
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                    <button className="bg-white/20 backdrop-blur-sm p-4 rounded-full hover:bg-white/30 transition-colors duration-200">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">
                      {tour.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tour.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {tour.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>مکان: {tour.place.name}</span>
                    <span>{formatPersianNumber(tour.viewCount)} بازدید</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span>
                      ایجاد شده در {formatPersianDate(tour.createdAt)}
                    </span>
                    <span>
                      توسط {tour.createdBy.first_name}{" "}
                      {tour.createdBy.last_name}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-3">
                    <button
                      onClick={() => window.open(tour.tourUrl, "_blank")}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                    >
                      مشاهده تور
                    </button>
                    <button
                      onClick={() => handleToggleStatus(tour._id)}
                      disabled={actionLoading}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        tour.isActive
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      title={tour.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    >
                      {tour.isActive ? "غیرفعال" : "فعال"}
                    </button>
                    <button
                      onClick={() => handleDelete([tour._id])}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-sm transition-colors duration-200"
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                قبلی
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {formatPersianNumber(i + 1)}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 disabled:opacity-50"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  تور مجازی جدید
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">
                  قابلیت ایجاد تور مجازی به زودی
                </h3>
                <p className="text-slate-500">
                  این قسمت در آپدیت بعدی اضافه خواهد شد
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
