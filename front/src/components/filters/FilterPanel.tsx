"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface FilterState {
  category: string;
  rating: number;
  distance: number;
  priceRange: string;
}

const FilterPanel: React.FC = () => {
  const t = useTranslations("HomePage");
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    rating: 0,
    distance: 50,
    priceRange: "",
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    { value: "", label: "همه دسته‌ها" },
    { value: "historical", label: "مکان‌های تاریخی" },
    { value: "cultural", label: "مکان‌های فرهنگی" },
    { value: "natural", label: "مکان‌های طبیعی" },
    { value: "religious", label: "مکان‌های مذهبی" },
    { value: "museum", label: "موزه‌ها" },
  ];

  const priceRanges = [
    { value: "", label: "همه قیمت‌ها" },
    { value: "free", label: "رایگان" },
    { value: "low", label: "کم (تا ۵۰,۰۰۰ تومان)" },
    { value: "medium", label: "متوسط (۵۰,۰۰۰ - ۱۰۰,۰۰۰ تومان)" },
    { value: "high", label: "بالا (بیش از ۱۰۰,۰۰۰ تومان)" },
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      rating: 0,
      distance: 50,
      priceRange: "",
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => handleFilterChange("rating", index + 1)}
        className={`text-xl sm:text-lg p-1 min-w-[44px] min-h-[44px] sm:min-w-[auto] sm:min-h-[auto] sm:p-0 flex items-center justify-center touch-manipulation ${
          index < rating ? "text-yellow-400" : "text-gray-300"
        } hover:text-yellow-400 active:text-yellow-500 transition-colors`}
        aria-label={`${index + 1} ستاره`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border overflow-hidden">
      {/* Mobile: Collapsible header, Desktop: Always expanded */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 sm:bg-white border-b sm:border-b-0">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-2 space-x-reverse lg:cursor-default"
          aria-label={isExpanded ? "بستن فیلترها" : "باز کردن فیلترها"}
        >
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {t("filters")}
          </h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform lg:hidden ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          onClick={clearFilters}
          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded touch-manipulation min-h-[44px] flex items-center"
        >
          پاک کردن همه
        </button>
      </div>

      {/* Filter Content - Collapsible on mobile, always visible on desktop */}
      <div
        className={`${isExpanded ? "block" : "hidden"} lg:block p-3 sm:p-4 space-y-4 sm:space-y-6`}
      >
        {/* Category Filter */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            دسته‌بندی
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full p-3 sm:p-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
            style={{ minHeight: "44px" }}
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            حداقل امتیاز
          </label>
          <div className="flex items-center space-x-1 space-x-reverse">
            <div className="flex space-x-1 space-x-reverse">
              {renderStars(filters.rating)}
            </div>
            <span className="mr-2 text-xs sm:text-sm text-gray-600">
              {filters.rating > 0
                ? `${filters.rating} ستاره و بالاتر`
                : "انتخاب نشده"}
            </span>
          </div>
        </div>

        {/* Distance Filter */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
            شعاع جستجو: {filters.distance} کیلومتر
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={filters.distance}
            onChange={(e) =>
              handleFilterChange("distance", parseInt(e.target.value))
            }
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
            style={{ minHeight: "44px" }}
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-2">
            <span>۱۰۰ کیلومتر</span>
            <span>۱ کیلومتر</span>
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
            محدوده قیمت
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange("priceRange", e.target.value)}
            className="w-full p-3 sm:p-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none"
            style={{ minHeight: "44px" }}
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Filters Button */}
        <button
          className="w-full bg-blue-600 text-white py-3 sm:py-2 px-4 rounded-lg sm:rounded-md hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium text-base sm:text-sm touch-manipulation"
          style={{ minHeight: "44px" }}
          onClick={() => {
            // Apply filters logic here
            console.log("Applying filters:", filters);
          }}
        >
          اعمال فیلترها
        </button>

        {/* Active Filters Count */}
        {(filters.category ||
          filters.rating > 0 ||
          filters.distance !== 50 ||
          filters.priceRange) && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-gray-600">فیلترهای فعال:</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                {
                  [
                    filters.category && "دسته‌بندی",
                    filters.rating > 0 && "امتیاز",
                    filters.distance !== 50 && "فاصله",
                    filters.priceRange && "قیمت",
                  ].filter(Boolean).length
                }
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
