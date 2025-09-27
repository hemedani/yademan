"use client";

import React, { useState, useEffect } from "react";

interface Tag {
  _id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  placesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TagFormData {
  name: string;
  slug: string;
  description: string;
  color: string;
  isActive: boolean;
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const [formData, setFormData] = useState<TagFormData>({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
    isActive: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const availableColors = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#06B6D4",
    "#F97316",
    "#84CC16",
    "#EC4899",
    "#6366F1",
    "#14B8A6",
    "#F43F5E",
    "#8B5A2B",
    "#6B7280",
    "#1F2937",
  ];

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    if (formData.name && !editingTag) {
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, editingTag]);

  const loadTags = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockTags: Tag[] = [
        {
          _id: "1",
          name: "خانوادگی",
          slug: "family",
          description: "مناسب برای خانواده و کودکان",
          color: "#10B981",
          placesCount: 34,
          isActive: true,
          createdAt: "2024-01-01T10:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
        },
        {
          _id: "2",
          name: "تاریخی",
          slug: "historical",
          description: "دارای اهمیت تاریخی و فرهنگی",
          color: "#8B5CF6",
          placesCount: 28,
          isActive: true,
          createdAt: "2024-01-02T11:00:00Z",
          updatedAt: "2024-01-16T15:45:00Z",
        },
        {
          _id: "3",
          name: "طبیعی",
          slug: "natural",
          description: "دارای طبیعت و منظره زیبا",
          color: "#84CC16",
          placesCount: 22,
          isActive: true,
          createdAt: "2024-01-03T09:30:00Z",
          updatedAt: "2024-01-17T16:20:00Z",
        },
        {
          _id: "4",
          name: "فرهنگی",
          slug: "cultural",
          description: "دارای اهمیت فرهنگی و هنری",
          color: "#EC4899",
          placesCount: 19,
          isActive: true,
          createdAt: "2024-01-04T12:15:00Z",
          updatedAt: "2024-01-18T17:10:00Z",
        },
        {
          _id: "5",
          name: "رومانتیک",
          slug: "romantic",
          description: "مناسب برای زوج‌ها و عاشقان",
          color: "#F43F5E",
          placesCount: 15,
          isActive: true,
          createdAt: "2024-01-05T13:20:00Z",
          updatedAt: "2024-01-19T18:30:00Z",
        },
        {
          _id: "6",
          name: "شبانه",
          slug: "nightlife",
          description: "فعال در شب و دارای تفریحات شبانه",
          color: "#1F2937",
          placesCount: 12,
          isActive: false,
          createdAt: "2024-01-06T14:25:00Z",
          updatedAt: "2024-01-20T19:45:00Z",
        },
        {
          _id: "7",
          name: "مدرن",
          slug: "modern",
          description: "دارای امکانات مدرن و روزآمد",
          color: "#06B6D4",
          placesCount: 26,
          isActive: true,
          createdAt: "2024-01-07T15:30:00Z",
          updatedAt: "2024-01-21T20:15:00Z",
        },
        {
          _id: "8",
          name: "اقتصادی",
          slug: "budget-friendly",
          description: "مقرون به صرفه و ارزان قیمت",
          color: "#F59E0B",
          placesCount: 31,
          isActive: true,
          createdAt: "2024-01-08T16:45:00Z",
          updatedAt: "2024-01-22T21:30:00Z",
        },
      ];

      setTags(mockTags);
    } catch (error) {
      console.error("Error loading tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام برچسب الزامی است";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "نامک (slug) الزامی است";
    }

    if (!formData.description.trim()) {
      newErrors.description = "توضیحات الزامی است";
    }

    // Check for duplicate slug
    const existingTag = tags.find(
      (tag) => tag.slug === formData.slug && tag._id !== editingTag?._id,
    );
    if (existingTag) {
      newErrors.slug = "این نامک قبلاً استفاده شده است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (editingTag) {
        // Update existing tag
        const updatedTag: Tag = {
          ...editingTag,
          ...formData,
          updatedAt: new Date().toISOString(),
        };

        setTags((prev) =>
          prev.map((tag) => (tag._id === editingTag._id ? updatedTag : tag)),
        );
        alert("برچسب با موفقیت به‌روزرسانی شد!");
      } else {
        // Create new tag
        const newTag: Tag = {
          _id: Date.now().toString(),
          ...formData,
          placesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setTags((prev) => [newTag, ...prev]);
        alert("برچسب جدید با موفقیت ایجاد شد!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving tag:", error);
      alert("خطا در ذخیره برچسب");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (tagId: string) => {
    const tag = tags.find((t) => t._id === tagId);
    if (!tag) return;

    if (tag.placesCount > 0) {
      alert("این برچسب دارای مکان است و قابل حذف نیست");
      return;
    }

    if (
      !confirm(`آیا مطمئن هستید که می‌خواهید برچسب "${tag.name}" را حذف کنید؟`)
    ) {
      return;
    }

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTags((prev) => prev.filter((t) => t._id !== tagId));
      alert("برچسب با موفقیت حذف شد!");
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("خطا در حذف برچسب");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (tagId: string) => {
    const tag = tags.find((t) => t._id === tagId);
    if (!tag) return;

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setTags((prev) =>
        prev.map((t) =>
          t._id === tagId
            ? {
                ...t,
                isActive: !t.isActive,
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );
    } catch (error) {
      console.error("Error toggling tag status:", error);
      alert("خطا در تغییر وضعیت برچسب");
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
      isActive: true,
    });
    setErrors({});
    setEditingTag(null);
    setShowModal(false);
  };

  const openEditModal = (tag: Tag) => {
    setFormData({
      name: tag.name,
      slug: tag.slug,
      description: tag.description,
      color: tag.color,
      isActive: tag.isActive,
    });
    setEditingTag(tag);
    setShowModal(true);
  };

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTags = filteredTags.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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
                مدیریت برچسب‌ها
              </h1>
              <p className="text-slate-600 mt-2">
                {formatPersianNumber(tags.length)} برچسب موجود
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
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
              <span>برچسب جدید</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در برچسب‌ها..."
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
        </div>

        {/* Tags List */}
        {paginatedTags.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              هیچ برچسبی یافت نشد
            </h3>
            <p className="text-slate-500 mb-4">
              {searchTerm
                ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                : "هنوز هیچ برچسبی اضافه نکرده‌اید"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                اولین برچسب را اضافه کنید
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedTags.map((tag) => (
              <div
                key={tag._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  {/* Tag Info */}
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {tag.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-1">
                        {tag.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{formatPersianNumber(tag.placesCount)} مکان</span>
                        <span>نامک: {tag.slug}</span>
                        <span
                          className={`px-2 py-1 rounded-full ${
                            tag.isActive
                              ? "bg-green-100 text-green-600"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {tag.isActive ? "فعال" : "غیرفعال"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-reverse space-x-2">
                    <button
                      onClick={() => handleToggleStatus(tag._id)}
                      disabled={actionLoading}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        tag.isActive
                          ? "bg-green-100 text-green-600 hover:bg-green-200"
                          : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                      }`}
                      title={tag.isActive ? "غیرفعال کردن" : "فعال کردن"}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => openEditModal(tag)}
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors duration-200"
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
                    <button
                      onClick={() => handleDelete(tag._id)}
                      disabled={tag.placesCount > 0 || actionLoading}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingTag ? "ویرایش برچسب" : "برچسب جدید"}
                </h2>
                <button
                  onClick={resetForm}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    نام برچسب *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                    placeholder="نام برچسب را وارد کنید"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    نامک (URL Slug) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }));
                      if (errors.slug)
                        setErrors((prev) => ({ ...prev, slug: "" }));
                    }}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.slug ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                    placeholder="family-friendly"
                  />
                  {errors.slug && (
                    <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    توضیحات *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                      if (errors.description)
                        setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.description ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                    placeholder="توضیحات برچسب..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    رنگ
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, color }))
                        }
                        className={`w-8 h-8 rounded-lg border-2 transition-transform duration-200 ${
                          formData.color === color
                            ? "border-slate-400 scale-110"
                            : "border-slate-200"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isActive: e.target.checked,
                        }))
                      }
                      className="ml-2"
                    />
                    <span className="text-sm font-medium text-slate-700">
                      فعال
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
                  >
                    انصراف
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors duration-200 disabled:opacity-50"
                  >
                    {actionLoading
                      ? "در حال ذخیره..."
                      : editingTag
                        ? "به‌روزرسانی"
                        : "ایجاد برچسب"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
