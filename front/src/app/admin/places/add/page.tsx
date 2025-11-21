"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Tag {
  _id: string;
  name: string;
  slug: string;
}

interface PlaceFormData {
  name: string;
  description: string;
  shortDescription: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  tags: string[];
  phone: string;
  website: string;
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  images: File[];
  status: "active" | "pending" | "inactive";
}

export default function AddPlacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [formData, setFormData] = useState<PlaceFormData>({
    name: "",
    description: "",
    shortDescription: "",
    address: "",
    latitude: null,
    longitude: null,
    category: "",
    tags: [],
    phone: "",
    website: "",
    openingHours: {
      saturday: { open: "09:00", close: "18:00", closed: false },
      sunday: { open: "09:00", close: "18:00", closed: false },
      monday: { open: "09:00", close: "18:00", closed: false },
      tuesday: { open: "09:00", close: "18:00", closed: false },
      wednesday: { open: "09:00", close: "18:00", closed: false },
      thursday: { open: "09:00", close: "18:00", closed: false },
      friday: { open: "09:00", close: "18:00", closed: true },
    },
    images: [],
    status: "pending",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const weekDays = [
    { key: "saturday", name: "شنبه" },
    { key: "sunday", name: "یکشنبه" },
    { key: "monday", name: "دوشنبه" },
    { key: "tuesday", name: "سه‌شنبه" },
    { key: "wednesday", name: "چهارشنبه" },
    { key: "thursday", name: "پنج‌شنبه" },
    { key: "friday", name: "جمعه" },
  ];

  useEffect(() => {
    // Load categories and tags
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      // Replace with actual API call
      setCategories([
        { _id: "1", name: "رستوران", slug: "restaurant" },
        { _id: "2", name: "موزه", slug: "museum" },
        { _id: "3", name: "پارک", slug: "park" },
        { _id: "4", name: "مسجد", slug: "mosque" },
      ]);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadTags = async () => {
    try {
      // Replace with actual API call
      setTags([
        { _id: "1", name: "خانوادگی", slug: "family" },
        { _id: "2", name: "تاریخی", slug: "historical" },
        { _id: "3", name: "طبیعی", slug: "natural" },
        { _id: "4", name: "فرهنگی", slug: "cultural" },
      ]);
    } catch (error) {
      console.error("Error loading tags:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "نام مکان الزامی است";
    }

    if (!formData.description.trim()) {
      newErrors.description = "توضیحات الزامی است";
    }

    if (!formData.address.trim()) {
      newErrors.address = "آدرس الزامی است";
    }

    if (!formData.category) {
      newErrors.category = "انتخاب دسته‌بندی الزامی است";
    }

    if (formData.latitude === null || formData.longitude === null) {
      newErrors.location = "موقعیت جغرافیایی الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Replace with actual API call
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          (value as File[]).forEach((file) => {
            formDataToSend.append("images", file);
          });
        } else if (key === "tags") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === "openingHours") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("مکان با موفقیت اضافه شد!");
      router.push("/admin/places");
    } catch (error) {
      console.error("Error creating place:", error);
      alert("خطا در ایجاد مکان");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean | null | File[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleOpeningHoursChange = (
    day: string,
    field: "open" | "close" | "closed",
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                افزودن مکان جدید
              </h1>
              <p className="text-slate-600 mt-2">
                اطلاعات مکان جدید را وارد کنید
              </p>
            </div>
            <button
              onClick={() => router.push("/admin/places")}
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              بازگشت
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              اطلاعات پایه
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  نام مکان *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                  placeholder="نام مکان را وارد کنید"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  دسته‌بندی *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border ${errors.category ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                >
                  <option value="">دسته‌بندی را انتخاب کنید</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                توضیح کوتاه
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) =>
                  handleInputChange("shortDescription", e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                placeholder="توضیح کوتاه مکان"
                maxLength={150}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                توضیحات کامل *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border ${errors.description ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                placeholder="توضیحات کاملی از مکان ارائه دهید"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              اطلاعات موقعیت
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                آدرس *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border ${errors.address ? "border-red-500" : "border-slate-200"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                placeholder="آدرس کامل مکان"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  عرض جغرافیایی *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "latitude",
                      parseFloat(e.target.value) || null,
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="29.6037"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  طول جغرافیایی *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "longitude",
                      parseFloat(e.target.value) || null,
                    )
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="52.5384"
                />
              </div>
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              اطلاعات تماس
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  شماره تلفن
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="071-12345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  وب‌سایت
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">برچسب‌ها</h2>

            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => handleTagToggle(tag._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    formData.tags.includes(tag._id)
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              ساعات کاری
            </h2>

            <div className="space-y-4">
              {weekDays.map((day) => (
                <div key={day.key} className="flex items-center gap-4">
                  <div className="w-20 text-sm font-medium text-slate-700">
                    {day.name}
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={
                          formData.openingHours[day.key]?.closed || false
                        }
                        onChange={(e) =>
                          handleOpeningHoursChange(
                            day.key,
                            "closed",
                            e.target.checked,
                          )
                        }
                        className="ml-2"
                      />
                      <span className="text-sm text-slate-600">تعطیل</span>
                    </label>
                    {!formData.openingHours[day.key]?.closed && (
                      <>
                        <input
                          type="time"
                          value={formData.openingHours[day.key]?.open || ""}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              day.key,
                              "open",
                              e.target.value,
                            )
                          }
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                        <span className="text-slate-400">تا</span>
                        <input
                          type="time"
                          value={formData.openingHours[day.key]?.close || ""}
                          onChange={(e) =>
                            handleOpeningHoursChange(
                              day.key,
                              "close",
                              e.target.value,
                            )
                          }
                          className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">تصاویر</h2>

            <div className="mb-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl"
              />
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h2 className="text-xl font-bold text-slate-800 mb-6">وضعیت</h2>

            <select
              value={formData.status}
              onChange={(e) =>
                handleInputChange(
                  "status",
                  e.target.value as "active" | "pending" | "inactive",
                )
              }
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="pending">در انتظار تأیید</option>
              <option value="active">فعال</option>
              <option value="inactive">غیرفعال</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end  space-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/places")}
              className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white rounded-xl transition-colors duration-200"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "در حال ایجاد..." : "ایجاد مکان"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
