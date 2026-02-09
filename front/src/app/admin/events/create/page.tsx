"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { AppApi, getLesanBaseUrl } from "@/services/api";
import Cookies from "js-cookie";
import Link from "next/link";
import { ToastNotify } from "@/utils/helper";
import DateInput from "@/components/atoms/DateInput";
import MyInput from "@/components/atoms/MyInput";
import MyAsyncMultiSelect from "@/components/atoms/MyAsyncMultiSelect";
import ColorPicker from "@/components/atoms/ColorPicker";
import IconPicker from "@/components/atoms/IconPicker";
import AsyncSelectBox from "@/components/atoms/AsyncSelectBox";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { UploadImage } from "@/components/molecules/UploadFile";
import { getUsers as getUsersAction } from "@/app/actions/user/getUsers";
import { gets as getTagsAction } from "@/app/actions/tag/gets";
import { gets as getPlacesAction } from "@/app/actions/place/gets";

// Define the form schema using Zod
const EventFormSchema = z.object({
  name: z.string().min(1, "نام رویداد الزامی است"),
  description: z.string().optional(),
  startTime: z.string().min(1, "زمان شروع الزامی است"),
  endTime: z.string().min(1, "زمان پایان الزامی است"),
  color: z.string().min(1, "رنگ الزامی است"),
  icon: z.string().optional(),
  capacity: z.string().optional(),
  status: z.enum(["draft", "published", "archived", "cancelled"]),
  isPublic: z.boolean().optional(),
  ticketPrice: z.string().optional(),
  registrationRequired: z.boolean().optional(),
  maxAttendees: z.string().optional(),
  eventUrl: z.string().optional(),
  registrationUrl: z.string().optional(),
  organizer: z.string().optional(),
  tags: z.array(z.string()).optional(),
  placeIds: z.array(z.string()).optional(),
  thumbnail: z.string().optional(),
  gallery: z.array(z.string()).optional(),
});

type EventFormValues = z.infer<typeof EventFormSchema>;

const CreateEventPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Initialize react-hook-form with validation schema
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    watch,
    setValue,
  } = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
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
      organizer: "",
      tags: [],
      placeIds: [],
      thumbnail: "",
      gallery: [],
    },
    mode: "onChange",
  });

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load users options for organizer field
  const loadUsersOptions = async (inputValue: string) => {
    try {
      const response = await getUsersAction({
        set: {
          page: 1,
          limit: 20,
          ...(inputValue ? { name: inputValue } : {}),
        },
        get: { _id: 1, first_name: 1, last_name: 1 },
      });

      if (response && response.success) {
        return response.body.map((item: { _id: string; first_name: string; last_name: string }) => ({
          value: item._id,
          label: `${item.first_name} ${item.last_name}`,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading users:", error);
      return [];
    }
  };

  // Load tags options
  const loadTagsOptions = async (inputValue: string) => {
    try {
      const response = await getTagsAction({
        set: {
          page: 1,
          limit: 20,
          ...(inputValue ? { name: inputValue } : {}),
        },
        get: { _id: 1, name: 1 },
      });

      if (response && response.success) {
        return response.body.map((item: { _id: string; name: string }) => ({
          value: item._id,
          label: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading tags:", error);
      return [];
    }
  };

  // Load places options
  const loadPlacesOptions = async (inputValue: string) => {
    try {
      const response = await getPlacesAction({
        set: {
          page: 1,
          limit: 20,
          ...(inputValue ? { name: inputValue } : {}),
        },
        get: {
          data: { _id: 1, name: 1 },
          metadata: { total: 1, page: 1, pageCount: 1, limit: 1 },
        },
      });

      if (response && response.success) {
        return response.body.data.map((item: { _id: string; name: string }) => ({
          value: item._id,
          label: item.name,
        }));
      }
      return [];
    } catch (error) {
      console.error("Error loading places:", error);
      return [];
    }
  };

  // Define the event creation function
  const createEvent = async (formData: EventFormValues) => {
    try {
      // Get token from cookies
      const token = typeof window !== "undefined" ? Cookies.get("token") || undefined : undefined;
      const api = AppApi(undefined, token);

      // Prepare the event data
      const eventData = {
        ...formData,
        status: formData.status || "draft", // Ensure default status
        isPublic: formData.isPublic ?? false, // Ensure default isPublic
        registrationRequired: formData.registrationRequired ?? false, // Ensure default registrationRequired
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : undefined,
        endTime: formData.endTime ? new Date(formData.endTime).toISOString() : undefined,
        organizer: formData.organizer || undefined,
        tags: formData.tags || undefined,
        placeIds: formData.placeIds || undefined,
        thumbnail: formData.thumbnail || undefined,
        gallery: galleryImages.length > 0 ? galleryImages : undefined,
      };

      const response = await api.send({
        service: "main",
        model: "event",
        act: "add",
        details: {
          set: {
            ...eventData,
            isPublic: eventData.isPublic,
            ticketPrice: eventData.ticketPrice,
            registrationRequired: eventData.registrationRequired,
            maxAttendees: eventData.maxAttendees,
            eventUrl: eventData.eventUrl,
            registrationUrl: eventData.registrationUrl,
            organizer: eventData.organizer,
            tags: eventData.tags,
            placeIds: eventData.placeIds,
          },
          get: {
            _id: 1,
            name: 1,
          },
        },
      });

      return response;
    } catch (err) {
      console.error("Error creating event:", err);
      return { success: false, body: { message: "خطا در اتصال به سرور" } };
    }
  };

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await createEvent(data);

      if (response.success && response.body) {
        ToastNotify("success", "رویداد با موفقیت ایجاد شد");
        router.push("/admin/events");
      } else {
        setError(response.body?.message || "خطا در ایجاد رویداد");
        ToastNotify("error", response.body?.message || "خطا در ایجاد رویداد");
      }
    } catch (err) {
      setError("خطا در ارتباط با سرور");
      ToastNotify("error", "خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          ایجاد رویداد جدید
        </h1>
        <p className="text-gray-400 mt-2">اطلاعات رویداد شهرداری را وارد کنید</p>
      </div>

      <Link
        href="/admin/events"
        className="inline-flex items-center text-pink-400 hover:text-pink-300 mb-6"
      >
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="w-full flex flex-wrap">
          {/* Left column */}
          <div className="w-1/2 p-4">
            <MyInput
              label="نام رویداد *"
              register={register}
              name="name"
              errMsg={errors.name?.message}
              className=""
            />
          </div>

          <div className="w-1/2 p-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300 text-right">وضعیت</label>
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

          <div className="w-1/2 p-4">
            <MyInput
              label="توضیحات"
              register={register}
              name="description"
              errMsg={errors.description?.message}
              className=""
              type="textarea"
            />
          </div>

          <div className="w-1/2 p-4">
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

          <div className="w-1/2 p-4">
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

          <div className="w-1/2 p-4">
            <MyInput
              label="ظرفیت"
              register={register}
              name="capacity"
              errMsg={errors.capacity?.message}
              className=""
            />
          </div>

          <div className="w-1/2 p-4">
            <MyInput
              label="حداکثر شرکت کنندگان"
              register={register}
              name="maxAttendees"
              errMsg={errors.maxAttendees?.message}
              className=""
            />
          </div>

          <div className="w-1/2 p-4">
            <ColorPicker
              name="color"
              control={control}
              label="رنگ نمایش"
              defaultValue="#8884d8"
              errMsg={errors.color?.message}
            />
          </div>

          <div className="w-1/2 p-4">
            <IconPicker
              name="icon"
              control={control}
              label="آیکون"
              defaultValue="📍"
              errMsg={errors.icon?.message}
            />
          </div>

          <div className="w-1/2 p-4">
            <MyInput
              label="قیمت بلیت"
              register={register}
              name="ticketPrice"
              errMsg={errors.ticketPrice?.message}
              className=""
            />
          </div>

          <div className="w-1/2 p-4">
            <MyInput
              label="لینک رویداد"
              register={register}
              name="eventUrl"
              type="url"
              errMsg={errors.eventUrl?.message}
              className=""
            />
          </div>

          <div className="w-1/2 p-4">
            <MyInput
              label="لینک ثبت نام"
              register={register}
              name="registrationUrl"
              type="url"
              errMsg={errors.registrationUrl?.message}
              className=""
            />
          </div>

          <div className="w-1/2 p-4">
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
                  <label htmlFor="isPublic" className="text-sm font-medium text-gray-300 text-right">
                    عمومی
                  </label>
                </div>
              )}
            />
          </div>

          <div className="w-1/2 p-4">
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
          </div>

          {/* Organizer Selection */}
          <div className="w-1/2 p-4">
            <AsyncSelectBox
              name="organizer"
              label="سازمان‌دهنده"
              setValue={setValue}
              loadOptions={loadUsersOptions}
              defaultOptions
              placeholder="سازمان‌دهنده را انتخاب کنید"
              className=""
              errMsg={errors.organizer?.message}
            />
          </div>

          {/* Tags Selection */}
          <div className="w-1/2 p-4">
            <MyAsyncMultiSelect
              name="tags"
              label="برچسب‌ها"
              setValue={setValue}
              loadOptions={loadTagsOptions}
              defaultOptions
              placeholder="برچسب‌ها را انتخاب کنید"
              className=""
              errMsg={errors.tags?.message}
            />
          </div>

          {/* Places Selection */}
          <div className="w-1/2 p-4">
            <MyAsyncMultiSelect
              name="placeIds"
              label="مکان‌ها"
              setValue={setValue}
              loadOptions={loadPlacesOptions}
              defaultOptions
              placeholder="مکان‌ها را انتخاب کنید"
              className=""
              errMsg={errors.placeIds?.message}
            />
          </div>

          {/* Thumbnail Upload */}
          <div className="w-1/2 p-4">
            <span className="text-sm font-medium text-gray-300 block mb-2 text-right">تصویر شاخص</span>
            <UploadImage
              inputName="thumbnail"
              setUploadedImage={(uploaded: string) =>
                setValue("thumbnail", uploaded, { shouldValidate: true })
              }
              type="image"
              token={typeof window !== "undefined" ? Cookies.get("token") : undefined}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-xs mt-1 text-right">{errors.thumbnail.message}</p>
            )}
          </div>

          {/* Gallery Upload */}
          <div className="w-1/2 p-4">
            <span className="text-sm font-medium text-gray-300 block mb-2 text-right">
              گالری تصاویر
            </span>
            <div className="flex flex-wrap gap-4">
              <UploadImage
                inputName="gallery"
                setUploadedImage={(uploaded: string) => {
                  setGalleryImages((prev) => [...prev, uploaded]);
                  setValue("gallery", [...galleryImages, uploaded], {
                    shouldValidate: true,
                  });
                }}
                type="image"
                token={typeof window !== "undefined" ? Cookies.get("token") : undefined}
              />
              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="w-full text-sm text-gray-400 text-right">
                    {galleryImages.length} تصویر آپلود شده
                  </p>
                </div>
              )}
            </div>
            {errors.gallery && (
              <p className="text-red-500 text-xs mt-1 text-right">{errors.gallery.message}</p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-end space-x-4 pt-6">
          {!isValid && Object.keys(errors).length > 0 && (
            <div className="text-sm text-red-400 mr-4 self-center text-right">
              لطفاً فیلدهای اجباری را تکمیل کنید
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="p-4 px-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-center font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-pink-500/30"
          >
            {isSubmitting ? "در حال ایجاد..." : "ایجاد رویداد"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventPage;
