"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onToggleRouting: () => void;
  onLocateUser: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onToggleRouting,
  onLocateUser,
}) => {
  const t = useTranslations();

  const buttonClass =
    "w-10 h-10 bg-[#121212] hover:bg-[#1e1e1e] rounded-lg shadow-md border border-[#333] flex items-center justify-center transition-all duration-200 hover:shadow-lg active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus:ring-offset-2 focus:ring-offset-[#000]";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute left-4 top-20 z-40 flex flex-col gap-2"
    >
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className={buttonClass}
        aria-label="Zoom in"
        title="بزرگنمایی"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v12m6-6H6"
          />
        </svg>
      </button>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        className={buttonClass}
        aria-label="Zoom out"
        title="کوچک‌نمایی"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 12H6"
          />
        </svg>
      </button>

      <div className="w-10 h-px bg-[#333] my-1" />

      {/* Reset View */}
      <button
        onClick={onResetView}
        className={buttonClass}
        aria-label="Reset view"
        title="نمای پیش‌فرض"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>

      {/* Locate User */}
      <button
        onClick={onLocateUser}
        className={buttonClass}
        aria-label="Find my location"
        title="موقعیت من"
      >
        <svg
          className="w-5 h-5 text-white"
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

      <div className="w-10 h-px bg-[#333] my-1" />

      {/* Toggle Routing */}
      <button
        onClick={onToggleRouting}
        className={`${buttonClass} bg-[#FF007A]/20 hover:bg-[#FF007A]/30 border-[#FF007A]`}
        aria-label="Toggle routing"
        title="مسیریابی"
      >
        <svg
          className="w-5 h-5 text-[#FF007A]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
      </button>

      {/* Measure Distance (Optional) */}
      <button
        className={buttonClass}
        aria-label="Measure distance"
        title="اندازه‌گیری فاصله"
      >
        <svg
          className="w-5 h-5 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default MapControls;
