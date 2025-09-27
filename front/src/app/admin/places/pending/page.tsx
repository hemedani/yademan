"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PendingPlace {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    _id: string;
    name: string;
    slug: string;
  }>;
  phone?: string;
  website?: string;
  images: string[];
  submittedBy: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  submittedAt: string;
  status: "pending";
  reasonForPending?: string;
}

export default function PendingPlacesPage() {
  const router = useRouter();
  const [pendingPlaces, setPendingPlaces] = useState<PendingPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPlace, setSelectedPlace] = useState<PendingPlace | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingPlaces();
  }, []);

  const loadPendingPlaces = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // Simulate loading data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: PendingPlace[] = [
        {
          _id: "1",
          name: "رستوران سنتی شیرازی",
          description: "رستورانی با غذاهای محلی و سنتی شیراز در قلب شهر",
          shortDescription: "رستوران سنتی با غذاهای محلی شیراز",
          address: "خیابان زند، کوچه 15، پلاک 23",
          latitude: 29.6037,
          longitude: 52.5384,
          category: {
            _id: "1",
            name: "رستوران",
            slug: "restaurant",
          },
          tags: [
            { _id: "1", name: "خانوادگی", slug: "family" },
            { _id: "2", name: "سنتی", slug: "traditional" },
          ],
          phone: "071-12345678",
          website: "https://restaurant-example.com",
          images: ["/placeholder-image.jpg", "/placeholder-image-2.jpg"],
          submittedBy: {
            _id: "user1",
            first_name: "احمد",
            last_name: "محمدی",
            email: "ahmad@example.com",
          },
          submittedAt: "2024-01-15T10:30:00Z",
          status: "pending",
          reasonForPending: "نیاز به بررسی اطلاعات تماس",
        },
        {
          _id: "2",
          name: "پارک ملت شیراز",
          description: "پارک بزرگ و زیبا با امکانات ورزشی و تفریحی",
          shortDescription: "پارک شهری با امکانات تفریحی",
          address: "خیابان ملت، روبروی مجتمع تجاری",
          latitude: 29.5918,
          longitude: 52.5836,
          category: {
            _id: "3",
            name: "پارک",
            slug: "park",
          },
          tags: [
            { _id: "1", name: "خانوادگی", slug: "family" },
            { _id: "3", name: "طبیعی", slug: "natural" },
          ],
          images: ["/placeholder-park.jpg"],
          submittedBy: {
            _id: "user2",
            first_name: "فاطمه",
            last_name: "احمدی",
            email: "fateme@example.com",
          },
          submittedAt: "2024-01-14T14:20:00Z",
          status: "pending",
        },
      ];

      setPendingPlaces(mockData);
    } catch (error) {
      console.error("Error loading pending places:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = pendingPlaces.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || place.category._id === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlaces = filteredPlaces.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleApprove = async (placeId: string) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این مکان را تأیید کنید؟"))
      return;

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPendingPlaces((prev) => prev.filter((place) => place._id !== placeId));
      alert("مکان با موفقیت تأیید شد!");
    } catch (error) {
      console.error("Error approving place:", error);
      alert("خطا در تأیید مکان");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (placeId: string) => {
    const reason = prompt("دلیل رد کردن مکان را وارد کنید:");
    if (!reason) return;

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setPendingPlaces((prev) => prev.filter((place) => place._id !== placeId));
      alert("مکان رد شد!");
    } catch (error) {
      console.error("Error rejecting place:", error);
      alert("خطا در رد کردن مکان");
    } finally {
      setActionLoading(false);
    }
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

  const formatPersianNumber = (num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
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
                مکان‌های در انتظار تأیید
              </h1>
              <p className="text-slate-600 mt-2">
                {formatPersianNumber(pendingPlaces.length)} مکان در انتظار بررسی
                و تأیید شما
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/places")}
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              بازگشت به همه مکان‌ها
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  جستجو
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو در نام یا آدرس..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  فیلتر بر اساس دسته‌بندی
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">همه دسته‌بندی‌ها</option>
                  <option value="1">رستوران</option>
                  <option value="2">موزه</option>
                  <option value="3">پارک</option>
                  <option value="4">مسجد</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Places Grid */}
        {paginatedPlaces.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              هیچ مکان در انتظاری وجود ندارد
            </h3>
            <p className="text-slate-500">همه مکان‌ها بررسی و تأیید شده‌اند</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedPlaces.map((place) => (
              <div
                key={place._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  <div className="lg:w-64">
                    <div className="aspect-video bg-slate-200 rounded-xl overflow-hidden">
                      {place.images && place.images.length > 0 ? (
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <svg
                            className="w-12 h-12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                          {place.name}
                        </h3>
                        <p className="text-slate-600 mb-2">
                          {place.shortDescription}
                        </p>
                        <div className="flex items-center text-sm text-slate-500 mb-2">
                          <svg
                            className="w-4 h-4 ml-2"
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
                          {place.address}
                        </div>
                        <div className="flex items-center text-sm text-slate-500 mb-4">
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          {place.category.name}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        در انتظار تأیید
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {place.tags.map((tag) => (
                          <span
                            key={tag._id}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Submitter Info */}
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                      <h4 className="text-sm font-medium text-slate-700 mb-1">
                        ارسال شده توسط:
                      </h4>
                      <div className="text-sm text-slate-600">
                        <p>
                          {place.submittedBy.first_name}{" "}
                          {place.submittedBy.last_name}
                        </p>
                        <p>{place.submittedBy.email}</p>
                        <p>
                          تاریخ ارسال: {formatPersianDate(place.submittedAt)}
                        </p>
                      </div>
                      {place.reasonForPending && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-amber-700">
                            دلیل در انتظار:
                          </p>
                          <p className="text-sm text-amber-600">
                            {place.reasonForPending}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedPlace(place);
                          setShowModal(true);
                        }}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        مشاهده جزئیات
                      </button>
                      <button
                        onClick={() => router.push(`/fa/location/${place._id}`)}
                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                      >
                        پیش‌نمایش
                      </button>
                      <button
                        onClick={() => handleApprove(place._id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                      >
                        تأیید
                      </button>
                      <button
                        onClick={() => handleReject(place._id)}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50"
                      >
                        رد
                      </button>
                    </div>
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

      {/* Detail Modal */}
      {showModal && selectedPlace && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  جزئیات مکان
                </h2>
                <button
                  onClick={() => setShowModal(false)}
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

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-700 mb-2">نام مکان</h3>
                  <p className="text-slate-600">{selectedPlace.name}</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-700 mb-2">
                    توضیحات کامل
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {selectedPlace.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-slate-700 mb-2">آدرس</h3>
                    <p className="text-slate-600">{selectedPlace.address}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-700 mb-2">دسته‌بندی</h3>
                    <p className="text-slate-600">
                      {selectedPlace.category.name}
                    </p>
                  </div>

                  {selectedPlace.phone && (
                    <div>
                      <h3 className="font-bold text-slate-700 mb-2">تلفن</h3>
                      <p className="text-slate-600">{selectedPlace.phone}</p>
                    </div>
                  )}

                  {selectedPlace.website && (
                    <div>
                      <h3 className="font-bold text-slate-700 mb-2">وب‌سایت</h3>
                      <a
                        href={selectedPlace.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedPlace.website}
                      </a>
                    </div>
                  )}
                </div>

                {selectedPlace.images && selectedPlace.images.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-700 mb-2">تصاویر</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedPlace.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedPlace.name} - تصویر ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-500 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
                >
                  بستن
                </button>
                <button
                  onClick={() => {
                    handleApprove(selectedPlace._id);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-200"
                >
                  تأیید مکان
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedPlace._id);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                >
                  رد مکان
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
