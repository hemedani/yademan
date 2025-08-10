"use client";
import React from "react";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-8 sm:pt-12 pb-6 sm:pb-8 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-right">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-700 pb-2">
              درباره ما
            </h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
              این پلتفرم با هدف تحلیل و بررسی علمی تصادفات رانندگی راه‌اندازی
              شده است. ما تلاش می‌کنیم با بهره‌گیری از داده‌های واقعی، بهبود
              ایمنی جاده‌ای و کاهش تلفات را با کمک تحلیل‌های هوشمند محقق کنیم.
            </p>
            <div className="flex justify-end space-x-3 space-x-reverse mt-4">
              {/* شبکه‌های اجتماعی با بهتر touch targets */}
              <a
                href="#"
                className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800"
                aria-label="فیسبوک"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800"
                aria-label="توییتر"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition p-2 rounded-lg hover:bg-gray-800"
                aria-label="اینستاگرام"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C7.284 0 6.944.012 5.877.06 2.246.227.227 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.056.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.056-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817C19.988 13.056 20 12.716 20 10s-.012-3.056-.06-4.123C19.833 2.245 17.815.227 14.183.06 13.056.012 12.716 0 10 0zm0 1.802c2.67 0 2.987.01 4.042.059 2.71.123 3.975 1.409 4.099 4.099.048 1.054.057 1.37.057 4.04 0 2.672-.009 2.988-.057 4.042-.124 2.687-1.387 3.975-4.1 4.099-1.054.048-1.37.058-4.041.058-2.67 0-2.987-.01-4.04-.058-2.717-.124-3.977-1.416-4.1-4.1-.048-1.054-.058-1.37-.058-4.041 0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1 1.054-.048 1.37-.058 4.04-.058zM10 4.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-700 pb-2">
              امکانات
            </h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <Link
                  href="/search"
                  className="text-gray-300 hover:text-white transition flex items-center p-1 rounded hover:bg-gray-800 min-h-[44px] touch-manipulation"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 ml-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>جستجوی پیشرفته تصادفات</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/reports"
                  className="text-gray-300 hover:text-white transition flex items-center p-1 rounded hover:bg-gray-800 min-h-[44px] touch-manipulation"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 ml-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M3 6h18M3 14h18M3 18h18"
                    />
                  </svg>
                  <span>گزارش‌های تحلیلی</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition flex items-center p-1 rounded hover:bg-gray-800 min-h-[44px] touch-manipulation"
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 ml-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 0v2a2 2 0 002 2h2a2 2 0 002-2v-2m-6 0h6"
                    />
                  </svg>
                  <span>داشبورد ایمنی جاده‌ها</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-700 pb-2">
              منابع مفید
            </h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="https://www.traffic-police.ir"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition p-1 rounded hover:bg-gray-800 min-h-[44px] touch-manipulation flex items-center"
                >
                  سایت پلیس راهور
                </a>
              </li>
              <li>
                <a
                  href="https://www.who.int/roadsafety"
                  target="_blank"
                  className="text-gray-300 hover:text-white transition p-1 rounded hover:bg-gray-800 min-h-[44px] touch-manipulation flex items-center"
                >
                  ایمنی جاده‌ای سازمان جهانی بهداشت
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-300 hover:text-white transition p-1 rounded hover:bg-gray-800 min-h-[44px] touch-manipulation flex items-center"
                >
                  سؤالات متداول
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 border-b border-gray-700 pb-2">
              تماس با ما
            </h3>
            <ul className="text-sm sm:text-base text-gray-300 space-y-3">
              <li className="flex items-center min-h-[32px]">
                <svg
                  className="w-4 h-4 ml-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                ایمیل: info@accident-analysis.ir
              </li>
              <li className="flex items-center min-h-[32px]">
                <svg
                  className="w-4 h-4 ml-2 flex-shrink-0"
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
                تلفن: ۰۲۱-۱۲۳۴۵۶۷۸
              </li>
              <li className="flex items-center min-h-[32px]">
                <svg
                  className="w-4 h-4 ml-2 flex-shrink-0"
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
                ساعات پاسخگویی: شنبه تا چهارشنبه، ۹ الی ۱۶
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-500 text-sm sm:text-base">
            © {currentYear} تحلیل تصادفات رانندگی | تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
};
