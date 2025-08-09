'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface FavoriteButtonProps {
  locationId: string;
  initialIsFavorite?: boolean;
  onToggle?: (locationId: string, isFavorite: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  locationId,
  initialIsFavorite = false,
  onToggle
}) => {
  const t = useTranslations('Location');
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      setIsLoading(false);

      if (onToggle) {
        onToggle(locationId, newIsFavorite);
      }
    }, 500);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
        isFavorite
          ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
      }`}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      {isLoading ? (
        <div className="loader w-4 h-4 mr-2"></div>
      ) : (
        <svg
          className={`w-4 h-4 mr-2 transition-colors duration-200 ${
            isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
          }`}
          fill={isFavorite ? 'currentColor' : 'none'}
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
      )}
      {isFavorite ? 'حذف از علاقه‌مندی‌ها' : t('addToFavorites')}
    </button>
  );
};

export default FavoriteButton;
