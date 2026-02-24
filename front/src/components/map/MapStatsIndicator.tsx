import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface MapStatsIndicatorProps {
  count: number;
}

const MapStatsIndicator: React.FC<MapStatsIndicatorProps> = ({ count }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations();

  return (
    <div className="absolute top-[184px] right-4 z-10">
      <div
        className="p-2 rounded-lg bg-[#121212]/90 backdrop-blur-sm border border-[#333] shadow-lg flex items-center gap-1.5 overflow-hidden min-w-fit"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-1.5">
          <svg
            className={`w-4 h-4 transition-colors duration-300 ${
              isHovered ? "text-[#FF007A]" : "text-[#a0a0a0]"
            }`}
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
          <span
            className={`text-white text-sm font-medium transition-colors duration-300 ${
              isHovered ? "text-[#FF007A]" : "text-white"
            }`}
          >
            {count}
          </span>
        </div>
        <div
          className={`whitespace-nowrap transition-all duration-300 origin-left ${
            isHovered ? "opacity-100 w-auto pl-2" : "opacity-0 w-0 pl-0"
          }`}
        >
          <span className="text-white text-sm font-medium border-l border-[#333] ml-2">
            {t("Location.locationsFound")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MapStatsIndicator;
