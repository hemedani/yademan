"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastNotify } from "@/utils/helper";
import MyInput from "../atoms/MyInput";
import { update } from "@/app/actions/province/update";
import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import MapClickHandler from "@/components/MapClickHandler";

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

export const ProvinceUpdateSchema = z.object({
  name: z.string().min(1, "نام استان الزامی است"),
  english_name: z.string().min(1, "نام انگلیسی استان الزامی است"),
  population: z.coerce.number().min(0, "جمعیت نمی‌تواند منفی باشد"),
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
  center_location: z.object(
    {
      type: z.literal("Point"),
      coordinates: z
        .array(z.number())
        .length(2, "مختصات مرکز استان باید شامل طول و عرض جغرافیایی باشد"),
    },
    { required_error: "انتخاب مرکز استان بر روی نقشه الزامی است" },
  ),
});

export type ProvinceFormUpdateSchemaType = z.infer<typeof ProvinceUpdateSchema>;

interface LatLng {
  lat: number;
  lng: number;
}

interface ProvinceData {
  _id: string;
  name: string;
  english_name: string;
  population: number;
  area: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
  center_location: {
    type: "Point";
    coordinates: number[];
  };
}

export const FormUpdateProvince = ({
  token,
  lesanUrl,
  provinceData,
  onSuccessAction,
}: {
  token?: string;
  lesanUrl: string;
  provinceData?: ProvinceData;
  onSuccessAction: () => void;
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
  } = useForm<ProvinceFormUpdateSchemaType>({
    resolver: zodResolver(ProvinceUpdateSchema),
    mode: "onChange",
    defaultValues: {
      name: provinceData?.name || "",
      english_name: provinceData?.english_name || "",
      population: provinceData?.population || 0,
      area: provinceData?.area || { type: "MultiPolygon", coordinates: [] },
      center_location: provinceData?.center_location || {
        type: "Point",
        coordinates: [],
      },
    },
  });

  // Initialize map data from existing province data
  useEffect(() => {
    if (provinceData) {
      // Set form values
      setValue("name", provinceData.name || "");
      setValue("english_name", provinceData.english_name || "");
      setValue("population", provinceData.population || 0);
      setValue(
        "area",
        provinceData.area || { type: "MultiPolygon", coordinates: [] },
      );
      setValue(
        "center_location",
        provinceData.center_location || { type: "Point", coordinates: [] },
      );

      // Set map polygon
      if (
        provinceData.area?.coordinates &&
        Array.isArray(provinceData.area.coordinates) &&
        provinceData.area.coordinates.length > 0
      ) {
        const firstPolygon = provinceData.area.coordinates[0];
        if (Array.isArray(firstPolygon) && firstPolygon.length > 0) {
          const firstRing = firstPolygon[0];
          if (Array.isArray(firstRing) && firstRing.length > 0) {
            try {
              const latLngArray = firstRing.map((coord: number[]) => {
                if (Array.isArray(coord) && coord.length >= 2) {
                  return {
                    lat: coord[1],
                    lng: coord[0],
                  };
                }
                throw new Error("Invalid coordinate format");
              });

              setDrawnPolygon(latLngArray);
            } catch (error) {
              console.error("Error processing polygon coordinates:", error);
              setDrawnPolygon(null);
            }
          }
        }
      } else {
        setDrawnPolygon(null);
      }

      // Set center point
      if (
        provinceData.center_location?.coordinates &&
        Array.isArray(provinceData.center_location.coordinates) &&
        provinceData.center_location.coordinates.length === 2
      ) {
        const [lng, lat] = provinceData.center_location.coordinates;
        if (typeof lng === "number" && typeof lat === "number") {
          setCenterPoint({ lat, lng });
          setMapCenter([lat, lng]);
        } else {
          console.error(
            "Invalid center coordinates:",
            provinceData.center_location.coordinates,
          );
        }
      } else {
        setCenterPoint(null);
      }

      // Trigger form validation
      trigger();
    }
  }, [provinceData, setValue, trigger]);

  // Handle polygon creation
  const handlePolygonCreated = useCallback(
    (polygon: LatLng[]) => {
      setDrawnPolygon(polygon);
      const coordinates = polygon.map((point) => [point.lng, point.lat]);
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
    (e: L.LeafletMouseEvent) => {
      if (isCenterMode) {
        const { lat, lng } = e.latlng;
        setCenterPoint({ lat, lng });
        setValue(
          "center_location",
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
      "center_location",
      { type: "Point", coordinates: [] },
      { shouldValidate: true },
    );
    trigger();
  };

  // Form submission
  const onSubmit: SubmitHandler<ProvinceFormUpdateSchemaType> = async (
    data,
  ) => {
    if (!provinceData?._id) {
      ToastNotify("error", "خطا: شناسه استان موجود نیست");
      return;
    }

    const updatedProvince = await update(
      provinceData._id,
      data.name,
      data.english_name,
      data.population,
      data.area as {
        type: "MultiPolygon";
        coordinates: number[][][][];
      },
      data.center_location as {
        type: "Point";
        coordinates: number[];
      },
    );

    if (updatedProvince.success) {
      ToastNotify("success", "استان با موفقیت ویرایش شد");
      onSuccessAction();
    } else {
      ToastNotify(
        "error",
        updatedProvince.body.message || "خطا در ویرایش استان",
      );
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
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
    });

    return () => {
      if (document.head.contains(leafletCSS)) {
        document.head.removeChild(leafletCSS);
      }
    };
  }, []);

  // Show loading state if no province data
  if (!provinceData) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">در حال بارگذاری اطلاعات استان...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Form Fields */}
        <div className="bg-gray-100 p-6 border rounded-lg space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            ویرایش اطلاعات استان
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name Input */}
            <MyInput
              label="نام استان"
              register={register}
              name="name"
              errMsg={errors.name?.message}
            />

            {/* English Name Input */}
            <MyInput
              label="نام انگلیسی استان"
              register={register}
              name="english_name"
              errMsg={errors.english_name?.message}
            />

            {/* Population Input */}
            <MyInput
              label="جمعیت"
              register={register}
              name="population"
              type="number"
              errMsg={errors.population?.message}
            />
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-gray-100 p-6 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              ویرایش استان و مرکز بر روی نقشه
            </h2>
            <div className="flex gap-2">
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
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2`}
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
                {isCenterMode ? "لغو انتخاب مرکز" : "ویرایش مرکز"}
              </button>
              <button
                type="button"
                onClick={toggleDrawingMode}
                className={`${
                  isDrawingMode
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2`}
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
                {isDrawingMode ? "لغو ترسیم" : "ویرایش منطقه"}
              </button>
            </div>
          </div>

          {(isDrawingMode || isCenterMode) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              {isDrawingMode && (
                <p className="text-sm text-blue-800 font-medium">
                  🖱️ حالت ترسیم منطقه: کلیک چپ: اضافه کردن نقطه | راست کلیک:
                  تمام کردن شکل | ESC: لغو
                </p>
              )}
              {isCenterMode && (
                <p className="text-sm text-blue-800 font-medium">
                  📍 حالت انتخاب مرکز: بر روی نقشه کلیک کنید تا مرکز استان مشخص
                  شود
                </p>
              )}
            </div>
          )}

          <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
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

          {errors.center_location && (
            <p className="text-red-500 text-sm mt-2 text-right">
              {errors.center_location.message}
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
                    منطقه استان ترسیم شد
                  </p>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <p>• تعداد نقاط: {drawnPolygon.length}</p>
                  <p>• منطقه بر روی نقشه نمایش داده شده و آماده ثبت است</p>
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
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                  <p className="text-sm text-purple-800 font-semibold">
                    مرکز استان انتخاب شد
                  </p>
                </div>
                <div className="text-xs text-purple-700 space-y-1">
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
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "در حال ویرایش..." : "ویرایش استان"}
          </button>
        </div>
      </form>
    </div>
  );
};
