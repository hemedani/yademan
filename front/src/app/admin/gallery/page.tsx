"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface GalleryImage {
  _id: string;
  filename: string;
  originalName: string;
  url: string;
  alt: string;
  size: number;
  mimeType: string;
  uploadedBy: {
    _id: string;
    first_name: string;
    last_name: string;
  };
  uploadedAt: string;
  usageCount: number;
  tags: string[];
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockImages: GalleryImage[] = [
        {
          _id: "1",
          filename: "shiraz-persepolis.jpg",
          originalName: "تصویر تخت جمشید شیراز.jpg",
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          alt: "نمایی از تخت جمشید در شیراز",
          size: 2048576,
          mimeType: "image/jpeg",
          uploadedBy: {
            _id: "user1",
            first_name: "احمد",
            last_name: "محمدی",
          },
          uploadedAt: "2024-01-15T10:30:00Z",
          usageCount: 5,
          tags: ["تاریخی", "باستانی", "شیراز"],
        },
        {
          _id: "2",
          filename: "eram-garden.jpg",
          originalName: "باغ ارم شیراز.jpg",
          url: "https://images.unsplash.com/photo-1586710068365-eac9e2b3222c?w=400",
          alt: "باغ ارم شیراز",
          size: 1536000,
          mimeType: "image/jpeg",
          uploadedBy: {
            _id: "user2",
            first_name: "فاطمه",
            last_name: "احمدی",
          },
          uploadedAt: "2024-01-14T14:20:00Z",
          usageCount: 3,
          tags: ["طبیعی", "باغ", "شیراز"],
        },
        {
          _id: "3",
          filename: "vakil-bazaar.jpg",
          originalName: "بازار وکیل.jpg",
          url: "https://images.unsplash.com/photo-1578316299179-394e0fdbac1a?w=400",
          alt: "بازار وکیل شیراز",
          size: 1800000,
          mimeType: "image/jpeg",
          uploadedBy: {
            _id: "user1",
            first_name: "احمد",
            last_name: "محمدی",
          },
          uploadedAt: "2024-01-13T16:45:00Z",
          usageCount: 8,
          tags: ["تاریخی", "بازار", "خرید"],
        },
        {
          _id: "4",
          filename: "hafez-tomb.jpg",
          originalName: "آرامگاه حافظ.jpg",
          url: "https://images.unsplash.com/photo-1578662997865-bc3fe2e9adf4?w=400",
          alt: "آرامگاه حافظ شیراز",
          size: 2200000,
          mimeType: "image/jpeg",
          uploadedBy: {
            _id: "user3",
            first_name: "علی",
            last_name: "رضایی",
          },
          uploadedAt: "2024-01-12T12:30:00Z",
          usageCount: 12,
          tags: ["فرهنگی", "شاعر", "آرامگاه"],
        },
      ];

      setImages(mockImages);
    } catch (error) {
      console.error("Error loading images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId],
    );
  };

  const handleSelectAll = () => {
    if (selectedImages.length === filteredImages.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredImages.map((img) => img._id));
    }
  };

  const handleDelete = async (imageIds: string[]) => {
    if (!confirm(`آیا مطمئن هستید که می‌خواهید ${imageIds.length} تصویر را حذف کنید؟`)) {
      return;
    }

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setImages((prev) => prev.filter((img) => !imageIds.includes(img._id)));
      setSelectedImages([]);
      alert("تصاویر با موفقیت حذف شدند!");
    } catch (error) {
      console.error("Error deleting images:", error);
      alert("خطا در حذف تصاویر");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredImages = images.filter(
    (image) =>
      image.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "۰ بایت";
    const k = 1024;
    const sizes = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    const persianSize = size.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
    return persianSize + " " + sizes[i];
  };

  const formatPersianNumber = (num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
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
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                گالری تصاویر
              </h1>
              <p className="text-gray-400 mt-2">{formatPersianNumber(images.length)} تصویر در گالری</p>
            </div>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/30 flex items-center  space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>آپلود تصویر</span>
            </button>
          </div>

          {/* Controls */}
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-700">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="جستجو در تصاویر..."
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-colors duration-200 text-white"
                  />
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
                {/* View Mode Toggle */}
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === "grid" ? "bg-gray-600 text-pink-500" : "text-gray-300"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors duration-200 ${
                      viewMode === "list" ? "bg-gray-600 text-pink-500" : "text-gray-300"
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>

                {/* Selection Actions */}
                {selectedImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-300">
                      {formatPersianNumber(selectedImages.length)} انتخاب شده
                    </span>
                    <button
                      onClick={() => handleDelete(selectedImages)}
                      disabled={actionLoading}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
                    >
                      حذف
                    </button>
                  </div>
                )}

                <button
                  onClick={handleSelectAll}
                  className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors duration-200"
                >
                  {selectedImages.length === filteredImages.length ? "لغو انتخاب" : "انتخاب همه"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        {paginatedImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">هیچ تصویری یافت نشد</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "هنوز هیچ تصویری آپلود نکرده‌اید"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setUploadModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                اولین تصویر را آپلود کنید
              </button>
            )}
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {paginatedImages.map((image) => (
                  <div
                    key={image._id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={300}
                        height={160}
                        className="w-full h-40 object-cover rounded-lg"
                        unoptimized={true}
                      />
                      <div className="absolute top-2 right-2">
                        <input
                          type="checkbox"
                          checked={selectedImages.includes(image._id)}
                          onChange={() => handleImageSelect(image._id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200">
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
                          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors duration-200">
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
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium text-slate-800 text-sm truncate">
                        {image.originalName}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span>{formatFileSize(image.size)}</span>
                        <span>{formatPersianNumber(image.usageCount)} استفاده</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {image.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                        {image.tags.length > 2 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md">
                            +{formatPersianNumber(image.tags.length - 2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedImages.map((image) => (
                  <div
                    key={image._id}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(image._id)}
                        onChange={() => handleImageSelect(image._id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <Image
                        src={image.url}
                        alt={image.alt}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                        unoptimized={true}
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">{image.originalName}</h3>
                        <p className="text-slate-600 text-sm mb-2">{image.alt}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                          <span>{formatFileSize(image.size)}</span>
                          <span>{image.mimeType}</span>
                          <span>{formatPersianNumber(image.usageCount)} استفاده</span>
                          <span>آپلود شده در {formatPersianDate(image.uploadedAt)}</span>
                          <span>
                            توسط {image.uploadedBy.first_name} {image.uploadedBy.last_name}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {image.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors duration-200">
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
                        <button className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors duration-200">
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
                              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete([image._id])}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors duration-200"
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
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2 ">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-50"
              >
                قبلی
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === i + 1
                      ? "bg-pink-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {formatPersianNumber(i + 1)}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-white disabled:opacity-50"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">آپلود تصویر جدید</h2>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="text-6xl mb-4">📤</div>
                <h3 className="text-xl font-bold text-white mb-2">قابلیت آپلود به زودی</h3>
                <p className="text-gray-400">این قسمت در آپدیت بعدی اضافه خواهد شد</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 border border-gray-600"
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
