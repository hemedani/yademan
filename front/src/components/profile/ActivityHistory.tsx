"use client";

import React, { useState } from "react";

type ActivityType = "review" | "favorite" | "visit" | "photo";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  locationName: string;
  locationId: string;
  date: string;
}

interface ActivityHistoryProps {
  activities?: Activity[];
  isLoading?: boolean;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "review",
    title: "نظر جدید ثبت شد",
    description: "نظر شما برای تخت جمشید با امتیاز ۵ ستاره ثبت شد",
    locationName: "تخت جمشید",
    locationId: "1",
    date: "۱۴۰۳/۰۲/۱۵",
  },
  {
    id: "2",
    type: "favorite",
    title: "اضافه شدن به علاقه‌مندی‌ها",
    description: "میدان نقش جهان به فهرست علاقه‌مندی‌های شما اضافه شد",
    locationName: "میدان نقش جهان",
    locationId: "2",
    date: "۱۴۰۳/۰۲/۱۰",
  },
  {
    id: "3",
    type: "visit",
    title: "بازدید ثبت شد",
    description: "بازدید شما از برج آزادی در سیستم ثبت شد",
    locationName: "برج آزادی",
    locationId: "3",
    date: "۱۴۰۳/۰۱/۲۵",
  },
  {
    id: "4",
    type: "photo",
    title: "تصویر آپلود شد",
    description: "تصویر جدیدی از کاخ گلستان آپلود کردید",
    locationName: "کاخ گلستان",
    locationId: "4",
    date: "۱۴۰۳/۰۱/۲۰",
  },
];

const filterOptions = [
  { value: "all", label: "همه فعالیت‌ها" },
  { value: "review", label: "نظرات" },
  { value: "favorite", label: "علاقه‌مندی‌ها" },
  { value: "visit", label: "بازدیدها" },
  { value: "photo", label: "تصاویر" },
];

const typeConfig: Record<
  ActivityType,
  { iconPath: string; color: string; bg: string; border: string; filled: boolean }
> = {
  review: {
    iconPath:
      "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    color: "text-[#FF007A]",
    bg: "bg-[#FF007A]/10",
    border: "border-[#FF007A]/30",
    filled: false,
  },
  favorite: {
    iconPath:
      "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    color: "text-[#ff6b9d]",
    bg: "bg-[#ff6b9d]/10",
    border: "border-[#ff6b9d]/30",
    filled: true,
  },
  visit: {
    iconPath:
      "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    color: "text-[#00ff85]",
    bg: "bg-[#00ff85]/10",
    border: "border-[#00ff85]/30",
    filled: false,
  },
  photo: {
    iconPath:
      "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z",
    color: "text-[#A020F0]",
    bg: "bg-[#A020F0]/10",
    border: "border-[#A020F0]/30",
    filled: false,
  },
};

function ActivityIcon({ type }: { type: ActivityType }) {
  const cfg = typeConfig[type];
  return (
    <div
      className={`flex-shrink-0 w-10 h-10 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center`}
    >
      <svg
        className={`w-5 h-5 ${cfg.color}`}
        fill={cfg.filled ? "currentColor" : "none"}
        stroke={cfg.filled ? "none" : "currentColor"}
        viewBox="0 0 24 24"
      >
        {cfg.iconPath.includes("M15 13") ? (
          <>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </>
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={cfg.filled ? 0 : 2}
            d={cfg.iconPath}
          />
        )}
      </svg>
    </div>
  );
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities = [], isLoading = false }) => {
  const [filter, setFilter] = useState("all");

  const displayActivities = activities.length > 0 ? activities : mockActivities;

  const filteredActivities =
    filter === "all" ? displayActivities : displayActivities.filter((a) => a.type === filter);

  if (isLoading) {
    return (
      <div className="bg-[#121212] border border-[#333] rounded-2xl p-6">
        <div className="space-y-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#222] flex-shrink-0" />
              <div className="flex-1 space-y-2.5 py-1">
                <div className="h-4 bg-[#222] rounded w-3/4" />
                <div className="h-3 bg-[#222] rounded w-1/2" />
                <div className="h-3 bg-[#222] rounded w-1/4" />
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
              className="w-5 h-5 text-[#A020F0]"
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
            تاریخچه فعالیت‌ها
          </h2>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#A020F0]/10 border border-[#A020F0]/20 text-[#A020F0]">
            {filteredActivities.length} فعالیت
          </span>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                filter === opt.value
                  ? "bg-gradient-to-r from-[#A020F0] to-[#FF007A] text-white shadow-lg shadow-[#A020F0]/20"
                  : "bg-[#1a1a1a] border border-[#333] text-[#a0a0a0] hover:border-[#A020F0] hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Timeline */}
        {filteredActivities.length > 0 ? (
          <div className="space-y-1">
            {filteredActivities.map((activity, index) => {
              const isLast = index === filteredActivities.length - 1;
              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline connector */}
                  <div className="flex flex-col items-center">
                    <ActivityIcon type={activity.type} />
                    {!isLast && (
                      <div className="w-px flex-1 mt-1 mb-1 bg-gradient-to-b from-[#333] to-transparent min-h-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 min-w-0 pb-5 ${isLast ? "" : ""}`}>
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#333] rounded-xl p-4 transition-colors duration-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-white leading-snug">
                            {activity.title}
                          </h3>
                          <p className="text-xs text-[#a0a0a0] mt-1 leading-relaxed">
                            {activity.description}
                          </p>
                          {/* Location link */}
                          <div className="flex items-center gap-1.5 mt-2">
                            <svg
                              className="w-3.5 h-3.5 text-[#555] flex-shrink-0"
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
                            <span className="text-xs text-[#FF007A] hover:text-[#ff339c] cursor-pointer transition-colors">
                              {activity.locationName}
                            </span>
                          </div>
                        </div>
                        {/* Date */}
                        <span className="flex-shrink-0 text-xs text-[#555] mt-0.5 whitespace-nowrap">
                          {activity.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A020F0]/10 border border-[#A020F0]/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#A020F0]"
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
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              {filter === "all"
                ? "هنوز فعالیتی ثبت نشده است"
                : `هیچ ${filterOptions.find((f) => f.value === filter)?.label} یافت نشد`}
            </h3>
            <p className="text-sm text-[#a0a0a0] mb-6">
              شروع به استفاده از سایت کنید تا فعالیت‌هایتان اینجا نمایش داده شود
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A020F0] to-[#FF007A] text-white text-sm font-medium hover:shadow-lg hover:shadow-[#A020F0]/30 transition-all duration-300 transform hover:scale-105">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              شروع کاوش
            </button>
          </div>
        )}

        {/* Load more */}
        {filteredActivities.length >= 10 && (
          <div className="text-center mt-6 pt-6 border-t border-[#222]">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#333] text-sm text-[#a0a0a0] hover:border-[#A020F0] hover:text-white transition-all duration-200">
              نمایش بیشتر
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
