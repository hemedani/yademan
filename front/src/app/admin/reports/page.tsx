"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ReportData {
  totalPlaces: number;
  totalUsers: number;
  totalComments: number;
  totalViews: number;
  pendingPlaces: number;
  activeUsers: number;
  monthlyGrowth: {
    places: number;
    users: number;
    views: number;
  };
  topCategories: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: "place_added" | "user_registered" | "comment_posted" | "place_approved";
    description: string;
    timestamp: string;
    user?: string;
  }>;
}

export default function ReportsPage() {
  const router = useRouter();
  const { user, userLevel } = useAuth();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("7"); // days
  const [selectedReport, setSelectedReport] = useState<string>("overview");

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockData: ReportData = {
        totalPlaces: 156,
        totalUsers: 2340,
        totalComments: 891,
        totalViews: 45670,
        pendingPlaces: 12,
        activeUsers: 1890,
        monthlyGrowth: {
          places: 8.5,
          users: 15.2,
          views: 22.1,
        },
        topCategories: [
          { name: "رستوران", count: 45, percentage: 28.8 },
          { name: "پارک", count: 32, percentage: 20.5 },
          { name: "موزه", count: 28, percentage: 17.9 },
          { name: "مسجد", count: 23, percentage: 14.7 },
          { name: "مرکز خرید", count: 18, percentage: 11.5 },
        ],
        recentActivity: [
          {
            id: "1",
            type: "place_added",
            description: "مکان جدید 'رستوران سنتی شیرازی' اضافه شد",
            timestamp: "2024-01-20T14:30:00Z",
            user: "احمد محمدی"
          },
          {
            id: "2",
            type: "user_registered",
            description: "کاربر جدید ثبت نام کرد",
            timestamp: "2024-01-20T13:45:00Z",
            user: "فاطمه احمدی"
          },
          {
            id: "3",
            type: "place_approved",
            description: "مکان 'باغ ارم' تأیید شد",
            timestamp: "2024-01-20T12:15:00Z",
            user: "علی رضایی"
          },
          {
            id: "4",
            type: "comment_posted",
            description: "نظر جدید برای 'آرامگاه حافظ' ثبت شد",
            timestamp: "2024-01-20T11:30:00Z",
            user: "مریم حسینی"
          },
        ],
      };

      setReportData(mockData);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPersianNumber = (num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const formatPersianDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Tehran'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "place_added":
        return "📍";
      case "user_registered":
        return "👤";
      case "comment_posted":
        return "💬";
      case "place_approved":
        return "✅";
      default:
        return "📊";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "place_added":
        return "bg-blue-100 text-blue-600";
      case "user_registered":
        return "bg-green-100 text-green-600";
      case "comment_posted":
        return "bg-purple-100 text-purple-600";
      case "place_approved":
        return "bg-emerald-100 text-emerald-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">در حال بارگذاری گزارشات...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-slate-600 mb-2">خطا در بارگذاری گزارشات</h3>
          <p className="text-slate-500">لطفاً دوباره تلاش کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                گزارشات و آمار
              </h1>
              <p className="text-slate-600 mt-2">
                آمار و گزارشات جامع از وضعیت سایت
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">امروز</option>
                <option value="7">هفته گذشته</option>
                <option value="30">ماه گذشته</option>
                <option value="90">سه ماه گذشته</option>
                <option value="365">سال گذشته</option>
              </select>

              <button
                onClick={loadReportData}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                به‌روزرسانی
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">
                +{formatPersianNumber(reportData.monthlyGrowth.places)}%
              </span>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">کل مکان‌ها</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatPersianNumber(reportData.totalPlaces)}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">
                +{formatPersianNumber(reportData.monthlyGrowth.users)}%
              </span>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">کل کاربران</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatPersianNumber(reportData.totalUsers)}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-blue-500 text-sm font-medium">
                {formatPersianNumber(reportData.pendingPlaces)} در انتظار
              </span>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">کل نظرات</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatPersianNumber(reportData.totalComments)}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-green-500 text-sm font-medium">
                +{formatPersianNumber(reportData.monthlyGrowth.views)}%
              </span>
            </div>
            <div>
              <p className="text-slate-600 text-sm mb-1">کل بازدیدها</p>
              <p className="text-2xl font-bold text-slate-800">
                {formatPersianNumber(reportData.totalViews)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categories */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              محبوب‌ترین دسته‌بندی‌ها
            </h3>
            <div className="space-y-4">
              {reportData.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {formatPersianNumber(index + 1)}
                    </div>
                    <span className="font-medium text-slate-700">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-16 text-left">
                      {formatPersianNumber(category.count)} مکان
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              فعالیت‌های اخیر
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {reportData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200">
                  <div className={`p-2 rounded-lg text-sm ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 text-sm font-medium mb-1">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{formatPersianDate(activity.timestamp)}</span>
                      {activity.user && (
                        <span>توسط {activity.user}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export Actions */}
        <div className="mt-8 bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            خروجی گزارشات
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              دانلود Excel
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              دانلود PDF
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              اشتراک‌گذاری
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
