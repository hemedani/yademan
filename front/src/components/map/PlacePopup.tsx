"use client";

import React from "react";
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

const PlacePopup: React.FC<PlacePopupProps> = ({
  place,
  onMoreInfo,
  onNavigate,
}) => {
  const t = useTranslations();

  return (
    <div className="min-w-[250px] max-w-[300px] p-3">
      {/* Header with image */}
      {place.images && place.images.length > 0 && (
        <div className="relative h-32 -mx-3 -mt-3 mb-3">
          <img
            src={place.images[0]}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {place.category && (
            <span className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs">
              {place.category}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h3 className="font-semibold text-gray-900 text-base mb-1">
        {place.name}
      </h3>

      {/* Rating */}
      {place.rating && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(place.rating!)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-600">{place.rating}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {place.description}
      </p>

      {/* Address */}
      {place.address && (
        <div className="flex items-start gap-1 mb-3 text-xs text-gray-500">
          <svg
            className="w-3 h-3 mt-0.5 flex-shrink-0"
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
              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {place.tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-500 text-xs">
              +{place.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        {onMoreInfo && (
          <button
            onClick={onMoreInfo}
            className="flex-1 py-1.5 px-3 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
          >
            {t("Common.moreInfo")}
          </button>
        )}
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="flex-1 py-1.5 px-3 border border-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-50 transition-colors"
          >
            {t("Location.navigate")}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlacePopup;
