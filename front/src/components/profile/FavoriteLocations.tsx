'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

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

const FavoriteLocations: React.FC<FavoriteLocationsProps> = ({
  locations = [],
  isLoading = false
}) => {
  const t = useTranslations('Profile');
  const [filter, setFilter] = useState<string>('all');

  // Mock data for demonstration
  const mockLocations: FavoriteLocation[] = [
    {
      id: '1',
      title: 'تخت جمشید',
      category: 'مکان تاریخی',
      rating: 4.8,
      reviewCount: 1250,
      image: '/images/persepolis.jpg',
      address: 'فارس، شیراز، مرودشت',
      addedDate: '۱۴۰۳/۰۲/۱۵'
    },
    {
      id: '2',
      title: 'میدان نقش جهان',
      category: 'میراث جهانی',
      rating: 4.9,
      reviewCount: 850,
      image: '/images/naghsh-jahan.jpg',
      address: 'اصفهان، میدان امام',
      addedDate: '۱۴۰۳/۰۲/۱۰'
    },
    {
      id: '3',
      title: 'برج آزادی',
      category: 'بنای یادبود',
      rating: 4.6,
      reviewCount: 2100,
      image: '/images/azadi-tower.jpg',
      address: 'تهران، میدان آزادی',
      addedDate: '۱۴۰۳/۰۱/۲۵'
    }
  ];

  const displayLocations = locations.length > 0 ? locations : mockLocations;

  const categories = ['all', 'مکان تاریخی', 'میراث جهانی', 'بنای یادبود', 'مکان طبیعی'];
  const categoryLabels: Record<string, string> = {
    'all': 'همه',
    'مکان تاریخی': 'مکان‌های تاریخی',
    'میراث جهانی': 'میراث جهانی',
    'بنای یادبود': 'بناهای یادبود',
    'مکان طبیعی': 'مکان‌های طبیعی'
  };

  const filteredLocations = filter === 'all'
    ? displayLocations
    : displayLocations.filter(location => location.category === filter);

  const handleRemoveFavorite = (locationId: string) => {
    // Handle removing from favorites
    console.log('Removing from favorites:', locationId);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-400"
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-star-fav-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-star-fav-${i})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">مکان‌های مورد علاقه</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredLocations.length} مکان
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Locations Grid */}
        {filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow border border-gray-200"
              >
                {/* Image */}
                <div className="relative h-40">
                  {location.image ? (
                    <img
                      src={location.image}
                      alt={location.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
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

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFavorite(location.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
                    title="حذف از علاقه‌مندی‌ها"
                  >
                    <svg
                      className="w-4 h-4 text-red-500"
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
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {location.title}
                  </h3>

                  {/* Category */}
                  <div className="mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {location.category}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {renderStars(location.rating)}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {location.rating.toFixed(1)} ({location.reviewCount})
                    </span>
                  </div>

                  {/* Address */}
                  <p className="text-sm text-gray-600 mb-3 truncate" title={location.address}>
                    {location.address}
                  </p>

                  {/* Added Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      اضافه شده: {location.addedDate}
                    </span>
                    <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                      مشاهده
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'هنوز مکانی اضافه نکرده‌اید' : `هیچ ${categoryLabels[filter]} در علاقه‌مندی‌ها یافت نشد`}
            </h3>
            <p className="text-gray-500 mb-4">
              شروع به کاوش کنید و مکان‌های مورد علاقه خود را اضافه کنید
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              کاوش مکان‌ها
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteLocations;
