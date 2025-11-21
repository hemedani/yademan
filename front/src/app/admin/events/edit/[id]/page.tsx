"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppApi } from "@/services/api";
import Cookies from "js-cookie";
import Link from "next/link";
import { eventSchema } from "@/types/declarations/selectInp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { Controller } from "react-hook-form";
import MyInput from "@/components/atoms/MyInput";
import DateInput from "@/components/atoms/DateInput";
import ColorPicker from "@/components/atoms/ColorPicker";
import IconPicker from "@/components/atoms/IconPicker";

type Event = eventSchema;

// Define the form schema using Zod
const EventFormSchema = z.object({
  _id: z.string(),
  name: z.string().min(1, "نام رویداد الزامی است"),
  description: z.string().optional(),
  startTime: z.string().min(1, "زمان شروع الزامی است"),
  endTime: z.string().min(1, "زمان پایان الزامی است"),
  color: z.string().optional(),
  icon: z.string().optional(),
  capacity: z.string().optional(),
  status: z.enum(["draft", "published", "archived", "cancelled"]),
  isPublic: z.boolean().optional(),
  ticketPrice: z.string().optional(),
  registrationRequired: z.boolean().optional(),
  maxAttendees: z.string().optional(),
  eventUrl: z.string().optional(),
  registrationUrl: z.string().optional(),
});

type EventFormValues = z.infer<typeof EventFormSchema>;

const EditEventPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();

  // Initialize react-hook-form with validation schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
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
    },
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            },
          },
        });

        if (response.success && response.body) {
          const event = response.body;
          // Reset the form with fetched data
          reset({
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
  }, [params.id, reset]);

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
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
            ...data,
            startTime: new Date(data.startTime).toISOString(),
            endTime: new Date(data.endTime).toISOString(),
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
            <div className="w-16 h-16 border-4 border-pink-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">
              در حال بارگذاری اطلاعات رویداد
            </h2>
            <p className="text-gray-400">لطفاً منتظر بمانید...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          ویرایش رویداد
        </h1>
        <p className="text-gray-400 mt-2">
          اطلاعات رویداد شهرداری را ویرایش کنید
        </p>
      </div>

      <Link
        href="/admin/events"
        className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-6"
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
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
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
            <span className="text-red-400">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <MyInput
              label="نام رویداد *"
              register={register}
              name="name"
              errMsg={errors.name?.message}
              className=""
            />
          </div>

          <div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 text-right">
                    وضعیت
                  </label>
                  <select
                    {...field}
                    className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-white"
                  >
                    <option value="draft">پیش نویس</option>
                    <option value="published">منتشر شده</option>
                    <option value="archived">بایگانی شده</option>
                    <option value="cancelled">لغو شده</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-500 text-xs text-right mt-1">
                      {errors.status.message}
                    </span>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        <div className="w-full">
          <MyInput
            label="توضیحات"
            register={register}
            name="description"
            errMsg={errors.description?.message}
            className=""
            type="textarea"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DateInput
              label="زمان شروع *"
              name="startTime"
              control={control}
              errMsg={errors.startTime?.message}
              className=""
              type="datetime"
              format="YYYY/MM/DD HH:mm"
              locale="fa"
            />
          </div>

          <div>
            <DateInput
              label="زمان پایان *"
              name="endTime"
              control={control}
              errMsg={errors.endTime?.message}
              className=""
              type="datetime"
              format="YYYY/MM/DD HH:mm"
              locale="fa"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <MyInput
              label="ظرفیت"
              register={register}
              name="capacity"
              errMsg={errors.capacity?.message}
              className=""
            />
          </div>

          <div>
            <MyInput
              label="حداکثر شرکت کنندگان"
              register={register}
              name="maxAttendees"
              errMsg={errors.maxAttendees?.message}
              className=""
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ColorPicker
              name="color"
              control={control}
              label="رنگ نمایش"
              defaultValue="#8884d8"
              errMsg={errors.color?.message}
            />
          </div>

          <div>
            <IconPicker
              name="icon"
              control={control}
              label="آیکون"
              defaultValue="📍"
              errMsg={errors.icon?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600 rounded"
                  />
                  <label
                    htmlFor="isPublic"
                    className="text-sm font-medium text-gray-300 text-right"
                  >
                    عمومی
                  </label>
                </div>
              )}
            />
            {errors.isPublic && (
              <span className="text-red-500 text-xs text-right mt-1">
                {errors.isPublic.message}
              </span>
            )}
          </div>

          <div>
            <Controller
              name="registrationRequired"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="registrationRequired"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 text-pink-500 focus:ring-pink-500 bg-gray-700 border-gray-600 rounded"
                  />
                  <label
                    htmlFor="registrationRequired"
                    className="text-sm font-medium text-gray-300 text-right"
                  >
                    نیاز به ثبت نام
                  </label>
                </div>
              )}
            />
            {errors.registrationRequired && (
              <span className="text-red-500 text-xs text-right mt-1">
                {errors.registrationRequired.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <MyInput
              label="قیمت بلیت"
              register={register}
              name="ticketPrice"
              errMsg={errors.ticketPrice?.message}
              className=""
            />
          </div>

          <div>
            <MyInput
              label="لینک رویداد"
              register={register}
              name="eventUrl"
              type="url"
              errMsg={errors.eventUrl?.message}
              className=""
            />
          </div>
        </div>

        <div>
          <MyInput
            label="لینک ثبت نام"
            register={register}
            name="registrationUrl"
            type="url"
            errMsg={errors.registrationUrl?.message}
            className=""
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          {!isValid && Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-400 mr-4 self-center text-right">
              لطفاً فیلدهای اجباری را تکمیل کنید
            </div>
          )}
          <Link
            href="/admin/events"
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
          >
            لغو
          </Link>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-pink-500/30"
          >
            {loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی رویداد"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
