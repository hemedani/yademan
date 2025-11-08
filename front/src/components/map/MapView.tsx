"use client";

import { Suspense, useState, useEffect } from "react";
import ClientMapWrapper from "@/components/ClientMapWrapper";
import MapSkeleton from "@/components/map/MapSkeleton";
import { useTranslations } from "next-intl";

interface MapViewProps {
  className?: string;
}

export default function MapView({ className = "" }: MapViewProps) {
  const [mapLoading, setMapLoading] = useState(true);
  const t = useTranslations();

  // Auto-hide the loading state after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Suspense fallback={<MapSkeleton className="w-full h-full" />}>
        <div className="absolute inset-0 w-full h-full">
          <ClientMapWrapper onLoad={() => setMapLoading(false)} />
        </div>
      </Suspense>

      {/* Initial loading overlay */}
      {mapLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-[#121212] border border-[#333] p-5 rounded-xl shadow-xl flex flex-col items-center gap-3 max-w-xs mx-auto text-center">
            <svg
              className="animate-spin h-8 w-8 text-[#FF007A]"
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
            <span className="font-medium text-white">{t("map.loading")}</span>
            <p className="text-sm text-[#a0a0a0]">{t("Common.loading")}</p>
          </div>
        </div>
      )}
    </div>
  );
}
