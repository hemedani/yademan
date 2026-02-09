"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Place {
  _id: string;
  name: string;
  description: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
  category?: string;
  tags?: string[];
  images?: string[];
  rating?: number;
  address?: string;
}

interface PlacePopupProps {
  place: Place;
  onMoreInfo?: () => void;
  onNavigate?: () => void;
}

const PlacePopup: React.FC<PlacePopupProps> = ({ place, onMoreInfo, onNavigate }) => {
  const t = useTranslations();

  return (
    <div className="min-w-[250px] max-w-[300px] p-3 bg-[#121212] rounded-lg border border-[#333] shadow-xl">
      {/* Header with image */}
      {place.images && place.images.length > 0 && (
        <div className="relative h-32 -mx-3 -mt-3 mb-3 rounded-t-lg overflow-hidden">
          <Image
            src={place.images[0]}
            alt={place.name}
            width={300}
            height={128}
            className="w-full h-full object-cover"
            unoptimized={true}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {place.category && (
            <span className="absolute top-2 left-2 bg-[#FF007A]/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
              {place.category}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-white text-base mb-1">{place.name}</h3>

      {/* Rating */}
      {place.rating && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(place.rating!) ? "text-[#FFD700]" : "text-[#555]"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-[#a0a0a0]">{place.rating}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-[#a0a0a0] mb-2 line-clamp-2">{place.description}</p>

      {/* Address */}
      {place.address && (
        <div className="flex items-start gap-1 mb-3 text-xs text-[#a0a0a0]">
          <svg
            className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#a0a0a0]"
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
          <span>{place.address}</span>
        </div>
      )}

      {/* Tags */}
      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {place.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-[#1e1e1e] text-[#a0a0a0] text-xs rounded-full border border-[#333]"
            >
              {tag}
            </span>
          ))}
          {place.tags.length > 3 && (
            <span className="px-2 py-0.5 text-[#a0a0a0] text-xs">+{place.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-[#333]">
        {onMoreInfo && (
          <button
            onClick={onMoreInfo}
            className="flex-1 py-1.5 px-3 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white text-xs font-medium rounded hover:from-[#ff339c] hover:to-[#b53af5] transition-all"
          >
            {t("Common.moreInfo")}
          </button>
        )}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="flex-1 py-1.5 px-3 bg-[#1e1e1e] border border-[#333] text-white text-xs font-medium rounded hover:bg-[#2a2a2a] transition-colors"
          >
            {t("Location.navigate")}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlacePopup;
