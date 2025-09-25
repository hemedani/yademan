"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  users?: number;
  places?: number;
  comments?: number;
  pendingComments?: number;
  approvedComments?: number;
  rejectedComments?: number;
  categories?: number;
  tags?: number;
  files?: number;
  visits?: number;
  favorites?: number;
  activeUsers?: number;
  newUsersThisMonth?: number;
  popularPlaces?: number;
  recentPlaces?: number;
}

interface AdminDashboardProps {
  data?: DashboardStats;
  token?: string;
}

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  change?: {
    value: number;
    trend: "up" | "down" | "neutral";
  };
  href?: string;
}

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data = {} }) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatPersianNumber = useCallback((num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  }, []);

  const formatPersianTime = useCallback((date: Date): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const timeString = date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Tehran",
    });
    return timeString.replace(
      /[0-9]/g,
      (digit) => persianDigits[parseInt(digit)],
    );
  }, []);

  const formatPersianDate = useCallback((date: Date): string => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: "Asia/Tehran",
    }).format(date);
  }, []);

  const statCards: StatCard[] = useMemo(
    () => [
      {
        title: "کل مکان‌ها",
        value: data?.places || 0,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
        color: "text-blue-600",
        bgGradient: "from-blue-500 to-blue-600",
        change: { value: 12, trend: "up" },
        href: "/admin/places",
      },
      {
        title: "کاربران فعال",
        value: data?.users || 0,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        ),
        color: "text-green-600",
        bgGradient: "from-green-500 to-green-600",
        change: { value: 8, trend: "up" },
        href: "/admin/users",
      },
      {
        title: "نظرات درانتظار",
        value: data?.pendingComments || 0,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "text-orange-600",
        bgGradient: "from-orange-500 to-orange-600",
        change: { value: 3, trend: "down" },
        href: "/admin/comments/pending",
      },
      {
        title: "بازدیدها",
        value: data?.visits || 0,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ),
        color: "text-purple-600",
        bgGradient: "from-purple-500 to-purple-600",
        change: { value: 25, trend: "up" },
        href: "/admin/reports",
      },
      {
        title: "دسته‌بندی‌ها",
        value: data?.categories || 0,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        ),
        color: "text-indigo-600",
        bgGradient: "from-indigo-500 to-indigo-600",
        change: { value: 2, trend: "neutral" },
        href: "/admin/categories",
      },
      {
        title: "فایل‌های آپلود شده",
        value: data.files || 0,
        icon: (
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        ),
        color: "text-pink-600",
        bgGradient: "from-pink-500 to-pink-600",
        change: { value: 15, trend: "up" },
        href: "/admin/files",
      },
    ],
    [data],
  );

  const quickActions: QuickAction[] = useMemo(
    () => [
      {
        title: "افزودن مکان جدید",
        description: "ثبت مکان فرهنگی و تاریخی جدید",
        href: "/admin/places/add",
        color: "text-blue-600",
        bgGradient: "from-blue-50 to-blue-100",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        ),
      },
      {
        title: "بررسی نظرات",
        description: "تأیید و مدیریت نظرات کاربران",
        href: "/admin/comments/pending",
        color: "text-green-600",
        bgGradient: "from-green-50 to-green-100",
        icon: (
          <svg
            className="w-10 h-10"
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
        ),
      },
      {
        title: "مشاهده آمار",
        description: "گزارشات تفصیلی از عملکرد سایت",
        href: "/admin/reports",
        color: "text-purple-600",
        bgGradient: "from-purple-50 to-purple-100",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
        title: "تنظیمات سایت",
        description: "مدیریت تنظیمات عمومی سیستم",
        href: "/admin/settings",
        color: "text-orange-600",
        bgGradient: "from-orange-50 to-orange-100",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
      {
        title: "مدیریت شهرها",
        description: "افزودن و ویرایش شهرهای کشور",
        href: "/admin/city",
        color: "text-teal-600",
        bgGradient: "from-teal-50 to-teal-100",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
      },
      {
        title: "مدیریت مناطق شهری",
        description: "تعریف و سازماندهی مناطق شهری",
        href: "/admin/city-zone",
        color: "text-indigo-600",
        bgGradient: "from-indigo-50 to-indigo-100",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
      {
        title: "مدیریت استان‌ها",
        description: "افزودن و ویرایش استان‌های کشور",
        href: "/admin/province",
        color: "text-rose-600",
        bgGradient: "from-rose-50 to-rose-100",
        icon: (
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
      },
    ],
    [],
  );

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return (
          <svg
            className="w-4 h-4 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            className="w-4 h-4 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">خوش آمدید!</h1>
              <p className="text-blue-100 text-lg">
                آمار و وضعیت کلی سیستم مدیریت نقشه ایران
              </p>
              <div className="flex items-center space-x-reverse space-x-4 text-sm text-blue-100 mt-4">
                <div className="flex items-center space-x-reverse space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>سیستم فعال</span>
                </div>
                <div className="w-px h-4 bg-blue-300"></div>
                {mounted ? (
                  <>
                    <span>{formatPersianDate(currentTime)}</span>
                    <div className="w-px h-4 bg-blue-300"></div>
                    <span>{formatPersianTime(currentTime)}</span>
                  </>
                ) : (
                  <>
                    <span>در حال بارگذاری...</span>
                    <div className="w-px h-4 bg-blue-300"></div>
                    <span>--:--:--</span>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
            onClick={() => card.href && router.push(card.href)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${card.bgGradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {card.icon}
                </div>
                {card.change && (
                  <div className="flex items-center space-x-reverse space-x-1">
                    {getTrendIcon(card.change.trend)}
                    <span
                      className={`text-sm font-medium ${
                        card.change.trend === "up"
                          ? "text-green-600"
                          : card.change.trend === "down"
                            ? "text-red-600"
                            : "text-gray-600"
                      }`}
                    >
                      %{formatPersianNumber(card.change.value)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-800">
                  {formatPersianNumber(card.value)}
                </h3>
                <p className="text-slate-600 font-medium">{card.title}</p>
              </div>
            </div>
            <div className={`h-1 bg-gradient-to-r ${card.bgGradient}`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
              اقدامات سریع
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={action.title}
                  className={`bg-gradient-to-r ${action.bgGradient} p-6 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
                  onClick={() => router.push(action.href)}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center space-x-reverse space-x-4">
                    <div
                      className={`${action.color} group-hover:scale-110 transition-transform duration-300`}
                    >
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold ${action.color} mb-1`}>
                        {action.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                    <div
                      className={`${action.color} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full mr-3"></div>
              وضعیت سیستم
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-green-800">
                      پایگاه داده
                    </span>
                  </div>
                  <div className="text-green-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-green-600 mt-2">متصل</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-blue-800">API سرور</span>
                  </div>
                  <div className="text-blue-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-blue-600 mt-2">سالم</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-medium text-purple-800">
                      فضای ذخیره
                    </span>
                  </div>
                  <div className="text-purple-600">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-purple-600 mt-2">در دسترس</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities & Performance */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-orange-500 to-red-600 rounded-full mr-3"></div>
              فعالیت‌های اخیر
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-reverse space-x-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-r-4 border-blue-500">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">کاربر جدید</h4>
                  <p className="text-sm text-slate-600">
                    علی محمدی به سیستم پیوست
                  </p>
                </div>
                <span className="text-sm text-slate-500">۱۰ دقیقه پیش</span>
              </div>

              <div className="flex items-center space-x-reverse space-x-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-r-4 border-green-500">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">
                    مکان تایید شد
                  </h4>
                  <p className="text-sm text-slate-600">
                    باغ ارم شیراز تایید و منتشر شد
                  </p>
                </div>
                <span className="text-sm text-slate-500">۲۰ دقیقه پیش</span>
              </div>

              <div className="flex items-center space-x-reverse space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-r-4 border-yellow-500">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
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
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">نظر جدید</h4>
                  <p className="text-sm text-slate-600">
                    نظر جدید منتظر بررسی است
                  </p>
                </div>
                <span className="text-sm text-slate-500">۱ ساعت پیش</span>
              </div>

              <div className="flex items-center space-x-reverse space-x-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-r-4 border-purple-500">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">فایل آپلود</h4>
                  <p className="text-sm text-slate-600">
                    تصاویر جدید به گالری اضافه شد
                  </p>
                </div>
                <span className="text-sm text-slate-500">۲ ساعت پیش</span>
              </div>

              <button
                onClick={() => router.push("/admin/reports")}
                className="w-full text-center py-3 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 border-t border-slate-100"
              >
                مشاهده همه فعالیت‌ها
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full mr-3"></div>
              عملکرد سیستم
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPersianNumber(98)}%
                </div>
                <p className="text-slate-600 font-medium">سرعت سایت</p>
                <div className="mt-3 bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "98%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatPersianNumber(99.9)}%
                </div>
                <p className="text-slate-600 font-medium">دسترسی سرور</p>
                <div className="mt-3 bg-green-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "99.9%" }}
                  ></div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatPersianNumber(1.2)}s
                </div>
                <p className="text-slate-600 font-medium">زمان پاسخ</p>
                <div className="mt-3 bg-purple-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "80%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          سیستم مدیریت نقشه ایران آماده خدمات‌رسانی است
        </h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
          تمام اجزای سیستم به درستی کار می‌کند و آماده ارائه خدمات به کاربران
          عزیز است. برای دسترسی سریع از منوی کناری یا اقدامات سریع استفاده کنید.
        </p>
        <div className="flex items-center justify-center space-x-reverse space-x-6 text-sm text-slate-500">
          <span>آخرین به‌روزرسانی: {formatPersianTime(currentTime)}</span>
          <span>•</span>
          <span>نسخه ۱.۰.۰</span>
          <span>•</span>
          <span>شیراز، ایران</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
