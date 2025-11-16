"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppApi } from "@/services/api";
import Cookies from "js-cookie";
import Link from "next/link";
import { eventSchema } from "@/types/declarations/selectInp";

type Event = eventSchema;

const EditEventPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  const [formData, setFormData] = useState<
    Omit<
      eventSchema,
      | "registrar"
      | "places"
      | "organizer"
      | "attendees"
      | "tags"
      | "thumbnail"
      | "gallery"
    >
  >({
    _id: "",
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    color: "#8884d8",
    icon: "",
    capacity: "",
    status: "draft",
    isPublic: false,
    ticketPrice: "",
    registrationRequired: false,
    maxAttendees: "",
    eventUrl: "",
    registrationUrl: "",
    meta: {
      key: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!params.id) return;

      try {
        // Get token from cookies
        const token =
          typeof window !== "undefined"
            ? Cookies.get("token") || undefined
            : undefined;
        const api = AppApi(undefined, token);

        const response = await api.send({
          service: "main",
          model: "event",
          act: "get",
          details: {
            set: { _id: Array.isArray(params.id) ? params.id[0] : params.id },
            get: {
              _id: 1,
              name: 1,
              description: 1,
              startTime: 1,
              endTime: 1,
              color: 1,
              icon: 1,
              capacity: 1,
              status: 1,
              isPublic: 1,
              ticketPrice: 1,
              registrationRequired: 1,
              maxAttendees: 1,
              eventUrl: 1,
              registrationUrl: 1,
              meta: 1,
            },
          },
        });

        if (response.success && response.body) {
          const event = response.body;
          setFormData({
            _id: event._id,
            name: event.name,
            description: event.description || "",
            startTime: new Date(event.startTime).toISOString(),
            endTime: new Date(event.endTime).toISOString(),
            color: event.color || "#8884d8",
            icon: event.icon || "",
            capacity: event.capacity || "",
            status: event.status,
            isPublic: event.isPublic || false,
            ticketPrice: event.ticketPrice || "",
            registrationRequired: event.registrationRequired || false,
            maxAttendees: event.maxAttendees || "",
            eventUrl: event.eventUrl || "",
            registrationUrl: event.registrationUrl || "",
            meta: {
              key: event.meta?.key || "",
            },
          });
        } else {
          setError("رویداد مورد نظر یافت نشد");
        }
      } catch (err) {
        setError("خطا در بارگذاری اطلاعات رویداد");
        console.error("Error fetching event:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (name.startsWith("meta.")) {
      const metaKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaKey]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get token from cookies
      const token =
        typeof window !== "undefined"
          ? Cookies.get("token") || undefined
          : undefined;
      const api = AppApi(undefined, token);

      const response = await api.send({
        service: "main",
        model: "event",
        act: "update",
        details: {
          set: {
            ...formData,
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
          },
          get: {
            _id: 1,
            name: 1,
          },
        },
      });

      if (response.success && response.body) {
        router.push("/admin/events");
      } else {
        setError(
          "خطا در به‌روزرسانی رویداد: " + (response.body?.message || "نامشخص"),
        );
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      console.error("Error updating event:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-800">
              در حال بارگذاری اطلاعات رویداد
            </h2>
            <p className="text-slate-600">لطفاً منتظر بمانید...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          ویرایش رویداد
        </h1>
        <p className="text-slate-600 mt-2">
          اطلاعات رویداد شهرداری را ویرایش کنید
        </p>
      </div>

      <Link
        href="/admin/events"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        بازگشت به لیست رویدادها
      </Link>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              نام رویداد *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="نام رویداد را وارد کنید"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              وضعیت
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="draft">پیش نویس</option>
              <option value="published">منتشر شده</option>
              <option value="archived">بایگانی شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="توضیحات رویداد را وارد کنید"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              زمان شروع *
            </label>
            <input
              type="text"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              زمان پایان *
            </label>
            <input
              type="text"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ظرفیت
            </label>
            <input
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="تعداد ظرفیت رویداد"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              حداکثر شرکت کنندگان
            </label>
            <input
              type="text"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="حداکثر تعداد شرکت کنندگان"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              رنگ نمایش
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-12 h-10 border border-slate-300 rounded-lg"
              />
              <span>{formData.color}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              آیکون
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="آدرس آیکون"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-slate-700">عمومی</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="registrationRequired"
              checked={formData.registrationRequired}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-slate-700">
              نیاز به ثبت نام
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              قیمت بلیت
            </label>
            <input
              type="text"
              name="ticketPrice"
              value={formData.ticketPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="قیمت بلیت (به ریال)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              لینک رویداد
            </label>
            <input
              type="url"
              name="eventUrl"
              value={formData.eventUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="لینک اطلاعات بیشتر"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            لینک ثبت نام
          </label>
          <input
            type="url"
            name="registrationUrl"
            value={formData.registrationUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="لینک ثبت نام در رویداد"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Link
            href="/admin/events"
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            لغو
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی رویداد"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
