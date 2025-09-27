"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import MobileNavBar from "@/components/layout/MobileNavBar";
import MapView from "@/components/map/MapView";
import FilterPanel from "@/components/filters/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";
import { useMapStore } from "@/stores/mapStore";
import toast from "react-hot-toast";

// Dynamic imports for heavy components
const SearchPanel = dynamic(() => import("@/components/search/SearchPanel"), {
  ssr: false,
});

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { isAuthenticated, displayName, loading } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isFilterOpen, toggleFilter, closeFilter } = useFilterPanel();
  const { searchQuery, setSearchQuery } = useMapStore();

  // PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setShowInstallPrompt(true);
      window.deferredPrompt = e;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    const prompt = window.deferredPrompt;
    if (!prompt) return;

    prompt.prompt();
    const result = await prompt.userChoice;

    if (result.outcome === "accepted") {
      toast.success("برنامه با موفقیت نصب شد!");
    }

    window.deferredPrompt = null;
    setShowInstallPrompt(false);
  };

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      setSearchQuery(value);
    },
    [setSearchQuery],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setShowSearch(false);
      // Trigger map search
      setSearchQuery(searchValue);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
      }
      // Escape to close panels
      if (e.key === "Escape") {
        setShowSearch(false);
        closeFilter();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [closeFilter]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Top Bar - Fixed */}
      <TopBar
        onFilterClick={toggleFilter}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <main className="relative pt-16 pb-14 md:pb-0 h-full w-full">
        {/* Welcome Animation for First Visit */}
        <AnimatePresence>
          {!isMapLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500"
            >
              <div className="text-center text-white p-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 1 }}
                  className="mb-8"
                >
                  <svg
                    className="w-32 h-32 mx-auto text-white drop-shadow-2xl"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold mb-4"
                >
                  یادمان
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl mb-8 opacity-90"
                >
                  {t("tagline")}
                </motion.p>
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={() => setIsMapLoaded(true)}
                  className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  شروع کاوش
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isMapLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          {/* Welcome Banner for Authenticated Users */}
          <AnimatePresence>
            {isAuthenticated &&
              showWelcome &&
              displayName &&
              !loading &&
              isMapLoaded && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="absolute top-4 left-4 right-4 z-30 pointer-events-none"
                >
                  <div className="pointer-events-auto mx-auto max-w-md">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="relative"
                          >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {displayName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="absolute -bottom-1 -right-1 rtl:-left-1 rtl:right-auto w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                          </motion.div>
                          <div>
                            <motion.p
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="text-base font-bold text-gray-900"
                            >
                              {t("welcome")}, {displayName.split(" ")[0]}! ✨
                            </motion.p>
                            <motion.p
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-sm text-gray-600"
                            >
                              {t("exploreLocations")}
                            </motion.p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowWelcome(false)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all"
                          aria-label="Dismiss welcome message"
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
                        </motion.button>
                      </div>

                      {/* Quick Actions */}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-2 mt-4"
                      >
                        <button className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                          📍 مکان‌های نزدیک
                        </button>
                        <button className="flex-1 py-2 px-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                          ⭐ علاقه‌مندی‌ها
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Map View */}
          {isMapLoaded && <MapView className="h-full" />}

          {/* Floating Action Button for Mobile */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSearch(!showSearch)}
            className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30"
            aria-label="Search"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>

          {/* Advanced Search Panel */}
          <AnimatePresence>
            {showSearch && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                  onClick={() => setShowSearch(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50"
                >
                  <SearchPanel
                    onClose={() => setShowSearch(false)}
                    onSearch={handleSearchChange}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Filter Panel Overlay */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pt-16 pb-14"
                  onClick={closeFilter}
                />

                <motion.div
                  initial={{ x: -400, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -400, opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed top-16 left-0 bottom-14 md:bottom-0 w-full md:w-96 bg-white shadow-2xl z-50 overflow-y-auto"
                >
                  <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2">
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
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                      </svg>
                      {t("filters")}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeFilter}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
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
                    </motion.button>
                  </div>
                  <div className="p-6">
                    <FilterPanel />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* PWA Install Prompt */}
          <AnimatePresence>
            {showInstallPrompt && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4 z-40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
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
                          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">نصب برنامه یادمان</p>
                      <p className="text-sm opacity-90">دسترسی آسان و آفلاین</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="px-4 py-2 bg-white text-blue-600 rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      نصب
                    </button>
                    <button
                      onClick={() => setShowInstallPrompt(false)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <MobileNavBar />
    </div>
  );
}

// Extend window interface for PWA
declare global {
  interface Window {
    deferredPrompt: any;
  }
}
