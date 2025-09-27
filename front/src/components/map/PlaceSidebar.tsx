"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";

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
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    social?: string[];
  };
  hoursOfOperation?: string;
  meta?: Record<string, any>;
}

interface PlaceSidebarProps {
  place: Place;
  onClose: () => void;
  onNavigate: (coords: [number, number]) => void;
  isAuthenticated: boolean;
}

const PlaceSidebar: React.FC<PlaceSidebarProps> = ({
  place,
  onClose,
  onNavigate,
  isAuthenticated,
}) => {
  const t = useTranslations();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "photos" | "reviews">("info");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place.name,
          text: place.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      // TODO: Show login prompt
      return;
    }
    setIsFavorited(!isFavorited);
    // TODO: Make API call to save favorite
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
    >
      {/* Header with Image Gallery */}
      <div className="relative h-64 bg-gray-100 flex-shrink-0">
        {place.images && place.images.length > 0 ? (
          <>
            <Image
              src={place.images[activeImageIndex] || "/placeholder-image.jpg"}
              alt={place.name}
              fill
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
              }}
            />
            {/* Image Navigation Dots */}
            {place.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {place.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeImageIndex
                        ? "bg-white w-6"
                        : "bg-white/60 hover:bg-white/80"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-20 h-20 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Category Badge */}
        {place.category && (
          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
            {place.category}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          aria-label={t("Common.close")}
        >
          <svg
            className="w-5 h-5 text-gray-700"
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Title and Actions */}
        <div className="p-4 border-b">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {place.name}
              </h2>
              {place.rating && (
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
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
                  <span className="text-sm text-gray-600">{place.rating}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate(place.center.coordinates)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
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
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              {t("Location.navigate")}
            </button>
            <button
              onClick={handleFavorite}
              className={`p-2 border rounded-lg transition-colors ${
                isFavorited
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
              aria-label={t("Location.addToFavorites")}
            >
              <svg
                className="w-5 h-5"
                fill={isFavorited ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <button
              onClick={handleShare}
              className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              aria-label={t("Location.share")}
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a3 3 0 10-4.026 4.026 3 3 0 004.026-4.026zm0 0a3 3 0 10-4.026-4.026 3 3 0 004.026 4.026z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {["info", "photos", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t(`Location.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "info" && (
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("Location.description")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {place.description}
                </p>
              </div>

              {/* Tags */}
              {place.tags && place.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("Location.tags")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {place.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              {place.address && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("Location.address")}
                  </h3>
                  <p className="text-gray-600 text-sm">{place.address}</p>
                </div>
              )}

              {/* Contact */}
              {place.contact && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("Location.contact")}
                  </h3>
                  <div className="space-y-2">
                    {place.contact.phone && (
                      <a
                        href={`tel:${place.contact.phone}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
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
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {place.contact.phone}
                      </a>
                    )}
                    {place.contact.website && (
                      <a
                        href={place.contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
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
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                          />
                        </svg>
                        {place.contact.website}
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Hours of Operation */}
              {place.hoursOfOperation && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {t("Location.hours")}
                  </h3>
                  <p className="text-gray-600 text-sm">{place.hoursOfOperation}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid grid-cols-2 gap-2">
              {place.images && place.images.length > 0 ? (
                place.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image || "/placeholder-image.jpg"}
                      alt={`${place.name} - Photo ${index + 1}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                      }}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  {t("Location.noImages")}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {t("Location.addReview")}
              </button>
              <div className="text-center py-8 text-gray-500">
                {t("Location.noReviews")}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlaceSidebar;
