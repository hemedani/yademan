"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Location {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  image?: string;
  address: string;
  distance?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface LocationListProps {
  locations?: Location[];
  isLoading?: boolean;
  onLocationClick?: (location: Location) => void;
}

const LocationList: React.FC<LocationListProps> = ({
  locations = [],
  isLoading = false,
  onLocationClick,
}) => {
  const t = useTranslations("Location");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  // Mock data for demonstration
  const mockLocations: Location[] = [
    {
      id: "1",
      title: "تخت جمشید",
      category: "مکان تاریخی",
      rating: 4.8,
      reviewCount: 1250,
      image: "/images/persepolis.jpg",
      address: "فارس، شیراز، مرودشت",
      distance: 12.5,
      coordinates: { lat: 29.9356, lng: 52.8916 },
    },
    {
      id: "2",
      title: "میدان نقش جهان",
      category: "میراث جهانی",
      rating: 4.9,
      reviewCount: 850,
      image: "/images/naghsh-jahan.jpg",
      address: "اصفهان، میدان امام",
      distance: 8.2,
      coordinates: { lat: 32.6575, lng: 51.6779 },
    },
    {
      id: "3",
      title: "برج آزادی",
      category: "بنای یادبود",
      rating: 4.6,
      reviewCount: 2100,
      image: "/images/azadi-tower.jpg",
      address: "تهران، میدان آزادی",
      distance: 15.3,
      coordinates: { lat: 35.6958, lng: 51.3384 },
    },
  ];

  const displayLocations = locations.length > 0 ? locations : mockLocations;

  const handleLocationClick = (location: Location) => {
    setSelectedLocationId(location.id);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <linearGradient id={`half-star-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-star-${i})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>,
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
        );
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 animate-pulse"
          >
            <div className="flex">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 mr-4">
                <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayLocations.length === 0) {
    return (
      <div className="bg-white rounded-lg sm:rounded-xl shadow p-6 sm:p-8 text-center m-3 sm:m-4">
        <svg
          className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400 mx-auto mb-4"
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
            d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"
          />
        </svg>
        <p className="text-gray-500 text-base sm:text-lg font-medium">{t("noLocationsFound")}</p>
        <p className="text-gray-400 text-sm sm:text-base mt-2">{t("tryDifferentFilters")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-b">
        <p className="text-sm sm:text-base text-gray-600 font-medium">
          {displayLocations.length} {t("locationsFound")}
        </p>
      </div>

      <div className="px-2 sm:px-3">
        {displayLocations.map((location) => (
          <div
            key={location.id}
            onClick={() => handleLocationClick(location)}
            className={`bg-white rounded-lg sm:rounded-xl shadow hover:shadow-md active:shadow-lg transition-all duration-200 cursor-pointer border-2 mb-3 sm:mb-4 touch-manipulation ${
              selectedLocationId === location.id
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-transparent"
            }`}
            style={{ minHeight: "120px" }}
          >
            <div className="p-4 sm:p-5">
              <div className="flex">
                {/* Image */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                  {location.image ? (
                    <Image
                      src={location.image}
                      alt={location.title}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                      <svg
                        className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 mr-4 min-w-0">
                  {/* Title and Distance */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                      {location.title}
                    </h3>
                    {location.distance && (
                      <span className="text-xs sm:text-sm text-gray-500 mr-2 whitespace-nowrap bg-gray-100 px-2 py-1 rounded-full">
                        {location.distance} کیلومتر
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                      {location.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center space-x-1 ">{renderStars(location.rating)}</div>
                    <span className="mr-2 text-sm sm:text-base text-gray-600">
                      {location.rating.toFixed(1)} ({location.reviewCount})
                    </span>
                  </div>

                  {/* Address */}
                  <p
                    className="text-sm sm:text-base text-gray-600 leading-relaxed"
                    title={location.address}
                  >
                    {location.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationList;
