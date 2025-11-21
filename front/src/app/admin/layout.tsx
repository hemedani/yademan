"use client";

import "../globals.css";
import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import AdminSidebar from "@/components/organisms/AdminSidebar";
import "@/app/dark-theme.css";

interface AdminLayoutProps {
  children: ReactNode;
}

function InnerAdminLayout({ children }: AdminLayoutProps) {
  const { user, userLevel, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && mounted) {
      if (
        !user ||
        (userLevel !== "Manager" &&
          userLevel !== "Editor" &&
          userLevel !== "Ghost")
      ) {
        router.push("/login");
        return;
      }
    }
  }, [user, userLevel, loading, mounted, router]);

  const formatPersianTime = (date: Date): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const timeString = date.toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tehran",
    });
    return timeString.replace(
      /[0-9]/g,
      (digit) => persianDigits[parseInt(digit)],
    );
  };

  const formatPersianDate = (date: Date): string => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
      timeZone: "Asia/Tehran",
    }).format(date);
  };

  if (loading || !mounted) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center"
        dir="rtl"
        style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
      >
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-pink-500/30 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              در حال بارگذاری پنل مدیریت
            </h2>
            <p className="text-gray-300">لطفاً منتظر بمانید...</p>
          </div>
          <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-pink-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (
    !user ||
    (userLevel !== "Manager" && userLevel !== "Editor" && userLevel !== "Ghost")
  ) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900 flex items-center justify-center"
        dir="rtl"
        style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
      >
        <div className="max-w-md mx-auto text-center space-y-8 p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-white">دسترسی محدود شده</h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              شما مجوز دسترسی به این بخش را ندارید. لطفاً با حساب کاربری مدیر یا
              ویراستار وارد شوید.
            </p>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-pink-400">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>فقط مدیران و ویراستاران اجازه ورود دارند</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              ورود به حساب کاربری
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 border border-gray-700"
            >
              بازگشت به صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900"
      dir="rtl"
      style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
    >
      <AdminSidebar />

      {/* Main Content */}
      <div className="mr-80 transition-all duration-300 ease-in-out">
        {/* Top Header Bar */}
        <header className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/60 stic/ky top-0 z-40 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                    پنل مدیریت نقشه ایران
                  </h1>
                  <p className="text-sm text-gray-400 mt-1">
                    سامانه مدیریت مکان‌های فرهنگی و تاریخی
                  </p>
                </div>

                <div className="hidden lg:flex items-center space-x-6 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-300">
                      آنلاین
                    </span>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="w-px h-4 bg-gray-600"></div>
                  <div className="text-sm text-gray-400">
                    {formatPersianTime(currentTime)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                {/* Quick Search */}
                <div className="relative hidden md:block">
                  <input
                    type="text"
                    placeholder="جستجو در سیستم..."
                    className="w-64 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-white"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Notifications */}
                <button className="relative p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all duration-200 group border border-gray-700">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    ۳
                  </span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => router.push("/admin/settings")}
                  className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all duration-200 border border-gray-700"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>

                {/* Full Screen */}
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }}
                  className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all duration-200 border border-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-full mx-auto">{children}</div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-700/60 bg-gray-900/50 backdrop-blur-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center space-x-6">
                <span>© ۱۴۰۳ پنل مدیریت نقشه ایران</span>
                <span>•</span>
                <span>{formatPersianDate(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-6">
                <span>نسخه ۱.۰.۰</span>
                <span>•</span>
                <span className="flex items-center space-x-2">
                  <span>ساخته شده با</span>
                  <span className="text-pink-500">❤️</span>
                  <span>برای ایران</span>
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Quick Actions */}
      <div className="fixed bottom-8 left-8 z-50">
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 p-2 space-y-2">
          <button
            onClick={() => router.push("/admin/places/create")}
            className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-pink-500/20 transform hover:-translate-y-1"
            title="افزودن مکان جدید"
          >
            <svg
              className="w-5 h-5 transition-transform group-hover:rotate-45"
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
          </button>

          <button
            onClick={() => router.push("/admin/comments")}
            className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-green-500/20 transform hover:-translate-y-1"
            title="نظرات درانتظار"
          >
            <svg
              className="w-5 h-5"
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
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
            title="مشاهده سایت اصلی"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>
    </div>
  );
}

// Wrapper component that provides AuthProvider
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <html>
      <body className="overflow-x-hidden">
        <AuthProvider>
          <InnerAdminLayout>{children}</InnerAdminLayout>
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                fontSize: "14px",
                maxWidth: "90vw",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
