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
import { gets as getTagsAction } from "@/app/actions/tag/gets";
import dynamic from "next/dynamic";
import L from "leaflet";
import { useEffect, useState, useCallback } from "react";
import React from "react";
import SelectBox from "../atoms/Select";
import AsyncSelect from "react-select/async";
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

  // Relationship state
  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>(
    null,
  );
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
  const [selectedCityZone, setSelectedCityZone] = useState<SelectOption | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<SelectOption | null>(
    null,
  );
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);

  // Categories, tags lists
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    [],
  );

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
  const loadProvincesOptions = async (
    inputValue?: string,
  ): Promise<SelectOption[]> => {
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
  };

  // Load cities options based on selected province
  const loadCitiesOptions = async (
    inputValue?: string,
  ): Promise<SelectOption[]> => {
    console.log("loadCitiesOptions called with province:", selectedProvince);
    if (!selectedProvince?.value) {
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
      provinceId: selectedProvince.value,
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
  };

  // Load city zones options based on selected city
  const loadCityZonesOptions = async (
    inputValue?: string,
  ): Promise<SelectOption[]> => {
    console.log("loadCityZonesOptions called with city:", selectedCity);
    if (!selectedCity?.value) {
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
      cityId: selectedCity.value,
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
  };

  // Load categories options
  const loadCategoriesOptions = async (
    inputValue?: string,
  ): Promise<SelectOption[]> => {
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
  };

  // Load tags options
  const loadTagsOptions = async (
    inputValue?: string,
  ): Promise<SelectOption[]> => {
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
  };

  // Handle province selection
  const handleProvinceSelect = async (option: SelectOption | null) => {
    console.log("Province selected:", option);
    setSelectedProvince(option);
    setValue("province", option?.value || "", { shouldValidate: true });
    setValue("city", "", { shouldValidate: true });
    setValue("city_zone", "", { shouldValidate: true });
    setSelectedCity(null);
    setSelectedCityZone(null);

    // If a province is selected, fetch the associated cities
    if (option) {
      await loadCitiesOptions();
    }

    // If a province is selected, try to center the map on it
    if (option) {
      console.log("Setting province with value:", option.value);
      // In a real app, you would get the province's center point from the database
      // For now, we'll just use a hardcoded value for Tehran province
      setMapCenter([35.6892, 51.389]);
      setMapZoom(8);

      // Don't recreate the map immediately, use setTimeout to allow React to finish its current update cycle
      setTimeout(() => {
        setMapKey((prev) => prev + 1);
      }, 100); // Increased timeout to ensure React has time to update
    }
  };

  // Handle city selection
  const handleCitySelect = async (option: SelectOption | null) => {
    setSelectedCity(option);
    setValue("city", option?.value || "", { shouldValidate: true });
    setValue("city_zone", "", { shouldValidate: true });
    setSelectedCityZone(null);

    // If a city is selected, load city zones and try to center the map on it
    if (option) {
      // Load city zones for the newly selected city
      await loadCityZonesOptions();

      // In a real app, you would get the city's center point from the database
      // For now, we'll just zoom in a bit
      setMapZoom(10);
      setMapKey((prev) => prev + 1);
    }
  };

  // Handle city zone selection
  const handleCityZoneSelect = (option: SelectOption | null) => {
    setSelectedCityZone(option);
    setValue("city_zone", option?.value || "", { shouldValidate: true });

    // If a city zone is selected, try to center the map on it
    if (option) {
      // In a real app, you would get the city zone's center point from the database
      // For now, we'll just zoom in a bit more
      setMapZoom(12);
      setMapKey((prev) => prev + 1);
    }
  };

  // Handle category selection
  const handleCategorySelect = (option: SelectOption | null) => {
    setSelectedCategory(option);
    setValue("category", option?.value || "", { shouldValidate: true });
  };

  // Handle tags selection
  const handleTagsSelect = (options: readonly SelectOption[]) => {
    setSelectedTags(options as SelectOption[]);
    setValue(
      "tags",
      options.map((opt) => opt.value),
      { shouldValidate: true },
    );
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategoriesAction({
          set: { page: 1, limit: 50 },
          get: { _id: 1, name: 1 },
        });
        if (result.success) {
          setCategories(result.body);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        ToastNotify("error", "خطا در دریافت دسته‌بندی‌ها");
      }
    };

    fetchCategories();
  }, []);

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
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
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
            <span className="text-sm font-medium text-gray-700 block mb-2">
              تصویر شاخص
            </span>
            <UploadImage
              inputName="thumbnail"
              setUploadedImage={(uploaded: string) =>
                setValue("thumbnail", uploaded, { shouldValidate: true })
              }
              type="image"
              token={token}
            />
            {errors.thumbnail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <span className="text-sm font-medium text-gray-700 block mb-2">
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
                token={token}
              />
              {galleryImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <p className="w-full text-sm text-gray-500">
                    {galleryImages.length} تصویر آپلود شده
                  </p>
                </div>
              )}
            </div>
            {errors.gallery && (
              <p className="text-red-500 text-xs mt-1">
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

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
          موقعیت اداری
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Province Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 text-right">
              انتخاب استان *
            </label>
            <AsyncSelect
              cacheOptions={false}
              defaultOptions
              value={selectedProvince}
              loadOptions={loadProvincesOptions}
              onChange={(newValue) =>
                handleProvinceSelect(newValue as SelectOption | null)
              }
              placeholder="استان را انتخاب کنید"
              noOptionsMessage={() => "استانی یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              isRtl={true}
              isClearable
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  minHeight: "48px",
                  backgroundColor: errors.province ? "#fef2f2" : "white",
                  borderColor: errors.province
                    ? state.isFocused
                      ? "#ef4444"
                      : "#fca5a5"
                    : state.isFocused
                      ? "#3b82f6"
                      : "#cbd5e1",
                  borderRadius: "12px",
                  direction: "rtl",
                }),
                valueContainer: (provided: any) => ({
                  ...provided,
                  padding: "2px 16px",
                  direction: "rtl",
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#94a3b8",
                  direction: "rtl",
                  textAlign: "right",
                }),
                singleValue: (provided: any) => ({
                  ...provided,
                  color: "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
                option: (provided: any, state: any) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#f1f5f9"
                      : "transparent",
                  color: state.isSelected ? "white" : "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
              }}
            />
            {errors.province && (
              <span className="text-red-500 text-xs font-medium text-right mt-1">
                {errors.province.message}
              </span>
            )}
          </div>

          {/* City Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 text-right">
              انتخاب شهر *
            </label>
            <AsyncSelect
              cacheOptions={false}
              defaultOptions={selectedProvince !== null}
              value={selectedCity}
              loadOptions={loadCitiesOptions}
              onChange={(newValue) =>
                handleCitySelect(newValue as SelectOption | null)
              }
              placeholder="شهر را انتخاب کنید"
              key={selectedProvince?.value || "no-province"}
              noOptionsMessage={() =>
                selectedProvince
                  ? "شهری یافت نشد"
                  : "ابتدا استان را انتخاب کنید"
              }
              loadingMessage={() => "در حال بارگذاری..."}
              isRtl={true}
              isClearable
              isDisabled={!selectedProvince}
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  minHeight: "48px",
                  backgroundColor: errors.city ? "#fef2f2" : "white",
                  borderColor: errors.city
                    ? state.isFocused
                      ? "#ef4444"
                      : "#fca5a5"
                    : state.isFocused
                      ? "#3b82f6"
                      : "#cbd5e1",
                  borderRadius: "12px",
                  direction: "rtl",
                }),
                valueContainer: (provided: any) => ({
                  ...provided,
                  padding: "2px 16px",
                  direction: "rtl",
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#94a3b8",
                  direction: "rtl",
                  textAlign: "right",
                }),
                singleValue: (provided: any) => ({
                  ...provided,
                  color: "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
                option: (provided: any, state: any) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#f1f5f9"
                      : "transparent",
                  color: state.isSelected ? "white" : "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
              }}
            />
            {errors.city && (
              <span className="text-red-500 text-xs font-medium text-right mt-1">
                {errors.city.message}
              </span>
            )}
          </div>

          {/* City Zone Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 text-right">
              انتخاب منطقه
            </label>
            <AsyncSelect
              cacheOptions={false}
              defaultOptions={selectedCity !== null}
              value={selectedCityZone}
              loadOptions={loadCityZonesOptions}
              onChange={(newValue) =>
                handleCityZoneSelect(newValue as SelectOption | null)
              }
              placeholder="منطقه را انتخاب کنید"
              key={selectedCity?.value || "no-city"}
              noOptionsMessage={() =>
                selectedCity ? "منطقه‌ای یافت نشد" : "ابتدا شهر را انتخاب کنید"
              }
              loadingMessage={() => "در حال بارگذاری..."}
              isRtl={true}
              isClearable
              isDisabled={!selectedCity}
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  minHeight: "48px",
                  backgroundColor: errors.city_zone ? "#fef2f2" : "white",
                  borderColor: errors.city_zone
                    ? state.isFocused
                      ? "#ef4444"
                      : "#fca5a5"
                    : state.isFocused
                      ? "#3b82f6"
                      : "#cbd5e1",
                  borderRadius: "12px",
                  direction: "rtl",
                }),
                valueContainer: (provided: any) => ({
                  ...provided,
                  padding: "2px 16px",
                  direction: "rtl",
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#94a3b8",
                  direction: "rtl",
                  textAlign: "right",
                }),
                singleValue: (provided: any) => ({
                  ...provided,
                  color: "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
                option: (provided: any, state: any) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#f1f5f9"
                      : "transparent",
                  color: state.isSelected ? "white" : "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
              }}
            />
            {errors.city_zone && (
              <span className="text-red-500 text-xs font-medium text-right mt-1">
                {errors.city_zone.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
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
        <div className="bg-gray-100 p-6 border rounded-lg mt-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              ترسیم محدوده و انتخاب مرکز بر روی نقشه
            </h2>
            <div className="flex gap-2">
              {drawnPolygon && (
                <button
                  type="button"
                  onClick={clearDrawnPolygon}
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-100 transition-colors"
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
                  className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-red-100 transition-colors"
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
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isDrawingMode
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 border"
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
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${isCenterMode
                ? "bg-purple-500 text-white"
                : "bg-white text-gray-700 border"
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

          <div className="h-[400px] rounded-lg overflow-hidden border">
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
                    color: "#3b82f6",
                    weight: 3,
                    opacity: 0.8,
                    fillOpacity: 0.2,
                    fillColor: "#3b82f6",
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

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
          دسته‌بندی و برچسب‌ها
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Category Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 text-right">
              دسته‌بندی *
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              value={selectedCategory}
              loadOptions={loadCategoriesOptions}
              onChange={(newValue) =>
                handleCategorySelect(newValue as SelectOption | null)
              }
              placeholder="دسته‌بندی را انتخاب کنید"
              noOptionsMessage={() => "دسته‌بندی یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              isRtl={true}
              isClearable
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  minHeight: "48px",
                  backgroundColor: errors.category ? "#fef2f2" : "white",
                  borderColor: errors.category
                    ? state.isFocused
                      ? "#ef4444"
                      : "#fca5a5"
                    : state.isFocused
                      ? "#3b82f6"
                      : "#cbd5e1",
                  borderRadius: "12px",
                  direction: "rtl",
                }),
                valueContainer: (provided: any) => ({
                  ...provided,
                  padding: "2px 16px",
                  direction: "rtl",
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#94a3b8",
                  direction: "rtl",
                  textAlign: "right",
                }),
                singleValue: (provided: any) => ({
                  ...provided,
                  color: "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
                option: (provided: any, state: any) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#f1f5f9"
                      : "transparent",
                  color: state.isSelected ? "white" : "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
              }}
            />
            {errors.category && (
              <span className="text-red-500 text-xs font-medium text-right mt-1">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Tags Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 text-right">
              برچسب‌ها
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              isMulti
              value={selectedTags}
              loadOptions={loadTagsOptions}
              onChange={(newValue) =>
                handleTagsSelect(newValue as readonly SelectOption[])
              }
              placeholder="برچسب‌ها را انتخاب کنید"
              noOptionsMessage={() => "برچسبی یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              isRtl={true}
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  minHeight: "48px",
                  backgroundColor: errors.tags ? "#fef2f2" : "white",
                  borderColor: errors.tags
                    ? state.isFocused
                      ? "#ef4444"
                      : "#fca5a5"
                    : state.isFocused
                      ? "#3b82f6"
                      : "#cbd5e1",
                  borderRadius: "12px",
                  direction: "rtl",
                }),
                valueContainer: (provided: any) => ({
                  ...provided,
                  padding: "2px 16px",
                  direction: "rtl",
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#94a3b8",
                  direction: "rtl",
                  textAlign: "right",
                }),
                multiValue: (provided: any) => ({
                  ...provided,
                  direction: "rtl",
                }),
                option: (provided: any, state: any) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#3b82f6"
                    : state.isFocused
                      ? "#f1f5f9"
                      : "transparent",
                  color: state.isSelected ? "white" : "#1e293b",
                  direction: "rtl",
                  textAlign: "right",
                }),
              }}
            />
            {errors.tags && (
              <span className="text-red-500 text-xs font-medium text-right mt-1">
                {errors.tags.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
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

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-2 h-6 bg-blue-500 rounded-full ml-2"></div>
          وضعیت
        </h2>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2 text-right"
          >
            وضعیت *
          </label>
          <select
            id="status"
            {...register("status")}
            className={`
              w-full px-4 py-3 text-gray-800 bg-white border rounded-xl
              text-right transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-blue-500
              hover:border-gray-400
              ${errors.status
                ? "border-red-300 bg-red-50/30 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 hover:bg-gray-50/50"
              }
            `}
          >
            <option value="draft">پیش‌نویس</option>
            <option value="active">منتشر شده</option>
            <option value="archived">آرشیو شده</option>
          </select>
          {errors.status && (
            <span className="text-red-500 text-xs font-medium text-right mt-1 flex items-center gap-1">
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
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          انصراف
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 flex items-center gap-2"
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
