"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileTabsProps {
  defaultTab?: string;
}

const tabs: Tab[] = [
  {
    id: "overview",
    label: "نمای کلی",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: "favorites",
    label: "علاقه‌مندی‌ها",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    id: "activity",
    label: "فعالیت‌ها",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "تنظیمات",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

const ProfileTabs: React.FC<ProfileTabsProps> = ({ defaultTab = "overview" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="bg-[#121212] border border-[#333] rounded-2xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center border-b border-[#333] px-2 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus:outline-none ${
                isActive ? "text-white" : "text-[#a0a0a0] hover:text-white"
              }`}
            >
              <span
                className={`transition-colors duration-200 ${
                  isActive ? "text-[#FF007A]" : "text-[#666] group-hover:text-[#a0a0a0]"
                }`}
              >
                {tab.icon}
              </span>
              {tab.label}

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF007A] to-[#A020F0]"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-6"
        >
          {activeTab === "overview" && <OverviewContent />}
          {activeTab === "favorites" && (
            <div className="text-center py-4">
              <p className="text-[#a0a0a0] text-sm">
                علاقه‌مندی‌های شما در بخش زیر نمایش داده می‌شود.
              </p>
            </div>
          )}
          {activeTab === "activity" && (
            <div className="text-center py-4">
              <p className="text-[#a0a0a0] text-sm">
                تاریخچه فعالیت‌های شما در بخش زیر نمایش داده می‌شود.
              </p>
            </div>
          )}
          {activeTab === "settings" && (
            <div className="text-center py-4">
              <p className="text-[#a0a0a0] text-sm">تنظیمات پروفایل شما در بخش زیر قابل ویرایش است.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function OverviewContent() {
  const stats = [
    {
      label: "مکان‌های بازدید شده",
      value: "۱۲",
      color: "text-[#FF007A]",
      bg: "bg-[#FF007A]/10",
      border: "border-[#FF007A]/20",
      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    },
    {
      label: "نظرات ثبت شده",
      value: "۸",
      color: "text-[#00ff85]",
      bg: "bg-[#00ff85]/10",
      border: "border-[#00ff85]/20",
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    },
    {
      label: "علاقه‌مندی‌ها",
      value: "۲۵",
      color: "text-[#A020F0]",
      bg: "bg-[#A020F0]/10",
      border: "border-[#A020F0]/20",
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
    },
  ];

  const recentActivities = [
    { dot: "bg-[#FF007A]", text: "نظر جدید برای تخت جمشید ثبت شد" },
    { dot: "bg-[#A020F0]", text: "میدان نقش جهان به علاقه‌مندی‌ها اضافه شد" },
    { dot: "bg-[#00ff85]", text: "بازدید از برج آزادی ثبت شد" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, color, bg, border, icon }) => (
          <div key={label} className={`${bg} border ${border} rounded-xl p-4 flex items-center gap-4`}>
            <div className={`${bg} border ${border} rounded-lg p-2.5 flex-shrink-0`}>
              <svg
                className={`w-5 h-5 ${color}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </div>
            <div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-[#a0a0a0] mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF007A] inline-block" />
          فعالیت‌های اخیر
        </h3>
        <div className="space-y-3">
          {recentActivities.map(({ dot, text }, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-[#a0a0a0]">
              <span className={`w-2 h-2 ${dot} rounded-full flex-shrink-0`} />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileTabs;
