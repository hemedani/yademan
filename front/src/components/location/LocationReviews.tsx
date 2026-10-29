'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export interface LocationReview {
  id: string;
  author: string;
  text: string;
  rating?: number | null;
}

interface LocationReviewsProps {
  reviews?: LocationReview[];
}

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center" aria-label={`${rating} از ۵`}>
    {Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/**
 * Renders the place's approved comments. Previously this was a static "no
 * reviews yet" panel even when the database had comments for the place.
 */
const LocationReviews: React.FC<LocationReviewsProps> = ({ reviews = [] }) => {
  const t = useTranslations('Location');

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('reviews')}</h2>
          {reviews.length > 0 && (
            <span className="text-sm text-gray-500">
              {reviews.length.toLocaleString('fa-IR')} نظر
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-8">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">نظری ثبت نشده است</h3>
            <p className="text-gray-500 mb-4">
              اولین نفری باشید که نظر خود را درباره این مکان ثبت می‌کند
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {t('addReview')}
            </button>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{review.author}</span>
                  {typeof review.rating === 'number' && review.rating > 0 && (
                    <Stars rating={Math.round(review.rating)} />
                  )}
                </div>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LocationReviews;
