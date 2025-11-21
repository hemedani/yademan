"use client";

import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  bgColor?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  bgColor = "bg-gradient-to-br from-blue-500 to-blue-600",
  icon,
  trend,
  onClick,
}) => {
  const formatPersianNumber = (num: number | string): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-lg border border-slate-200 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white rounded-2xl"></div>

      {/* Content */}
      <div className="relative">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-4">
          <div
            className={`p-3 rounded-xl ${bgColor} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            {icon || (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            )}
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div
              className={`flex items-center  space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend.isPositive
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <svg
                className={`w-3 h-3 ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    trend.isPositive
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
              <span>{formatPersianNumber(Math.abs(trend.value))}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-3">
          <div className="text-3xl font-bold text-slate-800 mb-1">
            {formatPersianNumber(value)}
          </div>
          <div className="text-lg font-semibold text-slate-700">{title}</div>
        </div>

        {/* Description */}
        <div className="text-sm text-slate-500 leading-relaxed">
          {description}
        </div>

        {/* Hover Effect Indicator */}
        {onClick && (
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Bottom Border Accent */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${bgColor} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      ></div>
    </div>
  );
};

// Enhanced version with more features
interface EnhancedStatCardProps extends StatCardProps {
  subtitle?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }>;
}

export const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({
  title,
  value,
  description,
  subtitle,
  bgColor = "bg-gradient-to-br from-blue-500 to-blue-600",
  icon,
  trend,
  actions,
  onClick,
}) => {
  const formatPersianNumber = (num: number | string): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  return (
    <div
      className={`group relative bg-white rounded-3xl shadow-lg border border-slate-200 p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/30 to-slate-100/20 rounded-3xl"></div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div
              className={`inline-flex p-4 rounded-2xl ${bgColor} text-white shadow-xl mb-4 group-hover:scale-110 transition-transform duration-300`}
            >
              {icon || (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
          </div>

          {/* Trend */}
          {trend && (
            <div
              className={`flex items-center  space-x-2 px-3 py-2 rounded-full text-sm font-semibold shadow-sm ${
                trend.isPositive
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              <svg
                className={`w-4 h-4 ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    trend.isPositive
                      ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                  }
                />
              </svg>
              <span>{formatPersianNumber(Math.abs(trend.value))}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-4">
          <div className="text-4xl font-black text-slate-800 mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            {formatPersianNumber(value)}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 leading-relaxed mb-6">{description}</p>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex items-center  space-x-3 pt-4 border-t border-slate-100">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className="flex items-center  space-x-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Shine Effect on Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  bgColor = "bg-gradient-to-r from-blue-500 to-blue-600",
  icon,
  onClick,
}) => {
  const formatPersianNumber = (num: number | string): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num
      .toString()
      .replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-md border border-slate-200 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
    >
      <div className="flex items-center  space-x-4">
        <div
          className={`p-3 rounded-lg ${bgColor} text-white shadow-md flex-shrink-0`}
        >
          {icon || (
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline  space-x-2">
            <div className="text-2xl font-bold text-slate-800">
              {formatPersianNumber(value)}
            </div>
            <div className="text-sm font-medium text-slate-700 truncate">
              {title}
            </div>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
