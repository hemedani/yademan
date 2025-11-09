"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import TopBar from "@/components/layout/TopBar";
import MapView from "@/components/map/MapView";
import FilterPanel from "@/components/filters/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";
import { useMapStore } from "@/stores/mapStore";
import toast from "react-hot-toast";
import PlaceDetailsModal from "@/components/organisms/PlaceDetailsModal";
import { PlaceData } from "@/components/atoms/PlaceMarker";
import MyVertualTour from "@/components/organisms/MyVertualTour";
import { getLesanBaseUrl } from "@/services/api";
import { useParams } from "next/navigation";

// Extended PlaceData with virtual tours for HomePage
interface ExtendedPlaceData extends PlaceData {
  virtual_tours?: {
    _id: string;
    name: string;
    description?: string;
    panorama: {
      _id?: string;
      name: string;
    };
    hotspots?: {
      pitch: number;
      yaw: number;
      description?: string;
      target?: string;
    }[];
    status: "draft" | "active" | "archived";
  }[];
}

// Dynamic imports for heavy components
const SearchPanel = dynamic(() => import("@/components/search/SearchPanel"), {
  ssr: false,
});

export default function HomePage() {
  const t = useTranslations("HomePage");
  const params = useParams();
  const locale = params.locale as string;
  const { isAuthenticated, displayName, loading } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<ExtendedPlaceData | null>(
    null,
  );
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const [selectedVirtualTour, setSelectedVirtualTour] = useState<any>(null);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const [tourError, setTourError] = useState<string | null>(null);
  const { isFilterOpen, toggleFilter, closeFilter } = useFilterPanel();
  const { searchQuery, setSearchQuery, getCurrentBounds, filters } =
    useMapStore();
  const [showTourDemo, setShowTourDemo] = useState(false);
  const [tourDemoDismissed, setTourDemoDismissed] = useState(false);

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

  // Auto-hide welcome screen after a delay when map is loaded
  useEffect(() => {
    if (isMapLoaded && showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isMapLoaded, showWelcome]);

  // Handle virtual tour launch
  const handleLaunchVirtualTour = (tourId: string) => {
    setTourError(null);
    setIsTourLoading(true);

    // Reset any existing tour first
    setSelectedVirtualTour(null);

    if (
      !selectedPlace?.virtual_tours ||
      selectedPlace.virtual_tours.length === 0
    ) {
      console.warn("No virtual tours available for this place");
      setTourError("This place does not have virtual tours available");
      setIsTourLoading(false);
      return;
    }

    const tour = selectedPlace.virtual_tours.find(
      (tour) => tour._id === tourId,
    );

    if (tour && tour.panorama && tour.panorama.name) {
      console.log("Loading virtual tour:", tour.panorama.name);

      // Check if the panorama URL is valid
      const panoramaUrl = `${getLesanBaseUrl()}/uploads/images/${tour.panorama.name}`;

      // Set the tour and close the place details
      setSelectedVirtualTour(tour);
      setShowPlaceDetails(false);
      setIsTourLoading(false);
    } else {
      console.error("Virtual tour is missing panorama image:", tour);
      setTourError("This virtual tour is missing its panorama image");
      setIsTourLoading(false);
    }
  };

  // Close the virtual tour
  const handleCloseTour = () => {
    setSelectedVirtualTour(null);
    setTourError(null);
    setIsTourLoading(false);
  };

  const handleCloseTourDemo = () => {
    setShowTourDemo(false);
  };

  // Demo tour launch
  const handleLaunchTourDemo = () => {
    setShowTourDemo(true);
    setTourDemoDismissed(true);
    toast.success(t("Virtual Tour Started"), {
      position: "bottom-center",
    });
  };

  // Dismiss tour promo
  const handleDismissTourPromo = () => {
    setTourDemoDismissed(true);
  };

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
        onFilterClickAction={async () => toggleFilter()}
        searchValue={searchValue}
        onSearchChangeAction={async (value) => handleSearchChange(value)}
        onSearchSubmitAction={async (value) => {
          setSearchQuery(value);
          setSearchValue(value);
          setShowSearch(false);
        }}
        locale={locale}
        _filterOpen={isFilterOpen}
      />

      {/* Main Content */}
      <main className="relative pb-14 md:pb-0 h-full w-full">
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

          {/* Map View - InteractiveMap handles fetching and displaying places */}
          {isMapLoaded && <MapView className="h-full" />}

          {/* Place Details Modal */}
          {selectedPlace && showPlaceDetails && (
            <PlaceDetailsModal
              place={selectedPlace}
              onClose={() => setShowPlaceDetails(false)}
              onLaunchVirtualTour={handleLaunchVirtualTour}
            />
          )}

          {/***  Virtual Tour Viewer   **/}
          {selectedVirtualTour &&
            selectedVirtualTour.panorama &&
            selectedVirtualTour.panorama.name && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
                {/* Tour Header */}
                <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
                  <h2 className="text-lg font-medium">
                    {selectedPlace?.name || "Virtual Tour"}
                  </h2>
                  <button
                    onClick={handleCloseTour}
                    className="p-1 rounded-full hover:bg-gray-700"
                    aria-label="Close tour"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
                {/* Tour Viewer */}
                <div className="flex-1">
                  <MyVertualTour
                    imageUrl={`${getLesanBaseUrl()}/uploads/images/${selectedVirtualTour.panorama.name}`}
                  />
                </div>
              </div>
            )}

          {/* Tour Error Message */}
          {tourError && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg max-w-md text-center">
                <div className="text-red-500 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Virtual Tour Error
                </h3>
                <p className="text-gray-600 mb-4">{tourError}</p>
                <button
                  onClick={handleCloseTour}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}

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
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    bounce: 0.2,
                  }}
                  className="fixed top-20 left-1/2 transform -translate-x-1/2 w-[95%] max-w-xl max-h-[85vh] bg-[#121212] shadow-2xl rounded-2xl z-50 overflow-hidden flex flex-col border border-[#333]"
                >
                  <div className="sticky top-0 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
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
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
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
                  <div className="p-5 overflow-y-auto bg-[#121212] text-white">
                    <FilterPanel />
                  </div>
                  <div className="sticky bottom-0 bg-gradient-to-b from-transparent to-[#121212] pt-6 pb-4 px-6 border-t border-[#333]">
                    <button
                      onClick={closeFilter}
                      className="w-full bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white py-3 rounded-lg font-medium transition-all hover:shadow-lg active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus:ring-offset-2"
                    >
                      {t("applyFilters")}
                    </button>
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
    </div>
  );
}

// Extend window interface for PWA
declare global {
  interface Window {
    deferredPrompt: any;
  }
}
