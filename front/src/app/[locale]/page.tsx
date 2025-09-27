"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import TopBar from "@/components/layout/TopBar";
import MobileNavBar from "@/components/layout/MobileNavBar";
import MapView from "@/components/map/MapView";
import FilterPanel from "@/components/filters/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { isAuthenticated, displayName, loading } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const { isFilterOpen, toggleFilter, closeFilter } = useFilterPanel();

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    // Here you can add search functionality
  };

  return (
    <>
      {/* Top Bar - Fixed */}
      <TopBar
        onFilterClick={toggleFilter}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content - Full height map with proper padding for fixed bars */}
      <main className="pt-14 pb-14 h-screen overflow-hidden bg-gray-50">
        <div className="relative h-full w-full">
          {/* Welcome Banner for Authenticated Users */}
          {isAuthenticated && showWelcome && displayName && !loading && (
            <div className="absolute top-4 left-4 right-4 z-30">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-4 mx-auto max-w-md animate-in slide-in-from-top-5 duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {displayName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t("welcome")}, {displayName.split(" ")[0]}! 👋
                      </p>
                      <p className="text-xs text-gray-600">
                        {t("exploreLocations")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWelcome(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Dismiss welcome message"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Map - Full height */}
          <MapView className="h-full" />

          {/* Filter Panel Overlay */}
          {isFilterOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 pt-14 pb-14"
                onClick={closeFilter}
              />

              {/* Filter Panel */}
              <div className="fixed top-14 left-0 right-0 bottom-14 z-50 bg-white shadow-lg overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("filters")}
                  </h2>
                  <button
                    onClick={closeFilter}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close filters"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <FilterPanel />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation - Fixed */}
      <MobileNavBar />
    </>
  );
}
