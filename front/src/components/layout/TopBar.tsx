"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Link } from "../../../i18n/routing";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

interface TopBarProps {
  onFilterClick?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function TopBar({
  onFilterClick,
  searchValue = "",
  onSearchChange,
}: TopBarProps) {
  const t = useTranslations();
  const { isAuthenticated, userLevel } = useAuth();
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const isAdmin =
    isAuthenticated && (userLevel === "Manager" || userLevel === "Ghost");

  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    onSearchChange?.(value);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* Left side - Search or Admin Button */}
        <div className="flex-1 max-w-md">
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors touch-manipulation min-h-[44px]"
            >
              <svg
                className="w-4 h-4 ltr:mr-2 rtl:ml-2"
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
              {t("HomePage.adminPanel")}
            </Link>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 pl-3 pr-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full ltr:pl-9 rtl:pr-9 ltr:pr-3 rtl:pl-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] touch-manipulation"
                placeholder={t("HomePage.searchPlaceholder")}
              />
            </div>
          )}
        </div>

        {/* Right side - Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center justify-center w-11 h-11 ltr:ml-3 rtl:mr-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
          title={t("Navigation.filterTooltip")}
          aria-label={t("Navigation.filterTooltip")}
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
