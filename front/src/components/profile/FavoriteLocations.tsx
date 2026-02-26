"use client";

import React, { useState } from "react";
import Image from "next/image";

interface FavoriteLocation {
  id: string;
  title: string;
  category: string;
  rating: number;
  reviewCount: number;
  image?: string;
  address: string;
  addedDate: string;
}

interface FavoriteLocationsProps {
  locations?: FavoriteLocation[];
  isLoading?: boolean;
}

const mockLocations: FavoriteLocation[] = [
  {
    id: "1",
    title: "تخت جمشید",
    category: "مکان تاریخی",
    rating: 4.8,
    reviewCount: 1250,
    image: "/images/persepolis.jpg",
    address: "فارس، شیراز، مرودشت",
    addedDate: "۱۴۰۳/۰۲/۱۵",
  },
  {
    id: "2",
    title: "میدان نقش جهان",
    category: "میراث جهانی",
    rating: 4.9,
    reviewCount: 850,
    image: "/images/naghsh-jahan.jpg",
    address: "اصفهان، میدان امام",
    addedDate: "۱۴۰۳/۰۲/۱۰",
  },
  {
    id: "3",
    title: "برج آزادی",
    category: "بنای یادبود",
    rating: 4.6,
    reviewCount: 2100,
    image: "/images/azadi-tower.jpg",
    address: "تهران، میدان آزادی",
    addedDate: "۱۴۰۳/۰۱/۲۵",
  },
];

const categories = ["all", "مکان تاریخی", "میراث جهانی", "بنای یادبود", "مکان طبیعی"];

const categoryLabels: Record<string, string> = {
  all: "همه",
  "مکان تاریخی": "مکان‌های تاریخی",
  "میراث جهانی": "میراث جهانی",
  "بنای یادبود": "بناهای یادبود",
  "مکان طبیعی": "مکان‌های طبیعی",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i === Math.floor(rating) && rating % 1 !== 0;
        return (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${filled || half ? "text-yellow-400" : "text-[#444]"} fill-current`}
            viewBox="0 0 20 20"
          >
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#444" />
                  </linearGradient>
                </defs>
                <path
                  fill={`url(#half-${i})`}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </>
            ) : (
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            )}
          </svg>
        );
      })}
    </div>
  );
}

const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  locations = [],
  isLoading = false,
}) => {
  const [filter, setFilter] = useState("all");

  const displayLocations = locations.length > 0 ? locations : mockLocations;

  const filteredLocations =
    filter === "all" ? displayLocations : displayLocations.filter((loc) => loc.category === filter);

  if (isLoading) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-2xl p-6">
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-[#222] flex-shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 bg-[#222] rounded w-3/4" />
                <div className="h-3 bg-[#222] rounded w-1/2" />
                <div className="h-3 bg-[#222] rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] border border-[#333] rounded-2xl overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            مکان‌های مورد علاقه
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF007A]/10 border border-[#FF007A]/20 text-[#FF007A]">
            {filteredLocations.length} مکان
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === cat
                  ? "bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white shadow-lg shadow-[#FF007A]/20"
                  : "bg-[#1a1a1a] border border-[#333] text-[#a0a0a0] hover:border-[#FF007A] hover:text-white"
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="group bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden hover:border-[#FF007A]/50 hover:shadow-lg hover:shadow-[#FF007A]/10 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-36 bg-[#222]">
                  {location.image ? (
                    <Image
                      src={location.image}
                      alt={location.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-[#444]"
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

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 to-transparent" />

                  {/* Remove button */}
                  <button
                    className="absolute top-2 right-2 p-1.5 bg-[#121212]/80 backdrop-blur-sm hover:bg-[#FF007A]/20 border border-[#333] hover:border-[#FF007A]/50 rounded-lg transition-all duration-200"
                    title="حذف از علاقه‌مندی‌ها"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#FF007A]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Category badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#121212]/80 backdrop-blur-sm border border-[#333] text-[#a0a0a0]">
                      {location.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white truncate mb-2">
                    {location.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <StarRating rating={location.rating} />
                    <span className="text-xs text-[#a0a0a0]">
                      {location.rating.toFixed(1)}{" "}
                      <span className="text-[#666]">({location.reviewCount})</span>
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 text-xs text-[#666] mb-3 truncate">
                    <svg
                      className="w-3.5 h-3.5 flex-shrink-0 text-[#555]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="truncate">{location.address}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#222]">
                    <span className="text-xs text-[#555]">{location.addedDate}</span>
                    <button className="text-xs font-medium text-[#FF007A] hover:text-[#ff339c] transition-colors">
                      مشاهده روی نقشه ←
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF007A]/10 border border-[#FF007A]/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#FF007A]"
                fill="none"
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
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {filter === "all"
                ? "هنوز مکانی اضافه نکرده‌اید"
                : `هیچ ${categoryLabels[filter]} در علاقه‌مندی‌ها یافت نشد`}
            </h3>
            <p className="text-sm text-[#a0a0a0] mb-6">
              شروع به کاوش کنید و مکان‌های مورد علاقه خود را اضافه کنید
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#FF007A]/30 transition-all duration-300 transform hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              کاوش مکان‌ها
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteLocations;
