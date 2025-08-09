'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Activity {
  id: string;
  type: 'review' | 'favorite' | 'visit' | 'photo';
  title: string;
  description: string;
  locationName: string;
  locationId: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

interface ActivityHistoryProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  activities = [],
  isLoading = false
}) => {
  const t = useTranslations('Profile');
  const [filter, setFilter] = useState<string>('all');

  // Mock data for demonstration
  const mockActivities: Activity[] = [
    {
      id: '1',
      type: 'review',
      title: 'نظر جدید ثبت شد',
      description: 'نظر شما برای تخت جمشید با امتیاز ۵ ستاره ثبت شد',
      locationName: 'تخت جمشید',
      locationId: '1',
      date: '۱۴۰۳/۰۲/۱۵',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'bg-blue-500'
    },
    {
      id: '2',
      type: 'favorite',
      title: 'اضافه شدن به علاقه‌مندی‌ها',
      description: 'میدان نقش جهان به فهرست علاقه‌مندی‌های شما اضافه شد',
      locationName: 'میدان نقش جهان',
      locationId: '2',
      date: '۱۴۰۳/۰۲/۱۰',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
      color: 'bg-red-500'
    },
    {
      id: '3',
      type: 'visit',
      title: 'بازدید ثبت شد',
      description: 'بازدید شما از برج آزادی در سیستم ثبت شد',
      locationName: 'برج آزادی',
      locationId: '3',
      date: '۱۴۰۳/۰۱/۲۵',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-green-500'
    },
    {
      id: '4',
      type: 'photo',
      title: 'تصویر آپلود شد',
      description: 'تصویر جدیدی از کاخ گلستان آپلود کردید',
      locationName: 'کاخ گلستان',
      locationId: '4',
      date: '۱۴۰۳/۰۱/۲۰',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      color: 'bg-purple-500'
    }
  ];

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const filterOptions = [
    { value: 'all', label: 'همه فعالیت‌ها' },
    { value: 'review', label: 'نظرات' },
    { value: 'favorite', label: 'علاقه‌مندی‌ها' },
    { value: 'visit', label: 'بازدیدها' },
    { value: 'photo', label: 'تصاویر' }
  ];

  const filteredActivities = filter === 'all'
    ? displayActivities
    : displayActivities.filter(activity => activity.type === filter);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
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
          <h2 className="text-xl font-bold text-gray-900">تاریخچه فعالیت‌ها</h2>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {filteredActivities.length} فعالیت
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Activities Timeline */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {index < filteredActivities.length - 1 && (
                  <div className="absolute right-5 top-12 w-0.5 h-16 bg-gray-200"></div>
                )}

                {/* Activity Item */}
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-10 h-10 ${activity.color} rounded-full flex items-center justify-center text-white`}>
                    {activity.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activity.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            {activity.locationName}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {activity.date}
                      </div>
                    </div>
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'هنوز فعالیتی ثبت نشده است' : `هیچ ${filterOptions.find(f => f.value === filter)?.label} یافت نشد`}
            </h3>
            <p className="text-gray-500 mb-4">
              شروع به استفاده از سایت کنید تا فعالیت‌هایتان اینجا نمایش داده شود
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              شروع کاوش
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredActivities.length >= 10 && (
          <div className="text-center mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              نمایش بیشتر
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
