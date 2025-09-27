"use client";

import React, { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  placesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    slug: "",
    description: "",
    icon: "📍",
    color: "#3B82F6",
    isActive: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const availableIcons = [
    "🍽️",
    "🏛️",
    "🌳",
    "🕌",
    "🏪",
    "🏥",
    "🎭",
    "🏋️",
    "☕",
    "🛍️",
    "🏨",
    "⛽",
    "💊",
    "📚",
    "🎪",
    "🏊",
    "📍",
    "🎯",
    "🎨",
    "🎵",
    "💼",
    "🚗",
    "✈️",
    "🎢",
  ];

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
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (formData.name && !editingCategory) {
      const slug = formData.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\u0600-\u06FF-]/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.name, editingCategory]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockCategories: Category[] = [
        {
          _id: "1",
          name: "رستوران و کافه",
          slug: "restaurant-cafe",
          description: "رستوران‌ها، کافه‌ها و اماکن غذاخوری",
          icon: "🍽️",
          color: "#EF4444",
          placesCount: 45,
          isActive: true,
          createdAt: "2024-01-01T10:00:00Z",
          updatedAt: "2024-01-15T14:30:00Z",
        },
        {
          _id: "2",
          name: "موزه و گالری",
          slug: "museum-gallery",
          description: "موزه‌ها، گالری‌ها و اماکن فرهنگی",
          icon: "🏛️",
          color: "#8B5CF6",
          placesCount: 23,
          isActive: true,
          createdAt: "2024-01-02T11:00:00Z",
          updatedAt: "2024-01-16T15:45:00Z",
        },
        {
          _id: "3",
          name: "پارک و فضای سبز",
          slug: "park-green-space",
          description: "پارک‌ها، باغ‌ها و فضاهای سبز شهری",
          icon: "🌳",
          color: "#10B981",
          placesCount: 32,
          isActive: true,
          createdAt: "2024-01-03T09:30:00Z",
          updatedAt: "2024-01-17T16:20:00Z",
        },
        {
          _id: "4",
          name: "مسجد و امامزاده",
          slug: "mosque-shrine",
          description: "مساجد، امامزاده‌ها و اماکن مذهبی",
          icon: "🕌",
          color: "#06B6D4",
          placesCount: 18,
          isActive: true,
          createdAt: "2024-01-04T12:15:00Z",
          updatedAt: "2024-01-18T17:10:00Z",
        },
        {
          _id: "5",
          name: "مرکز خرید",
          slug: "shopping-center",
          description: "مراکز خرید، بازار و فروشگاه‌ها",
          icon: "🛍️",
          color: "#F59E0B",
          placesCount: 27,
          isActive: false,
          createdAt: "2024-01-05T13:20:00Z",
          updatedAt: "2024-01-19T18:30:00Z",
        },
      ];

      setCategories(mockCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام دسته‌بندی الزامی است";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "نامک (slug) الزامی است";
    }

    if (!formData.description.trim()) {
      newErrors.description = "توضیحات الزامی است";
    }

    if (!formData.icon) {
      newErrors.icon = "انتخاب آیکن الزامی است";
    }

    // Check for duplicate slug
    const existingCategory = categories.find(
      (cat) => cat.slug === formData.slug && cat._id !== editingCategory?._id,
    );
    if (existingCategory) {
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

      if (editingCategory) {
        // Update existing category
        const updatedCategory: Category = {
          ...editingCategory,
          ...formData,
          updatedAt: new Date().toISOString(),
        };

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id ? updatedCategory : cat,
          ),
        );
        alert("دسته‌بندی با موفقیت به‌روزرسانی شد!");
      } else {
        // Create new category
        const newCategory: Category = {
          _id: Date.now().toString(),
          ...formData,
          placesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setCategories((prev) => [newCategory, ...prev]);
        alert("دسته‌بندی جدید با موفقیت ایجاد شد!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      alert("خطا در ذخیره دسته‌بندی");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (!category) return;

    if (category.placesCount > 0) {
      alert("این دسته‌بندی دارای مکان است و قابل حذف نیست");
      return;
    }

    if (
      !confirm(
        `آیا مطمئن هستید که می‌خواهید دسته‌بندی "${category.name}" را حذف کنید؟`,
      )
    ) {
      return;
    }

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
      alert("دسته‌بندی با موفقیت حذف شد!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("خطا در حذف دسته‌بندی");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (!category) return;

    setActionLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === categoryId
            ? {
                ...cat,
                isActive: !cat.isActive,
                updatedAt: new Date().toISOString(),
              }
            : cat,
        ),
      );
    } catch (error) {
      console.error("Error toggling category status:", error);
      alert("خطا در تغییر وضعیت دسته‌بندی");
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "📍",
      color: "#3B82F6",
      isActive: true,
    });
    setErrors({});
    setEditingCategory(null);
    setShowModal(false);
  };

  const openEditModal = (category: Category) => {
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
    });
    setEditingCategory(category);
    setShowModal(true);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(
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
                مدیریت دسته‌بندی‌ها
              </h1>
              <p className="text-slate-600 mt-2">
                {formatPersianNumber(categories.length)} دسته‌بندی موجود
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
              <span>دسته‌بندی جدید</span>
            </button>
          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجو در دسته‌بندی‌ها..."
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

        {/* Categories Grid */}
        {paginatedCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">
              هیچ دسته‌بندی یافت نشد
            </h3>
            <p className="text-slate-500 mb-4">
              {searchTerm
                ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                : "هنوز هیچ دسته‌بندی اضافه نکرده‌اید"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                اولین دسته‌بندی را اضافه کنید
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedCategories.map((category) => (
              <div
                key={category._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{
                      backgroundColor: `${category.color}20`,
                      color: category.color,
                    }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex items-center space-x-reverse space-x-2">
                    <button
                      onClick={() => handleToggleStatus(category._id)}
                      disabled={actionLoading}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        category.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
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
                    <div className="relative group">
                      <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors duration-200">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                      <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <button
                          onClick={() => openEditModal(category)}
                          className="w-full px-4 py-2 text-right text-sm text-slate-700 hover:bg-slate-50 rounded-t-lg"
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          disabled={category.placesCount > 0 || actionLoading}
                          className="w-full px-4 py-2 text-right text-sm text-red-600 hover:bg-red-50 rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      {formatPersianNumber(category.placesCount)} مکان
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        category.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {category.isActive ? "فعال" : "غیرفعال"}
                    </span>
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
                  {editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
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
                    نام دسته‌بندی *
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
                    placeholder="نام دسته‌بندی را وارد کنید"
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
                    placeholder="restaurant-cafe"
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
                    placeholder="توضیحات دسته‌بندی..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    آیکن *
                  </label>
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, icon }))
                        }
                        className={`p-3 text-xl rounded-lg border transition-colors duration-200 ${
                          formData.icon === icon
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  {errors.icon && (
                    <p className="text-red-500 text-sm mt-1">{errors.icon}</p>
                  )}
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    رنگ
                  </label>
                  <div className="flex gap-2 mb-2">
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
                      : editingCategory
                        ? "به‌روزرسانی"
                        : "ایجاد دسته‌بندی"}
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
