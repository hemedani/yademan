"use client";

import L from "leaflet";
import { useMapEvents } from "react-leaflet";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { add } from "@/app/actions/city/add";
import { gets as getProvincesAction } from "@/app/actions/province/gets";
import { get as getProvinceAction } from "@/app/actions/province/get";
import { SelectOption } from "../atoms/MyAsyncMultiSelect";
import SelectBox from "../atoms/Select";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamically import map components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import("react-leaflet").then((mod) => mod.Polygon), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const SimpleDrawing = dynamic(() => import("@/components/SimpleDrawing"), {
  ssr: false,
});
const AsyncSelect = dynamic(() => import("react-select/async"), { ssr: false });

// MapClickHandler component for handling map clicks
const MapClickHandler = ({ onClick }: { onClick: (latlng: L.LatLng) => void }) => {
  const map = useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

export const CityCreateSchema = z.object({
  name: z.string().min(1, "نام شهر الزامی است"),
  english_name: z.string().min(1, "نام انگلیسی شهر الزامی است"),
  provinceId: z.string().min(1, "انتخاب استان الزامی است"),
  isCapital: z.boolean(),
  area: z.object(
    {
      type: z.literal("MultiPolygon"),
      coordinates: z.array(z.array(z.array(z.array(z.number())))).refine((coords) => {
        if (coords.length === 0) return false;
        return coords.every((polygon) => polygon.every((ring) => ring.length >= 4));
      }, "باید حداقل یک منطقه با حداقل 3 نقطه ترسیم شود"),
    },
    { required_error: "ترسیم منطقه بر روی نقشه الزامی است" },
  ),
  center: z.object(
    {
      type: z.literal("Point"),
      coordinates: z.array(z.number()).length(2, "مختصات مرکز شهر باید شامل طول و عرض جغرافیایی باشد"),
    },
    { required_error: "انتخاب مرکز شهر بر روی نقشه الزامی است" },
  ),
});

export type CityFormCreateSchemaType = z.infer<typeof CityCreateSchema>;

interface LatLng {
  lat: number;
  lng: number;
}

export const FormCreateCity = ({ token, lesanUrl }: { token?: string; lesanUrl: string }) => {
  const router = useRouter();
  const [drawnPolygon, setDrawnPolygon] = useState<LatLng[] | null>(null);
  const [centerPoint, setCenterPoint] = useState<LatLng | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isCenterMode, setIsCenterMode] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([32.4279, 53.688]);
  const [mapZoom, setMapZoom] = useState(6);
  const [selectedProvince, setSelectedProvince] = useState<SelectOption | null>(null);
  const [mapKey, setMapKey] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CityFormCreateSchemaType>({
    resolver: zodResolver(CityCreateSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      english_name: "",
      provinceId: "",
      isCapital: false,
      area: { type: "MultiPolygon", coordinates: [] },
      center: { type: "Point", coordinates: [] },
    },
  });

  // Load provinces options
  const loadProvincesOptions = async (inputValue?: string): Promise<SelectOption[]> => {
    const setParams: { limit: number; page: number; name?: string } = {
      limit: 20,
      page: 1,
    };
    if (inputValue) {
      setParams.name = inputValue;
    }
    try {
      const response = await getProvincesAction({
        set: setParams,
        get: { _id: 1, name: 1 },
      });
      if (response && response.success) {
        return response.body.map((item: { _id: string; name: string }) => ({
          value: item._id,
          label: item.name,
        }));
      }
    } catch (error) {
      console.error("Error loading provinces:", error);
    }
    return [];
  };

  // Handle province selection
  const handleProvinceSelect = useCallback(
    async (selectedOption: SelectOption | null) => {
      setSelectedProvince(selectedOption);
      if (selectedOption) {
        setValue("provinceId", selectedOption.value, { shouldValidate: true });

        try {
          const provinceDetails = await getProvinceAction(selectedOption.value, {
            _id: 1,
            name: 1,
            // The province's own center is what we need to position the map.
            center: 1,
            capital: {
              _id: 1,
              name: 1,
              english_name: 1,
              area: 1,
              center: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          });

          if (provinceDetails && provinceDetails.success && provinceDetails.body.center) {
            const coordinates = provinceDetails.body.center.coordinates;
            if (coordinates && coordinates.length >= 2) {
              setMapCenter([coordinates[1], coordinates[0]]);
              setMapZoom(8);
              setMapKey((prev) => prev + 1);
            }
          }
        } catch (error) {
          console.error("Error getting province details:", error);
        }
      } else {
        setValue("provinceId", "", { shouldValidate: true });
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
        setValue("area", { type: "MultiPolygon", coordinates: [] }, { shouldValidate: true });
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
      const coordinates = simplifiedPolygon.map((point) => [point.lng, point.lat]);
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
    setValue("area", { type: "MultiPolygon", coordinates: [] }, { shouldValidate: true });
    trigger();
  }, [setValue, trigger]);

  // Handle map click for center point
  const handleMapClick = useCallback(
    (latlng: L.LatLng) => {
      if (isCenterMode) {
        const { lat, lng } = latlng;
        setCenterPoint({ lat, lng });
        setValue("center", { type: "Point", coordinates: [lng, lat] }, { shouldValidate: true });
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
      setValue("area", { type: "MultiPolygon", coordinates: [] }, { shouldValidate: true });
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
    setValue("area", { type: "MultiPolygon", coordinates: [] }, { shouldValidate: true });
    trigger();
  };

  // Clear center point
  const clearCenterPoint = () => {
    setCenterPoint(null);
    setValue("center", { type: "Point", coordinates: [] }, { shouldValidate: true });
    trigger();
  };

  // Form submission
  const onSubmit: SubmitHandler<CityFormCreateSchemaType> = async (data) => {
    const createdCity = await add({
      name: data.name,
      english_name: data.english_name,
      area: data.area as {
        type: "MultiPolygon";
        coordinates: number[][][][];
      },
      center: data.center as {
        type: "Point";
        coordinates: number[];
      },
      provinceId: data.provinceId,
      isCapital: data.isCapital,
    });

    if (createdCity.success) {
      ToastNotify("success", "شهر با موفقیت ایجاد شد");
      router.replace("/admin/city");
    } else {
      ToastNotify("error", createdCity.body.message || "خطا در ایجاد شهر");
    }
  };

  // Setup Leaflet
  useEffect(() => {
    if (typeof window === "undefined") return;

    const leafletCSS = document.createElement("link");
    leafletCSS.rel = "stylesheet";
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(leafletCSS);

    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    });

    return () => {
      if (document.head.contains(leafletCSS)) {
        document.head.removeChild(leafletCSS);
      }
    };
  }, []);

  return (
    <div className="p-8 bg-gray-900 text-white">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Fields */}
        <div className="bg-gray-800 p-6 border border-gray-700 rounded-xl space-y-4 shadow-lg">
          <h2 className="text-lg font-semibold text-white mb-4">اطلاعات شهر</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Input */}
            <MyInput label="نام شهر" register={register} name="name" errMsg={errors.name?.message} />

            {/* English Name Input */}
            <MyInput
              label="نام انگلیسی شهر"
              register={register}
              name="english_name"
              errMsg={errors.english_name?.message}
            />
          </div>

          {/* Province Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300 text-right">انتخاب استان</label>
            <AsyncSelect
              cacheOptions
              defaultOptions
              value={selectedProvince}
              loadOptions={loadProvincesOptions}
              onChange={(newValue) => handleProvinceSelect(newValue as SelectOption | null)}
              placeholder="استان را انتخاب کنید"
              noOptionsMessage={() => "استانی یافت نشد"}
              loadingMessage={() => "در حال بارگذاری..."}
              isRtl={true}
              isClearable
              styles={{
                control: (provided: any, state: any) => ({
                  ...provided,
                  minHeight: "48px",
                  backgroundColor: state.isFocused ? "#1f2937" : "#111827",
                  borderColor: state.isFocused ? "#8b5cf6" : "#374151",
                  borderWidth: state.isFocused ? "2px" : "1px",
                  borderRadius: "12px",
                  direction: "rtl",
                  color: "#f3f4f6",
                  boxShadow: state.isFocused ? "0 0 0 1px #8b5cf6" : "none",
                }),
                valueContainer: (provided: any) => ({
                  ...provided,
                  padding: "2px 16px",
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
            {errors.provinceId && (
              <span className="text-red-400 text-xs font-medium text-right mt-1">
                {errors.provinceId.message}
              </span>
            )}
          </div>

          {/* Is Center Checkbox */}
          <SelectBox
            label="مرکز استان"
            name="isCapital"
            setValue={(name: string, value: string) => setValue("isCapital", value === "true")}
            options={[
              { value: "true", label: "بله، این شهر مرکز استان است" },
              { value: "false", label: "خیر، این شهر مرکز استان نیست" },
            ]}
          />
        </div>

        {/* Map Section */}
        <div className="bg-gray-800 p-6 border border-gray-700 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">ترسیم شهر و انتخاب مرکز بر روی نقشه</h2>
            <div className="flex gap-2">
              {drawnPolygon && (
                <button
                  type="button"
                  onClick={clearDrawnPolygon}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {centerPoint && (
                <button
                  type="button"
                  onClick={clearCenterPoint}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  isCenterMode ? "bg-pink-600 hover:bg-pink-700" : "bg-purple-600 hover:bg-purple-700"
                } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg ${isCenterMode ? "shadow-pink-500/30" : "shadow-purple-500/30"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <button
                type="button"
                onClick={toggleDrawingMode}
                className={`${
                  isDrawingMode ? "bg-pink-600 hover:bg-pink-700" : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg ${isDrawingMode ? "shadow-pink-500/30" : "shadow-blue-500/30"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.382v10.764a1 1 0 01-.553.894L15 18l-6-3z"
                  />
                </svg>
                {isDrawingMode ? "لغو ترسیم" : "ترسیم منطقه"}
              </button>
            </div>
          </div>

          {(isDrawingMode || isCenterMode) && (
            <div className="mb-4 p-3 bg-gray-700/50 border border-gray-600 rounded-lg">
              {isDrawingMode && (
                <p className="text-sm text-pink-400 font-medium">
                  🖱️ حالت ترسیم منطقه: کلیک چپ: اضافه کردن نقطه | راست کلیک: تمام کردن شکل | ESC: لغو
                </p>
              )}
              {isCenterMode && (
                <p className="text-sm text-pink-400 font-medium">
                  📍 حالت انتخاب مرکز: بر روی نقشه کلیک کنید تا مرکز شهر مشخص شود
                </p>
              )}
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
              {centerPoint && <Marker position={[centerPoint.lat, centerPoint.lng]} />}
              <SimpleDrawing isActive={isDrawingMode} onPolygonCreated={handlePolygonCreated} />
              {isCenterMode && <MapClickHandler onClick={handleMapClick} />}
            </MapContainer>
          </div>

          {errors.area && (
            <p className="text-red-400 text-sm mt-2 text-right">{errors.area.message}</p>
          )}

          {errors.center && (
            <p className="text-red-400 text-sm mt-2 text-right">{errors.center.message}</p>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p className="text-sm text-green-400 font-semibold">منطقه شهر ترسیم شد</p>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>• تعداد نقاط: {drawnPolygon.length}</p>
                  <p>• منطقه بر روی نقشه نمایش داده شده و آماده ثبت است</p>
                </div>
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
                  </svg>
                  <p className="text-sm text-purple-400 font-semibold">مرکز شهر انتخاب شد</p>
                </div>
                <div className="text-xs text-gray-300 space-y-1">
                  <p>• عرض جغرافیایی: {centerPoint.lat.toFixed(6)}</p>
                  <p>• طول جغرافیایی: {centerPoint.lng.toFixed(6)}</p>
                  <p>• مرکز بر روی نقشه نمایش داده شده است</p>
                </div>
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
            {isSubmitting ? "در حال ایجاد..." : "ایجاد شهر"}
          </button>
        </div>
      </form>
    </div>
  );
};
