"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../../navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackToHome?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackToHome = true,
}) => {
  const t = useTranslations("Auth");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              ی
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">
              یادمان
            </span>
          </Link>
        </div>

        {/* Title */}
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      {/* Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>

        {/* Back to Home Link */}
        {showBackToHome && (
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              بازگشت به صفحه اصلی
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>© ۲۰۲۴ یادمان. تمامی حقوق محفوظ است.</p>
      </div>
    </div>
  );
};

export default AuthLayout;
