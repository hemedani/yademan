"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface RoutePanelProps {
  start: [number, number] | null;
  end: [number, number] | null;
  onClose: () => void;
  onCalculateRoute: (start: [number, number], end: [number, number]) => void;
  onSetStart: (coords: [number, number] | null) => void;
  onSetEnd: (coords: [number, number] | null) => void;
}

interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  steps?: RouteStep[];
}

interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
}

const RoutePanel: React.FC<RoutePanelProps> = ({
  start,
  end,
  onClose,
  onCalculateRoute,
  onSetStart,
  onSetEnd,
}) => {
  const t = useTranslations();
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [transportMode, setTransportMode] = useState<
    "driving" | "walking" | "cycling"
  >("driving");
  const [showSteps, setShowSteps] = useState(false);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = useCallback(
    (point1: [number, number], point2: [number, number]): number => {
      const R = 6371; // Earth's radius in km
      const lat1 = (point1[1] * Math.PI) / 180;
      const lat2 = (point2[1] * Math.PI) / 180;
      const deltaLat = ((point2[1] - point1[1]) * Math.PI) / 180;
      const deltaLon = ((point2[0] - point1[0]) * Math.PI) / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return Math.round(R * c * 10) / 10; // Round to 1 decimal place
    },
    [],
  );

  // Use current location for start
  const useCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          onSetStart(coords);
          setStartAddress("موقعیت فعلی شما");
        },
        (error) => {
          console.error("Error getting location:", error);
          // TODO: Show error toast
        },
      );
    }
  }, [onSetStart]);

  // Define handleCalculateRoute with useCallback to avoid dependency issues
  const handleCalculateRoute = useCallback(async () => {
    if (!start || !end) return;

    setIsCalculating(true);
    try {
      // Call the route calculation function
      onCalculateRoute(start, end);

      // Mock route info for demonstration
      // TODO: Replace with actual route calculation
      const mockRouteInfo: RouteInfo = {
        distance: calculateDistance(start, end),
        duration: Math.round(calculateDistance(start, end) * 2), // Rough estimate
        steps: [
          {
            instruction: "از نقطه شروع حرکت کنید",
            distance: 0.5,
            duration: 1,
          },
          {
            instruction: "به سمت شمال در خیابان اصلی",
            distance: 2.3,
            duration: 5,
          },
          {
            instruction: "در تقاطع به راست بپیچید",
            distance: 1.2,
            duration: 3,
          },
          {
            instruction: "ادامه دهید تا به مقصد برسید",
            distance: 0.8,
            duration: 2,
          },
        ],
      };

      setRouteInfo(mockRouteInfo);
    } catch (error) {
      console.error("Error calculating route:", error);
      // TODO: Show error toast
    } finally {
      setIsCalculating(false);
    }
  }, [start, end, onCalculateRoute, calculateDistance]);

  // Calculate route when both start and end are set
  useEffect(() => {
    if (start && end) {
      handleCalculateRoute();
    }
  }, [start, end, transportMode, handleCalculateRoute]);

  const clearRoute = useCallback(() => {
    onSetStart(null);
    onSetEnd(null);
    setStartAddress("");
    setEndAddress("");
    setRouteInfo(null);
  }, [onSetStart, onSetEnd]);

  const transportModes = [
    {
      id: "driving" as const,
      icon: "🚗",
      label: "رانندگی",
    },
    {
      id: "walking" as const,
      icon: "🚶",
      label: "پیاده‌روی",
    },
    {
      id: "cycling" as const,
      icon: "🚴",
      label: "دوچرخه",
    },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute bottom-16 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">مسیریابی</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            aria-label={t("Common.close")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Transport Mode Selector */}
        <div className="flex gap-2">
          {transportModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setTransportMode(mode.id)}
              className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                transportMode === mode.id
                  ? "bg-white text-blue-600"
                  : "bg-white/20 hover:bg-white/30 text-white"
              }`}
            >
              <span className="text-lg">{mode.icon}</span>
              <span className="text-sm font-medium">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Route Inputs */}
      <div className="p-4 space-y-3">
        {/* Start Location */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">مبدا</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              placeholder="نقطه شروع را وارد کنید"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={useCurrentLocation}
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
              title="استفاده از موقعیت فعلی"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          </div>
        </div>

        {/* End Location */}
        <div>
          <label className="text-xs text-gray-600 mb-1 block">مقصد</label>
          <input
            type="text"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
            placeholder="مقصد را وارد کنید یا روی نقشه کلیک کنید"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCalculateRoute}
            disabled={!start || !end || isCalculating}
            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال محاسبه...
              </span>
            ) : (
              "محاسبه مسیر"
            )}
          </button>
          <button
            onClick={clearRoute}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            پاک کردن
          </button>
        </div>
      </div>

      {/* Route Information */}
      {routeInfo && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {routeInfo.distance}
                  </p>
                  <p className="text-xs text-gray-600">کیلومتر</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {routeInfo.duration}
                  </p>
                  <p className="text-xs text-gray-600">دقیقه</p>
                </div>
              </div>
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showSteps ? "مخفی کردن" : "نمایش"} مراحل
              </button>
            </div>

            {/* Route Steps */}
            {showSteps && routeInfo.steps && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 pt-3 border-t border-gray-100"
              >
                {routeInfo.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step.instruction}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {step.distance} کیلومتر • {step.duration} دقیقه
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RoutePanel;
