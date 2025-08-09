'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface LocationInfoProps {
  description?: string;
  category?: string;
  historicalPeriod?: string;
  features?: string[];
  accessibility?: string;
  visitingHours?: string;
  ticketPrice?: string;
  website?: string;
  phone?: string;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  description = "این مکان تاریخی دارای اهمیت فرهنگی و تاریخی بالایی است و هر ساله میزبان هزاران بازدیدکننده داخلی و خارجی می‌باشد.",
  category = "مکان تاریخی",
  historicalPeriod = "دوره هخامنشی",
  features = ["معماری کهن", "نقوش سنگی", "محوطه باستانی"],
  accessibility = "دسترسی آسان با وسایل نقلیه",
  visitingHours = "۸:۰۰ تا ۱۸:۰۰",
  ticketPrice = "۵۰,۰۰۰ تومان",
  website,
  phone
}) => {
  const t = useTranslations('Location');

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('details')}</h2>

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">توضیحات</h3>
          <p className="text-gray-700 leading-relaxed">{description}</p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">اطلاعات پایه</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">دسته‌بندی:</span>
                <span className="text-gray-900 font-medium">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">دوره تاریخی:</span>
                <span className="text-gray-900 font-medium">{historicalPeriod}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-2">اطلاعات بازدید</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">ساعات بازدید:</span>
                <span className="text-gray-900 font-medium">{visitingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">قیمت بلیط:</span>
                <span className="text-gray-900 font-medium">{ticketPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">ویژگی‌های مهم</h4>
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Accessibility */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-2">دسترسی</h4>
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-700">{accessibility}</span>
          </div>
        </div>

        {/* Contact Information */}
        {(website || phone) && (
          <div className="border-t pt-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">اطلاعات تماس</h4>
            <div className="space-y-2">
              {website && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                    />
                  </svg>
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    وب‌سایت رسمی
                  </a>
                </div>
              )}
              {phone && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-400 mr-2"
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
                  <a
                    href={`tel:${phone}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationInfo;
