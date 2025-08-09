'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FilterState {
  category: string;
  rating: number;
  distance: number;
  priceRange: string;
}

const FilterPanel: React.FC = () => {
  const t = useTranslations('HomePage');
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    rating: 0,
    distance: 50,
    priceRange: ''
  });

  const categories = [
    { value: '', label: 'همه دسته‌ها' },
    { value: 'historical', label: 'مکان‌های تاریخی' },
    { value: 'cultural', label: 'مکان‌های فرهنگی' },
    { value: 'natural', label: 'مکان‌های طبیعی' },
    { value: 'religious', label: 'مکان‌های مذهبی' },
    { value: 'museum', label: 'موزه‌ها' }
  ];

  const priceRanges = [
    { value: '', label: 'همه قیمت‌ها' },
    { value: 'free', label: 'رایگان' },
    { value: 'low', label: 'کم (تا ۵۰,۰۰۰ تومان)' },
    { value: 'medium', label: 'متوسط (۵۰,۰۰۰ - ۱۰۰,۰۰۰ تومان)' },
    { value: 'high', label: 'بالا (بیش از ۱۰۰,۰۰۰ تومان)' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      rating: 0,
      distance: 50,
      priceRange: ''
    });
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <button
        key={index}
        onClick={() => handleFilterChange('rating', index + 1)}
        className={`text-lg ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        } hover:text-yellow-400 transition-colors`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{t('filters')}</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          پاک کردن همه
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          دسته‌بندی
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          حداقل امتیاز
        </label>
        <div className="flex items-center space-x-1">
          {renderStars(filters.rating)}
          <span className="ml-2 text-sm text-gray-600">
            {filters.rating > 0 ? `${filters.rating} ستاره و بالاتر` : 'انتخاب نشده'}
          </span>
        </div>
      </div>

      {/* Distance Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          شعاع جستجو: {filters.distance} کیلومتر
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={filters.distance}
          onChange={(e) => handleFilterChange('distance', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>۱ کیلومتر</span>
          <span>۱۰۰ کیلومتر</span>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          محدوده قیمت
        </label>
        <select
          value={filters.priceRange}
          onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
        onClick={() => {
          // Apply filters logic here
          console.log('Applying filters:', filters);
        }}
      >
        اعمال فیلترها
      </button>

      {/* Active Filters Count */}
      {(filters.category || filters.rating > 0 || filters.distance !== 50 || filters.priceRange) && (
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">فیلترهای فعال:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {[
                filters.category && 'دسته‌بندی',
                filters.rating > 0 && 'امتیاز',
                filters.distance !== 50 && 'فاصله',
                filters.priceRange && 'قیمت'
              ].filter(Boolean).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
