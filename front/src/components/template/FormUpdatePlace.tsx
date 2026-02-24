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
import { useMapEvents } from "react-leaflet";
import L from "leaflet";

interface LatLng {
  lat: number;
  lng: number;
}

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const SimpleDrawing = dynamic(() => import("@/components/SimpleDrawing"), {
  ssr: false,
});

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
  antiquity: z.coerce
    .number({
      invalid_type_error: "عمر آثار باید یک عدد معتبر باشد",
    })
    .min(-10000, { message: "عمر آثار نمی‌تواند کمتر از ۱۰۰۰۰ سال قبل از هجرت باشد" })
    .max(10000, { message: "عمر آثار باید کمتر از ۱۰۰۰۰ سال باشد" })
    .optional(),
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
  email: z.string().email({ message: "لطفاً یک ایمیل معتبر وارد کنید" }).optional().or(z.literal("")),
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
  latitude: z.coerce
    .number()
    .min(-90, { message: "عرض جغرافیایی باید بین -۹۰ تا ۹۰ باشد" })
    .max(90, { message: "عرض جغرافیایی باید بین -۹۰ تا ۹۰ باشد" }),
  longitude: z.coerce
    .number()
    .min(-180, { message: "طول جغرافیایی باید بین -۱۸۰ تا ۱۸۰ باشد" })
    .max(180, { message: "طول جغرافیایی باید بین -۱۸۰ تا ۱۸۰ باشد" }),
  area: z
    .object({
      type: z.literal("MultiPolygon"),
      coordinates: z.array(z.array(z.array(z.array(z.coerce.number())))),
    })
    .optional(),
});

// Define the form type based on the schema
type PlaceFormValues = z.infer<typeof placeSchema>;

// MapClickHandler component for handling map clicks
const MapClickHandler = ({
  onClick,
  isActive,
}: {
  onClick: (latlng: L.LatLng) => void;
  isActive?: boolean;
}) => {
  const map = useMapEvents({
    click(e) {
      if (isActive) {
        onClick(e.latlng);
      }
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
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([35.6892, 51.389]); // Default to Tehran, Iran
  const [mapZoom, setMapZoom] = useState(6);
  const [mapKey, setMapKey] = useState(0);
  const [drawnPolygon, setDrawnPolygon] = useState<[number, number][] | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  // Form setup with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PlaceFormValues>({
    resolver: zodResolver(placeSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      antiquity: undefined,
      address: "",
      phone: "",
      email: "",
      website: "",
      hoursOfOperation: "",
      status: "draft",
      latitude: 35.6892,
      longitude: 51.389,
      area: { type: "MultiPolygon", coordinates: [] },
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
            antiquity: 1,
            description: 1,
            slug: 1,
            center: 1,
            area: 1, // Add area field
            address: 1,
            contact: 1,
            hoursOfOperation: 1,
            status: 1,
          },
        });

        if (placeResult.success && placeResult.body) {
          const place = placeResult.body[0];

          // Set form values from place data
          reset({
            name: place.name,
            description: place.description || "",
            slug: place.slug || "",
            antiquity: place.antiquity,
            address: place.address || "",
            phone: place.contact?.phone || "",
            email: place.contact?.email || "",
            website: place.contact?.website || "",
            hoursOfOperation: place.hoursOfOperation || "",
            status: place.status as "draft" | "active" | "archived",
            latitude: place.center?.coordinates[1]
              ? Number(place.center.coordinates[1].toFixed(6))
              : 35.6892, // Latitude is Y coordinate, rounded to 6 decimal places
            longitude: place.center?.coordinates[0]
              ? Number(place.center.coordinates[0].toFixed(6))
              : 51.389, // Longitude is X coordinate, rounded to 6 decimal places
            area: place.area || { type: "MultiPolygon", coordinates: [] },
          });

          // Set marker position for map
          if (place.center?.coordinates) {
            const [lng, lat] = place.center.coordinates;
            setMarkerPosition([lat, lng]);
            setMapZoom(15); // Appropriate zoom for place location
            setMapKey((prev) => prev + 1); // Force map re-render to reflect new position and zoom
          }

          // Set polygon data if available (using first polygon of MultiPolygon)
          if (
            place.area?.coordinates &&
            place.area.coordinates.length > 0 &&
            place.area.coordinates[0].length > 0
          ) {
            // Convert first polygon of MultiPolygon coordinates to the format expected by Leaflet
            const firstPolygon = (place.area.coordinates[0][0] as [number, number][]).map(
              ([lng, lat]: [number, number]) =>
                [Number(lat.toFixed(6)), Number(lng.toFixed(6))] as [number, number],
            );
            setDrawnPolygon(firstPolygon);
          }
        } else {
          ToastNotify("error", "خطا در دریافت اطلاعات مکان");
          router.push("/admin/places");
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
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));
    setMarkerPosition([roundedLat, roundedLng]);
    setValue("latitude", roundedLat);
    setValue("longitude", roundedLng);
  };

  // Handle polygon deletion
  const handlePolygonDeleted = () => {
    setDrawnPolygon(null);
    setValue("area", { type: "MultiPolygon", coordinates: [] });
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
        antiquity: data.antiquity ?? 0,
        center: {
          type: "Point" as const,
          coordinates: [Number(data.longitude.toFixed(6)), Number(data.latitude.toFixed(6))] as [
            number,
            number,
          ],
        },
        area: data.area!,
        address: data.address || undefined,
        contact: {
          phone: data.phone || undefined,
          email: data.email || undefined,
          website: data.website || undefined,
        },
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

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    if (isDrawingMode) {
      setIsDrawingMode(false);
    } else {
      setIsDrawingMode(true);
    }
  };

  // Handle polygon creation from drawing tool
  const handlePolygonCreated = (polygons: LatLng[][]) => {
    // Only handle the first polygon (SimpleDrawing typically returns one polygon)
    if (polygons.length > 0) {
      // Convert LatLng objects to [number, number] format for the state
      const firstPolygon = polygons[0].map((point) => [point.lat, point.lng] as [number, number]);
      setDrawnPolygon(firstPolygon);

      // Convert the polygon to the format expected by the form
      const coordinates = polygons[0].map((point) => [
        Number(point.lng.toFixed(6)),
        Number(point.lat.toFixed(6)),
      ]);

      // Add the closing point if it's not already closed
      const firstPoint = coordinates[0];
      const lastPoint = coordinates[coordinates.length - 1];

      if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
        coordinates.push(firstPoint); // Close the polygon
      }

      setValue("area", { type: "MultiPolygon", coordinates: [[coordinates]] });
    } else {
      setValue("area", { type: "MultiPolygon", coordinates: [] });
    }
  };

  // Clear drawn polygon
  const clearDrawnPolygon = () => {
    setDrawnPolygon(null);
    setValue("area", { type: "MultiPolygon", coordinates: [] });
  };

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
            label="نام مکان"
            register={register}
            errMsg={errors.name?.message}
            placeholder="مانند: موزه ملی ایران"
            isRequired={true}
          />

          <MyInput
            name="slug"
            label="نامک (Slug)"
            register={register}
            errMsg={errors.slug?.message}
            placeholder="مانند: national-museum"
          />

          <MyInput
            name="antiquity"
            label="عمر آثار (سال)"
            register={register}
            errMsg={errors.antiquity?.message}
            placeholder="مثال: 2000"
            type="number"
            isRequired={true}
          />
        </div>

        <MyInput
          name="description"
          label="توضیحات"
          register={register}
          errMsg={errors.description?.message}
          placeholder="توضیحاتی درباره این مکان"
          type="textarea"
          isRequired={true}
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
              key={`${markerPosition[0]}-${markerPosition[1]}`} // Force re-render when position changes
              center={markerPosition}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* Show polygon if available */}
              {drawnPolygon && (
                <Polygon
                  positions={drawnPolygon}
                  pathOptions={{
                    color: "#FF007A", // Pink
                    weight: 3,
                    opacity: 0.8,
                    fillOpacity: 0.2,
                    fillColor: "#FF007A", // Pink
                  }}
                />
              )}
              {markerPosition && <Marker position={markerPosition} />}
              <MapClickHandler onClick={handleMapClick} isActive={isDrawingMode} />
              <SimpleDrawing
                isActive={isDrawingMode}
                onPolygonCreated={handlePolygonCreated}
                onPolygonDeleted={handlePolygonDeleted}
              />
            </MapContainer>
          )}
        </div>

        {/* Map Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {drawnPolygon && drawnPolygon.length > 0 && (
              <button
                type="button"
                onClick={clearDrawnPolygon}
                className="bg-red-900/30 text-red-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-900/50 transition-colors border border-red-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span>حذف منطقه</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={toggleDrawingMode}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isDrawingMode
                ? "bg-pink-600 text-white"
                : "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {isDrawingMode ? "در حال ترسیم..." : "ترسیم محدوده"}
          </button>
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
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
