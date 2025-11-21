"use client";
import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { add } from "@/app/actions/city_zone/add";
import { gets as getCitiesAction } from "@/app/actions/city/gets";
import { get as getCityAction } from "@/app/actions/city/get";
import { SelectOption } from "../atoms/MyAsyncMultiSelect";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

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
const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

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

export const CityZoneCreateSchema = z.object({
  name: z.string().min(1, "نام منطقه الزامی است"),
  cityId: z.string().min(1, "انتخاب شهر الزامی است"),
  area: z.object(
    {
      type: z.literal("MultiPolygon"),
      coordinates: z
        .array(z.array(z.array(z.array(z.number()))))
        .refine((coords) => {
          if (coords.length === 0) return false;
          return coords.every((polygon) =>
            polygon.every((ring) => ring.length >= 4),
          );
        }, "باید حداقل یک منطقه با حداقل 3 نقطه ترسیم شود"),
    },
    { required_error: "ترسیم منطقه بر روی نقشه الزامی است" },
  ),
  center: z.object(
    {
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "مختصات مرکز منطقه باید شامل طول و عرض جغرافیایی باشد"),
    },
    { required_error: "انتخاب مرکز منطقه بر روی نقشه الزامی است" },
  ),
});

export type CityZoneFormCreateSchemaType = z.infer<typeof CityZoneCreateSchema>;

interface LatLng {
  lat: number;
  lng: number;
}

export const FormCreateCityZone = ({
  token,
  lesanUrl,
}: {
  token?: string;
  lesanUrl: string;
}) => {
  const router = useRouter();
  const [drawnPolygon, setDrawnPolygon] = useState<LatLng[] | null>(null);
  const [centerPoint, setCenterPoint] = useState<LatLng | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isCenterMode, setIsCenterMode] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    32.4279, 53.688,
  ]);
  const [mapZoom, setMapZoom] = useState(6);
  const [mapKey, setMapKey] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CityZoneFormCreateSchemaType>({
    resolver: zodResolver(CityZoneCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      cityId: "",
      area: { type: "MultiPolygon", coordinates: [] },
      center: { type: "Point", coordinates: [] },
    },
  });

  // Load cities options
  const loadCitiesOptions = async (
    inputValue?: string,
  ): Promise<SelectOption[]> => {
    const setParams: any = { page: 1, limit: 50 };
    if (inputValue && inputValue.trim() !== "") {
      setParams.name = { $regex: inputValue.trim(), $options: "i" };
    }

    try {
      const response = await getCitiesAction({
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
      console.error("Error loading cities:", error);
      return [];
    }
  };

  // Handle city selection
  const handleCitySelect = useCallback(
    async (selectedOption: SelectOption | null) => {
      if (selectedOption) {
        setValue("cityId", selectedOption.value, { shouldValidate: true });

        try {
          const cityDetails = await getCityAction(selectedOption.value, {
            _id: 1,
            name: 1,
            center: 1,
          });

          if (cityDetails && cityDetails.success && cityDetails.body.center) {
            const coordinates = cityDetails.body.center.coordinates;
            if (coordinates && coordinates.length >= 2) {
              setMapCenter([coordinates[1], coordinates[0]]);
              setMapZoom(12);
              setMapKey((prev) => prev + 1);
            }
          }
        } catch (error) {
          console.error("Error fetching city details:", error);
        }
      } else {
        setValue("cityId", "", { shouldValidate: true });
        setMapCenter([32.4279, 53.688]);
        setMapZoom(6);
        setMapKey((prev) => prev + 1);
      }
    },
    [setValue],
  );

  // Handle polygon creation
  const handlePolygonCreated = useCallback(
    (polygons: L.LatLng[][]) => {
      if (polygons.length === 0) {
        setDrawnPolygon(null);
        setValue(
          "area",
          { type: "MultiPolygon", coordinates: [] },
          { shouldValidate: true },
        );
        setIsDrawingMode(false);
        trigger();
        return;
      }

      const polygon = polygons[0];
      const simplifiedPolygon = polygon.map((point) => ({
        lat: point.lat,
        lng: point.lng,
      }));
      setDrawnPolygon(simplifiedPolygon);
      const coordinates = simplifiedPolygon.map((point) => [
        point.lng,
        point.lat,
      ]);
      coordinates.push(coordinates[0]);

      const multiPolygon = {
        type: "MultiPolygon" as const,
        coordinates: [[coordinates]],
      };

      setValue("area", multiPolygon, { shouldValidate: true });
      setIsDrawingMode(false);
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
    (latlng: L.LatLng) => {
      if (isCenterMode) {
        const { lat, lng } = latlng;
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
      setDrawnPolygon(null);
      setValue(
        "area",
        { type: "MultiPolygon", coordinates: [] },
        { shouldValidate: true },
      );
      trigger();
    } else {
      setIsDrawingMode(true);
      setIsCenterMode(false);
    }
  };

  // Toggle center mode
  const toggleCenterMode = () => {
    if (isCenterMode) {
      setIsCenterMode(false);
    } else {
      setIsCenterMode(true);
      setIsDrawingMode(false);
    }
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
    setCenterPoint(null);
    setValue(
      "center",
      { type: "Point", coordinates: [] },
      { shouldValidate: true },
    );
    trigger();
  };

  // Form submission
  const onSubmit: SubmitHandler<CityZoneFormCreateSchemaType> = async (
    data,
  ) => {
    const createdCityZone = await add({
      name: data.name,
      center: data.center as {
        type: "Point";
        coordinates: number[];
      },
      area: data.area as {
        type: "MultiPolygon";
        coordinates: number[][][][];
      },
      cityId: data.cityId,
    });

    if (createdCityZone.success) {
      ToastNotify("success", "منطقه شهری با موفقیت ایجاد شد");
      router.replace("/admin/city-zone");
    } else {
      ToastNotify(
        "error",
        createdCityZone.body.message || "خطا در ایجاد منطقه شهری",
      );
    }
  };

  // Setup leaflet CSS
  useEffect(() => {
    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    leafletCSS.integrity =
      "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    leafletCSS.crossOrigin = "";

    if (!document.head.contains(leafletCSS)) {
      document.head.appendChild(leafletCSS);
    }

    return () => {
      if (document.head.contains(leafletCSS)) {
        document.head.removeChild(leafletCSS);
      }
    };
  }, []);

  return (
    <div className="p-8 bg-gray-900 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gray-800 p-6 border border-gray-700 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4">
            اطلاعات پایه منطقه شهری
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name Input */}
            <MyInput
              label="نام منطقه"
              register={register}
              name="name"
              errMsg={errors.name?.message}
            />
          </div>

          {/* City Selection */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              شهر *
            </label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              loadOptions={loadCitiesOptions}
              onChange={(newValue) =>
                handleCitySelect(newValue as SelectOption | null)
              }
              placeholder="شهر را انتخاب کنید"
              noOptionsMessage={() => "شهری یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              isClearable
              styles={{
                control: (provided: any) => ({
                  ...provided,
                  minHeight: "44px",
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "0.5rem",
                  fontSize: "14px",
                  direction: "rtl",
                  color: "#f3f4f6",
                }),
                placeholder: (provided: any) => ({
                  ...provided,
                  color: "#9ca3af",
                  direction: "rtl",
                  textAlign: "right",
                }),
                singleValue: (provided: any) => ({
                  ...provided,
                  color: "#f3f4f6",
                  direction: "rtl",
                  textAlign: "right",
                }),
                option: (provided: any, state: any) => ({
                  ...provided,
                  backgroundColor: state.isSelected
                    ? "#4f46e5"
                    : state.isFocused
                      ? "#374151"
                      : "#1f2937",
                  color: state.isSelected ? "white" : "#f3f4f6",
                  direction: "rtl",
                  textAlign: "right",
                }),
                menu: (provided: any) => ({
                  ...provided,
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }),
              }}
            />
            {errors.cityId && (
              <span className="text-red-400 text-xs font-medium text-right mt-1">
                {errors.cityId.message}
              </span>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-gray-800 p-6 border border-gray-700 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              ترسیم منطقه و انتخاب مرکز بر روی نقشه
            </h2>
            <div className="flex gap-2">
              {centerPoint && (
                <button
                  type="button"
                  onClick={clearCenterPoint}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                  حذف مرکز
                </button>
              )}
              <button
                type="button"
                onClick={toggleCenterMode}
                className={`${
                  isCenterMode
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg ${isCenterMode ? "shadow-pink-500/30" : "shadow-purple-500/30"}`}
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
                {isCenterMode ? "لغو انتخاب مرکز" : "انتخاب مرکز"}
              </button>
              {drawnPolygon && (
                <button
                  type="button"
                  onClick={clearDrawnPolygon}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
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
                  حذف منطقه
                </button>
              )}
              <button
                type="button"
                onClick={toggleDrawingMode}
                className={`${
                  isDrawingMode
                    ? "bg-pink-600 hover:bg-pink-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg ${isDrawingMode ? "shadow-pink-500/30" : "shadow-blue-500/30"}`}
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z"
                  />
                </svg>
                {isDrawingMode ? "لغو ترسیم" : "شروع ترسیم"}
              </button>
            </div>
          </div>

          {isDrawingMode && (
            <div className="mb-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
              <p className="text-sm text-pink-400 font-medium">
                🖱️ کلیک چپ: اضافه کردن نقطه | راست کلیک: تمام کردن شکل | ESC:
                لغو
              </p>
            </div>
          )}

          {isCenterMode && (
            <div className="mb-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
              <p className="text-sm text-pink-400 font-medium">
                📍 روی نقشه کلیک کنید تا مرکز منطقه را انتخاب کنید
              </p>
            </div>
          )}

          <div className="h-96 rounded-lg overflow-hidden border border-gray-600">
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
              {drawnPolygon && (
                <Polygon
                  positions={drawnPolygon}
                  pathOptions={{
                    color: "#ec4899",
                    weight: 3,
                    opacity: 0.8,
                    fillOpacity: 0.2,
                    fillColor: "#ec4899",
                  }}
                />
              )}
              {centerPoint && (
                <Marker position={[centerPoint.lat, centerPoint.lng]} />
              )}
              <SimpleDrawing
                isActive={isDrawingMode}
                onPolygonCreated={handlePolygonCreated}
              />
              {isCenterMode && <MapClickHandler onClick={handleMapClick} />}
            </MapContainer>
          </div>

          {errors.area && (
            <p className="text-red-400 text-sm mt-2 text-right">
              {errors.area.message}
            </p>
          )}

          {errors.center && (
            <p className="text-red-400 text-sm mt-2 text-right">
              {errors.center.message}
            </p>
          )}

          <div className="mt-4 space-y-3">
            {drawnPolygon && (
              <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-green-400 font-medium">
                    منطقه ترسیم شده
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  • تعداد نقاط: {drawnPolygon.length}
                </p>
                <p className="text-sm text-gray-300">
                  • منطقه بر روی نقشه نمایش داده شده و آماده ثبت است
                </p>
                <p className="text-sm text-gray-300">
                  • برای تغییر منطقه، دکمه &quot;حذف منطقه&quot; را فشار دهید
                </p>
              </div>
            )}

            {centerPoint && (
              <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg
                    className="w-5 h-5 text-purple-500"
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
                  <span className="text-purple-400 font-medium">
                    مرکز منطقه انتخاب شده
                  </span>
                </div>
                <p className="text-sm text-gray-300">
                  📍 موقعیت: {centerPoint.lat.toFixed(6)},{" "}
                  {centerPoint.lng.toFixed(6)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="px-8 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-pink-500/30"
          >
            {isSubmitting ? "در حال ایجاد..." : "ایجاد منطقه شهری"}
          </button>
        </div>
      </form>
    </div>
  );
};
