"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Link } from "../../../i18n/routing";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";

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
      <header
        className="flex items-center justify-between px-4 py-3 h-16"
        role="banner"
      >
        {/* Left side - Search or Admin Button */}
        <div className="flex-1 max-w-md">
          {isAdmin ? (
            <Link
              href="/admin/dashboard"
              aria-label={t("Navigation.adminPanelAriaLabel")}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all duration-200 touch-manipulation min-h-[48px] min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 hover:shadow-md active:scale-95"
            >
              <svg
                className="w-4 h-4 ltr:mr-2 rtl:ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
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
              <span>{t("HomePage.adminPanel")}</span>
            </Link>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 ltr:left-0 rtl:right-0 ltr:pl-4 rtl:pr-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 transition-all duration-200 touch-manipulation min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus:border-blue-500 hover:border-gray-400"
                placeholder={t("HomePage.searchPlaceholder")}
                aria-label={t("Navigation.searchAriaLabel")}
                role="searchbox"
                aria-expanded="false"
                aria-autocomplete="list"
              />
            </div>
          )}
        </div>

        {/* Right side - Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center justify-center w-12 h-12 ltr:ml-4 rtl:mr-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-95"
          title={t("Navigation.filterTooltip")}
          aria-label={t("Navigation.filterButtonAriaLabel")}
          type="button"
        >
          <AdjustmentsHorizontalIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </header>
    </div>
  );
}
