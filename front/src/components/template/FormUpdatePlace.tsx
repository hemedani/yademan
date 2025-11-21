"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { update } from "@/app/actions/place/update";
import { get } from "@/app/actions/place/get";
import { gets as getCategoriesAction } from "@/app/actions/category/gets";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import React from "react";
import { ReqType } from "@/types/declarations/selectInp";
import AsyncSelectBox from "../atoms/AsyncSelectBox";

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const useMapEvents = dynamic(
  () => import("react-leaflet").then((mod) => mod.useMapEvents),
  { ssr: false },
);

// Define Zod schema for form validation
const placeSchema = z.object({
  name: z
    .string()
    .min(2, { message: "نام باید حداقل ۲ کاراکتر باشد" })
    .max(100, { message: "نام نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد" }),
  description: z
    .string()
    .min(10, { message: "توضیحات باید حداقل ۱۰ کاراکتر باشد" })
    .max(2000, { message: "توضیحات نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد" }),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, {
      message: "نامک باید شامل حروف کوچک انگلیسی، اعداد و خط تیره باشد",
    })
    .min(3, { message: "نامک باید حداقل ۳ کاراکتر باشد" })
    .max(100, { message: "نامک نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد" })
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, { message: "آدرس نمی‌تواند بیشتر از ۲۰۰ کاراکتر باشد" })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(20, { message: "شماره تلفن نمی‌تواند بیشتر از ۲۰ کاراکتر باشد" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "لطفاً یک ایمیل معتبر وارد کنید" })
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url({ message: "لطفاً یک آدرس وب معتبر وارد کنید" })
    .optional()
    .or(z.literal("")),
  hoursOfOperation: z
    .string()
    .max(500, { message: "ساعات کاری نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد" })
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "active", "archived"], {
    errorMap: () => ({ message: "لطفاً یک وضعیت معتبر انتخاب کنید" }),
  }),
  category: z
    .string()
    .min(1, { message: "لطفاً یک دسته‌بندی انتخاب کنید" })
    .optional()
    .or(z.literal("")),
  latitude: z
    .number()
    .min(-90, { message: "عرض جغرافیایی باید بین -۹۰ تا ۹۰ باشد" })
    .max(90, { message: "عرض جغرافیایی باید بین -۹۰ تا ۹۰ باشد" }),
  longitude: z
    .number()
    .min(-180, { message: "طول جغرافیایی باید بین -۱۸۰ تا ۱۸۰ باشد" })
    .max(180, { message: "طول جغرافیایی باید بین -۱۸۰ تا ۱۸۰ باشد" }),
});

// Define the form type based on the schema
type PlaceFormValues = z.infer<typeof placeSchema>;

// MapClickHandler component for handling map clicks
const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: L.LatLng) => void;
}) => {
  const map = useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

interface FormUpdatePlaceProps {
  placeId: string;
}

const FormUpdatePlace: React.FC<FormUpdatePlaceProps> = ({ placeId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    35.6892, 51.389,
  ]); // Default to Tehran, Iran

  // Form setup with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<PlaceFormValues>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      hoursOfOperation: "",
      status: "draft",
      category: "",
      latitude: 35.6892,
      longitude: 51.389,
    },
  });

  // Fetch place data and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoadingInitial(true);
      try {
        // Fetch place details
        const placeResult = await get({
          set: { _id: placeId },
          get: {
            _id: 1,
            name: 1,
            description: 1,
            slug: 1,
            center: 1,
            address: 1,
            contact: {
              phone: 1,
              email: 1,
              website: 1,
            },
            hoursOfOperation: 1,
            category: {
              _id: 1,
              name: 1,
            },
            status: 1,
          },
        });

        if (placeResult.success && placeResult.body) {
          const place = placeResult.body;

          // Set form values from place data
          reset({
            name: place.name,
            description: place.description || "",
            slug: place.slug || "",
            address: place.address || "",
            phone: place.contact?.phone || "",
            email: place.contact?.email || "",
            website: place.contact?.website || "",
            hoursOfOperation: place.hoursOfOperation || "",
            status: place.status as "draft" | "active" | "archived",
            category: place.category?._id || "",
            latitude: place.center?.coordinates[1] || 35.6892, // Latitude is Y coordinate
            longitude: place.center?.coordinates[0] || 51.389, // Longitude is X coordinate
          });

          // Set marker position for map
          if (place.center?.coordinates) {
            setMarkerPosition([
              place.center.coordinates[1], // Latitude
              place.center.coordinates[0], // Longitude
            ]);
          }
        } else {
          ToastNotify("error", "خطا در دریافت اطلاعات مکان");
          router.push("/admin/places");
        }

        // Fetch categories
        const categoriesResult = await getCategoriesAction({
          set: {},
          get: { _id: 1, name: 1 },
        });

        if (categoriesResult.success) {
          setCategories(categoriesResult.body);
        } else {
          ToastNotify("error", "خطا در دریافت دسته‌بندی‌ها");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        ToastNotify("error", "خطا در بارگذاری اطلاعات");
        router.push("/admin/places");
      } finally {
        setLoadingInitial(false);
      }
    };

    if (placeId) {
      fetchData();
    }
  }, [placeId, reset, router]);

  // Handle map marker position change
  const handleMapClick = (latlng: L.LatLng) => {
    const { lat, lng } = latlng;
    setMarkerPosition([lat, lng]);
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<PlaceFormValues> = async (data) => {
    setLoading(true);
    try {
      const formData = {
        _id: placeId,
        name: data.name,
        description: data.description,
        slug: data.slug || undefined,
        center: {
          type: "Point" as const,
          coordinates: [data.longitude, data.latitude],
        },
        address: data.address || undefined,
        contact: {
          phone: data.phone || undefined,
          email: data.email || undefined,
          website: data.website || undefined,
        },
        category: data.category || undefined,
        hoursOfOperation: data.hoursOfOperation || undefined,
        status: data.status,
      };

      const result = await update(formData);

      if (result.success) {
        ToastNotify("success", "مکان با موفقیت به‌روزرسانی شد");
        router.push("/admin/places");
        router.refresh();
      } else {
        ToastNotify("error", `خطا در به‌روزرسانی مکان: ${result.body.message}`);
      }
    } catch (error) {
      console.error("Error updating place:", error);
      ToastNotify("error", "خطا در به‌روزرسانی مکان");
    } finally {
      setLoading(false);
    }
  };

  // Watch form values for conditional rendering
  const watchedValues = watch();

  // Show loading state while fetching initial data
  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600">در حال بارگذاری اطلاعات...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          اطلاعات اصلی
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <MyInput
            name="name"
            label="نام مکان *"
            register={register}
            errMsg={errors.name?.message}
            placeholder="مانند: موزه ملی ایران"
          />

          <MyInput
            name="slug"
            label="نامک (Slug)"
            register={register}
            errMsg={errors.slug?.message}
            placeholder="مانند: national-museum"
          />
        </div>

        <MyInput
          name="description"
          label="توضیحات *"
          register={register}
          errMsg={errors.description?.message}
          placeholder="توضیحاتی درباره این مکان"
          type="textarea"
        />
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          موقعیت مکانی
        </h2>

        <MyInput
          name="address"
          label="آدرس"
          register={register}
          errMsg={errors.address?.message}
          placeholder="آدرس کامل مکان"
        />

        <div className="mt-6 rounded-xl overflow-hidden border border-gray-600 h-[400px] relative">
          {typeof window !== "undefined" && (
            <MapContainer
              center={markerPosition}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={markerPosition} />
              <MapClickHandler onClick={handleMapClick} />
            </MapContainer>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <MyInput
            name="latitude"
            label="عرض جغرافیایی"
            register={register}
            type="number"
            step="0.000001"
            errMsg={errors.latitude?.message}
          />

          <MyInput
            name="longitude"
            label="طول جغرافیایی"
            register={register}
            type="number"
            step="0.000001"
            errMsg={errors.longitude?.message}
          />
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          اطلاعات تماس و ساعات کاری
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <MyInput
            name="phone"
            label="شماره تلفن"
            register={register}
            errMsg={errors.phone?.message}
            placeholder="02100000000"
          />

          <MyInput
            name="email"
            label="ایمیل"
            register={register}
            errMsg={errors.email?.message}
            placeholder="example@domain.com"
          />

          <MyInput
            name="website"
            label="وب‌سایت"
            register={register}
            errMsg={errors.website?.message}
            placeholder="https://example.com"
          />
        </div>

        <MyInput
          name="hoursOfOperation"
          label="ساعات کاری"
          register={register}
          errMsg={errors.hoursOfOperation?.message}
          placeholder="مثلا: شنبه تا چهارشنبه ۸ صبح تا ۶ عصر، پنجشنبه ۸ صبح تا ۱ بعدازظهر"
          type="textarea"
        />
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          طبقه‌بندی و وضعیت
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AsyncSelectBox
            name="category"
            control={control}
            label="دسته‌بندی"
            setValue={setValue}
            loadOptions={async () =>
              categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))
            }
            defaultOptions={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            placeholder="دسته‌بندی را انتخاب کنید"
            errMsg={errors.category?.message}
            labelAsValue={false}
          />

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-300 mb-2 text-right"
            >
              وضعیت *
            </label>
            <select
              id="status"
              {...register("status")}
              className={`
                w-full px-4 py-3 text-white bg-gray-700 border rounded-xl
                text-right transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-0 focus:border-pink-500
                hover:border-gray-500
                ${
                  errors.status
                    ? "border-red-500 bg-red-900/30 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-600 hover:bg-gray-600/50"
                }
              `}
            >
              <option value="draft" className="bg-gray-700 text-white">
                پیش‌نویس
              </option>
              <option value="active" className="bg-gray-700 text-white">
                منتشر شده
              </option>
              <option value="archived" className="bg-gray-700 text-white">
                آرشیو شده
              </option>
            </select>
            {errors.status && (
              <span className="text-red-400 text-xs font-medium text-right mt-1 flex items-center gap-1">
                <svg
                  className="w-3 h-3 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.status.message}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl hover:from-pink-700 hover:to-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-70 flex items-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          به‌روزرسانی مکان
        </button>
      </div>
    </form>
  );
};

export default FormUpdatePlace;
