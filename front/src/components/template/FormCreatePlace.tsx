"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { add } from "@/app/actions/place/add";
import { gets as getCategoriesAction } from "@/app/actions/category/gets";
import { gets as getProvincesAction } from "@/app/actions/province/gets";
import { gets as getCitiesAction } from "@/app/actions/city/gets";
import { gets as getCityZonesAction } from "@/app/actions/city_zone/gets";
import { get as getCityZoneAction } from "@/app/actions/city_zone/get";
import { gets as getTagsAction } from "@/app/actions/tag/gets";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import AsyncSelectBox from "../atoms/AsyncSelectBox";
import { UploadImage } from "@/components/molecules/UploadFile";
import MapClickHandler from "@/components/MapClickHandler";
import "leaflet/dist/leaflet.css";

// Dynamically import map components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const SimpleDrawing = dynamic(() => import("@/components/SimpleDrawing"), {
  ssr: false,
});

interface SelectOption {
  value: string;
  label: string;
}

interface LatLng {
  lat: number;
  lng: number;
}

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
  thumbnail: z.string().optional().or(z.literal("")),
  gallery: z.array(z.string()).optional(),
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
  province: z.string().min(1, { message: "انتخاب استان الزامی است" }),
  city: z.string().min(1, { message: "انتخاب شهر الزامی است" }),
  city_zone: z.string().optional().or(z.literal("")),
  category: z.string().min(1, { message: "لطفاً یک دسته‌بندی انتخاب کنید" }),
  tags: z.array(z.string()).optional(),
  center: z.object({
    type: z.literal("Point"),
    coordinates: z
      .array(z.number())
      .length(2, { message: "مختصات مرکز باید شامل طول و عرض جغرافیایی باشد" }),
  }),
  area: z
    .object({
      type: z.literal("MultiPolygon"),
      coordinates: z.array(z.array(z.array(z.array(z.number())))),
    })
    .optional(),
});

// Define the form type based on the schema
type PlaceFormValues = z.infer<typeof placeSchema>;

const FormCreatePlace = ({
  token,
  lesanUrl,
}: {
  token?: string;
  lesanUrl?: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Map state
  const [drawnPolygon, setDrawnPolygon] = useState<LatLng[][] | null>(null);
  const [centerPoint, setCenterPoint] = useState<LatLng | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isCenterMode, setIsCenterMode] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    35.6892, 51.389,
  ]); // Default to Tehran, Iran
  const [mapZoom, setMapZoom] = useState(6);
  const [mapKey, setMapKey] = useState(0);
  const [isMapReady, setIsMapReady] = useState(false);

  // Form setup with Zod validation
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
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
      province: "",
      city: "",
      city_zone: "",
      category: "",
      tags: [],
      center: {
        type: "Point",
        coordinates: [51.389, 35.6892], // [longitude, latitude] - Tehran, Iran
      },
      area: {
        type: "MultiPolygon",
        coordinates: [],
      },
    },
  });

  // Fix Leaflet touch events and initialize center point
  useEffect(() => {
    if (typeof window !== "undefined" && L) {
      // Set up Leaflet default icon paths
      // @ts-expect-error - _getIconUrl exists but is not in TypeScript definitions
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
      });

      // Fix for "wrong event specified: touchleave" error
      if (L.Browser && L.Browser.touch && !L.Browser.pointer) {
        L.DomEvent.disableClickPropagation = L.DomUtil.falseFn;
      }
      setIsMapReady(true);
    }
  }, []);

  // Load provinces options
  const loadProvincesOptions = useCallback(
    async (inputValue?: string): Promise<SelectOption[]> => {
      const setParams: { limit: number; page: number; name?: string } = {
        limit: 20,
        page: 1,
      };
      if (inputValue) {
        setParams.name = inputValue;
      }

      console.log("Fetching provinces with params:", setParams);
      try {
        const response = await getProvincesAction({
          set: setParams,
          get: { _id: 1, name: 1 },
        });
        console.log("Provinces API response:", response);

        if (response && response.success) {
          const provinces = response.body.map(
            (item: { _id: string; name: string }) => ({
              value: item._id,
              label: item.name,
            }),
          );
          console.log("Parsed provinces:", provinces);
          return provinces;
        }
        console.log("No successful response from provinces API");
        return [];
      } catch (error) {
        console.error("Error loading provinces:", error);
        return [];
      }
    },
    [],
  );

  // Load cities options based on selected province
  const loadCitiesOptions = useCallback(
    async (inputValue?: string): Promise<SelectOption[]> => {
      const selectedProvince = watch("province");
      if (!selectedProvince) {
        console.log("No province selected, returning empty array");
        return [];
      }

      const setParams: {
        limit: number;
        page: number;
        name?: string;
        provinceId?: string;
      } = {
        limit: 20,
        page: 1,
        provinceId: selectedProvince,
      };
      if (inputValue) {
        setParams.name = inputValue;
      }

      try {
        console.log("Fetching cities with params:", setParams);
        const response = await getCitiesAction({
          set: setParams,
          get: { _id: 1, name: 1 },
        });
        console.log("Cities API response:", response);

        if (response && response.success) {
          const cities = response.body.map(
            (item: { _id: string; name: string }) => ({
              value: item._id,
              label: item.name,
            }),
          );
          console.log("Parsed cities:", cities);
          return cities;
        }
        console.log("No successful response from cities API");
        return [];
      } catch (error) {
        console.error("Error loading cities:", error);
        return [];
      }
    },
    [watch],
  );

  // Load city zones options based on selected city
  const loadCityZonesOptions = useCallback(
    async (inputValue: string): Promise<SelectOption[]> => {
      const selectedCityValue = watch("city");
      if (!selectedCityValue) {
        console.log("No city selected, returning empty array");
        return [];
      }

      const setParams: {
        limit: number;
        page: number;
        name?: string;
        cityId?: string;
      } = {
        limit: 20,
        page: 1,
        cityId: selectedCityValue,
      };
      if (inputValue) {
        setParams.name = inputValue;
      }

      try {
        console.log("Fetching city zones with params:", setParams);
        const response = await getCityZonesAction({
          set: setParams,
          get: { _id: 1, name: 1 },
        });
        console.log("City zones API response:", response);

        if (response && response.success) {
          const cityZones = response.body.map(
            (item: { _id: string; name: string }) => ({
              value: item._id,
              label: item.name,
            }),
          );
          console.log("Parsed city zones:", cityZones);
          return cityZones;
        }
        console.log("No successful response from city zones API");
        return [];
      } catch (error) {
        console.error("Error loading city zones:", error);
        return [];
      }
    },
    [watch],
  );

  // Load categories options
  const loadCategoriesOptions = useCallback(
    async (inputValue: string): Promise<SelectOption[]> => {
      const setParams: { limit: number; page: number; name?: string } = {
        limit: 20,
        page: 1,
      };
      if (inputValue) {
        setParams.name = inputValue;
      }
      try {
        const response = await getCategoriesAction({
          set: setParams,
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
        console.error("Error loading categories:", error);
        return [];
      }
    },
    [],
  );

  // Load tags options
  const loadTagsOptions = useCallback(
    async (inputValue: string): Promise<SelectOption[]> => {
      const setParams: { limit: number; page: number; name?: string } = {
        limit: 20,
        page: 1,
      };
      if (inputValue) {
        setParams.name = inputValue;
      }
      try {
        const response = await getTagsAction({
          set: setParams,
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
    },
    [],
  );

  // Handle province selection
  // When province changes, city and city_zone should be cleared
  const handleProvinceSelect = async (option: SelectOption | null) => {
    setValue("city", "");
    setValue("city_zone", "");
  };

  // Handle city selection
  const handleCitySelect = async (option: SelectOption | null) => {
    setValue("city_zone", "");
  };

  // Handle city zone selection
  const handleCityZoneSelect = async (option: SelectOption | null) => {
    // If a city zone is selected, get its details and center the map on it
    if (option) {
      try {
        const response = await getCityZoneAction(option.value, {
          _id: 1,
          name: 1,
          center: 1,
          area: 1,
        });

        if (response && response.success && response.body) {
          const cityZone = response.body[0];
          if (cityZone.center && cityZone.center.coordinates) {
            // Coordinates format is [longitude, latitude] from the schema
            const [lng, lat] = cityZone.center.coordinates;
            setMapCenter([lat, lng]); // Leaflet format is [latitude, longitude]
            setMapZoom(12); // Appropriate zoom for city zone level
            setMapKey((prev) => prev + 1); // Force map re-render to reflect new center
          }
        } else {
          console.error(
            "Failed to fetch city zone:",
            response?.body?.message || "Unknown error",
          );
        }
      } catch (error) {
        console.error("Error fetching city zone:", error);
        // Fallback: just zoom in a bit more without centering
        setMapZoom(12);
        setMapKey((prev) => prev + 1);
      }
    }
  };

  // Handle polygon creation from drawing tool
  const handlePolygonCreated = useCallback(
    (polygons: LatLng[][]) => {
      setDrawnPolygon(polygons);
      // Convert the polygon to the format expected by the schema
      const coordinates = polygons.map((polygon) =>
        polygon.map((point) => [point.lng, point.lat]),
      );

      if (coordinates.length > 0) {
        // Add the closing point if it's not already closed
        const firstPolygon = coordinates[0];
        const firstPoint = firstPolygon[0];
        const lastPoint = firstPolygon[firstPolygon.length - 1];

        if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
          firstPolygon.push(firstPoint);
        }

        setValue(
          "area",
          { type: "MultiPolygon", coordinates: [coordinates] },
          { shouldValidate: true },
        );
      } else {
        setValue(
          "area",
          { type: "MultiPolygon", coordinates: [] },
          { shouldValidate: true },
        );
      }
      trigger();
    },
    [setValue, trigger],
  );

  // Handle polygon deletion
  const handlePolygonDeleted = useCallback(() => {
    setDrawnPolygon(null);
    setValue(
      "area",
      { type: "MultiPolygon", coordinates: [] },
      { shouldValidate: true },
    );
    trigger();
  }, [setValue, trigger]);

  // Handle map click for center point
  const handleMapClick = useCallback(
    (e: LatLng) => {
      if (isCenterMode) {
        const { lat, lng } = e;
        setCenterPoint({ lat, lng });
        setValue(
          "center",
          { type: "Point", coordinates: [lng, lat] },
          { shouldValidate: true },
        );
        setIsCenterMode(false);
        trigger();
      }
    },
    [isCenterMode, setValue, trigger],
  );

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    if (isDrawingMode) {
      setIsDrawingMode(false);
    } else {
      setIsDrawingMode(true);
      setIsCenterMode(false);
    }
  };

  // Toggle center mode
  const toggleCenterMode = () => {
    console.log("Toggling center mode, current value:", isCenterMode);
    if (isCenterMode) {
      setIsCenterMode(false);
    } else {
      setIsCenterMode(true);
      setIsDrawingMode(false);
    }
    console.log("Center mode will be set to:", !isCenterMode);
  };

  // Clear drawn polygon
  const clearDrawnPolygon = () => {
    setDrawnPolygon(null);
    setValue(
      "area",
      { type: "MultiPolygon", coordinates: [] },
      { shouldValidate: true },
    );
    trigger();
  };

  // Clear center point
  const clearCenterPoint = () => {
    // Set centerPoint to null to hide the marker
    setCenterPoint(null);
    // Reset to default Tehran coordinates in the form
    setValue(
      "center",
      { type: "Point", coordinates: [51.389, 35.6892] },
      { shouldValidate: true },
    );
    trigger();
  };

  // Form submission handler
  const onSubmit: SubmitHandler<PlaceFormValues> = async (data) => {
    setLoading(true);
    try {
      const formData = {
        name: data.name,
        description: data.description,
        slug: data.slug || undefined,
        center: {
          type: "Point",
          coordinates: centerPoint
            ? [centerPoint.lng, centerPoint.lat]
            : [51.389, 35.6892], // Default to Tehran if no center point selected
        },
        area: data.area,
        address: data.address || undefined,
        contact: {
          phone: data.phone || undefined,
          email: data.email || undefined,
          website: data.website || undefined,
        },
        province: data.province,
        city: data.city,
        city_zone: data.city_zone || undefined,
        category: data.category,
        hoursOfOperation: data.hoursOfOperation || undefined,
        status: data.status,
        tags: data.tags || [],
        thumbnail: data.thumbnail || undefined,
        gallery: galleryImages.length > 0 ? galleryImages : undefined,
      };

      const result = await add({
        set: formData,
        get: { _id: 1, name: 1, address: 1 },
      });

      if (result.success) {
        ToastNotify("success", "مکان با موفقیت ایجاد شد");
        router.push("/admin/places");
        router.refresh();
      } else {
        ToastNotify("error", `خطا در ایجاد مکان: ${result.body.message}`);
      }
    } catch (error) {
      console.error("Error creating place:", error);
      ToastNotify("error", "خطا در ایجاد مکان");
    } finally {
      setLoading(false);
    }
  };

  // Watch form values for conditional rendering
  const watchedValues = watch();

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
            placeholder="مثال: موزه هنرهای معاصر"
          />

          <MyInput
            name="slug"
            label="نامک (slug)"
            register={register}
            errMsg={errors.slug?.message}
            placeholder="مثال: museum-of-contemporary-art"
          />

          <div className="col-span-1">
            <UploadImage
              label="تصویر شاخص"
              inputName="thumbnail"
              setUploadedImage={(uploaded: string) =>
                setValue("thumbnail", uploaded, { shouldValidate: true })
              }
              type="image"
              token={token}
            />
            {errors.thumbnail && (
              <p className="text-red-400 text-xs mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <div className="flex flex-wrap gap-4">
              <UploadImage
                label="گالری تصاویر"
                inputName="gallery"
                setUploadedImage={(uploaded: string) => {
                  setGalleryImages((prev) => [...prev, uploaded]);
                  setValue("gallery", [...galleryImages, uploaded], {
                    shouldValidate: true,
                  });
                }}
                type="image"
                token={token}
              />
              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="w-full text-sm text-gray-400">
                    {galleryImages.length} تصویر آپلود شده
                  </p>
                </div>
              )}
            </div>
            {errors.gallery && (
              <p className="text-red-400 text-xs mt-1">
                {errors.gallery.message}
              </p>
            )}
          </div>
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
          موقعیت اداری
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Province Selection */}
          <AsyncSelectBox
            name="province"
            label="انتخاب استان *"
            setValue={setValue}
            loadOptions={loadProvincesOptions}
            defaultOptions
            placeholder="استان را انتخاب کنید"
            errMsg={errors.province?.message}
            onSelectChange={handleProvinceSelect}
          />

          {/* City Selection */}
          <AsyncSelectBox
            key={watch("province") || "no-province"}
            name="city"
            label="انتخاب شهر *"
            setValue={setValue}
            defaultOptions
            loadOptions={loadCitiesOptions}
            placeholder=" شهر را انتخاب کنید"
            errMsg={errors.city?.message}
            onSelectChange={handleCitySelect}
          />

          {/* City Zone Selection */}
          <AsyncSelectBox
            key={watch("city") || "no-city"}
            name="city_zone"
            label="انتخاب منطقه"
            setValue={setValue}
            defaultOptions
            loadOptions={loadCityZonesOptions}
            placeholder="منطقه را انتخاب کنید"
            errMsg={errors.city_zone?.message}
            onSelectChange={handleCityZoneSelect}
          />
        </div>
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

        {/* Map Section */}
        <div className="bg-gray-800/50 p-6 border border-gray-700 rounded-lg mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              ترسیم محدوده و انتخاب مرکز بر روی نقشه
            </h2>
            <div className="flex gap-2">
              {drawnPolygon && (
                <button
                  type="button"
                  onClick={clearDrawnPolygon}
                  className="bg-red-900/30 text-red-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-900/50 transition-colors border border-red-800"
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
                  <span>حذف منطقه</span>
                </button>
              )}
              {centerPoint && (
                <button
                  type="button"
                  onClick={clearCenterPoint}
                  className="bg-red-900/30 text-red-400 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-900/50 transition-colors border border-red-800"
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
                  <span>حذف مرکز</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={toggleDrawingMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isDrawingMode
                  ? "bg-pink-600 text-white"
                  : "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
              }`}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {isDrawingMode ? "در حال ترسیم..." : "ترسیم محدوده"}
            </button>

            <button
              type="button"
              onClick={toggleCenterMode}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                isCenterMode
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-white border border-gray-600 hover:bg-gray-600"
              }`}
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {isCenterMode ? "در حال انتخاب..." : "انتخاب مرکز"}
            </button>
          </div>

          <div className="h-[400px] rounded-lg overflow-hidden border border-gray-600">
            <MapContainer
              key={mapKey}
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler
                isActive={isCenterMode}
                onMapClick={handleMapClick}
              />
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
              {centerPoint && (
                <Marker position={[centerPoint.lat, centerPoint.lng]} />
              )}
              <SimpleDrawing
                isActive={isDrawingMode}
                onPolygonCreated={handlePolygonCreated}
                onPolygonDeleted={handlePolygonDeleted}
              />
            </MapContainer>
          </div>

          {errors.area && (
            <p className="text-red-500 text-sm mt-2 text-right">
              {errors.area.message}
            </p>
          )}

          {errors.center && (
            <p className="text-red-500 text-sm mt-2 text-right">
              {errors.center.message}
            </p>
          )}

          <div className="mt-4 space-y-3">
            {drawnPolygon && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-green-800 font-semibold">
                    منطقه مکان ترسیم شد
                  </p>
                </div>
              </div>
            )}

            {centerPoint && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-purple-800 font-semibold">
                    نقطه مرکز انتخاب شد
                  </p>
                </div>
                <div className="text-xs text-purple-700">
                  <p>• طول جغرافیایی: {centerPoint.lng.toFixed(6)}</p>
                  <p>• عرض جغرافیایی: {centerPoint.lat.toFixed(6)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700 shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <div className="w-2 h-6 bg-pink-500 rounded-full ml-2"></div>
          دسته‌بندی و برچسب‌ها
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Category Selection */}
          <AsyncSelectBox
            name="category"
            label="دسته‌بندی *"
            setValue={setValue}
            loadOptions={loadCategoriesOptions}
            defaultOptions
            placeholder="دسته‌بندی را انتخاب کنید"
            errMsg={errors.category?.message}
          />

          {/* Tags Selection */}
          <AsyncSelectBox
            name="tags"
            label="برچسب‌ها"
            setValue={setValue}
            loadOptions={loadTagsOptions}
            defaultOptions
            placeholder="برچسب‌ها را انتخاب کنید"
            errMsg={errors.tags?.message}
            isMulti={true}
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
          وضعیت
        </h2>

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
          ذخیره مکان
        </button>
      </div>
    </form>
  );
};

export default FormCreatePlace;
