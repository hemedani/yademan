"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/layout/TopBar";
import MapView from "@/components/map/MapView";
import { useFilterPanel } from "@/hooks/useFilterPanel";
import { useMapStore } from "@/stores/mapStore";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import TimelineSlider from "@/components/organisms/TimelineSlider";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const params = useParams();
  const locale = params.locale as string;
  const [searchValue, setSearchValue] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const { isFilterOpen, toggleFilter, closeFilter } = useFilterPanel();
  const { searchQuery, setSearchQuery, getCurrentBounds, filters } =
    useMapStore();

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
      />

      {/* Main Content */}
      <main className="relative h-screen w-screen overflow-hidden">
        {/* Welcome Animation for First Visit */}
        <AnimatePresence>
          {!isMapLoaded && (
            <div className="absolute inset-0 z-50 overflow-hidden">
              {/* Video Background */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="welcome-video absolute inset-0 w-full h-full object-cover"
                style={{
                  zIndex: -2,
                }}
                poster="/images/iran-heritage-poster.jpg" // Placeholder for faster initial loading
              >
                <source src="/videos/iran-heritage-01.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Overlay with blur and subtle pattern */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#121212]/80 to-black/90 z-[-1]"
                style={{ backdropFilter: "blur(1px)" }}
              />

              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center text-white p-8 relative z-10 max-w-3xl mx-auto">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 1 }}
                    className="mb-8"
                  >
                    <div className="relative inline-block">
                      <svg
                        className="w-32 h-32 mx-auto drop-shadow-[0_0_8px_rgba(255,0,122,0.7)]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div className="absolute -inset-4 rounded-full border border-[#FF007A]/30 animate-pulse" />
                    </div>
                  </motion.div>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl md:text-6xl font-bold mb-4 relative"
                    style={{
                      textShadow: "0 0 10px #FF007A, 0 0 20px #FF007A",
                      color: "white",
                      fontFamily: "vazir-matn",
                    }}
                  >
                    یادمان
                    <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF007A] to-transparent"></div>
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg md:text-xl mb-8 opacity-90 mt-4"
                    style={{
                      textShadow: "0 0 8px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    {t("tagline")}
                  </motion.p>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    onClick={() => setIsMapLoaded(true)}
                    className="px-8 py-4 bg-[#121212]/80 backdrop-blur-md text-white rounded-xl font-semibold text-lg shadow-[0_0_15px_5px_rgba(255,0,122,0.3)] hover:shadow-[0_0_20px_8px_rgba(255,0,122,0.5)] transform hover:scale-105 transition-all duration-300 border border-[#FF007A]/50 relative overflow-hidden group"
                  >
                    <span className="relative z-10">شروع کاوش</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF007A]/10 to-[#A020F0]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isMapLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          {/* Map View - InteractiveMap handles fetching and displaying places */}
          {isMapLoaded && <MapView className="h-full" />}

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

          {/* Timeline Slider - Now uses fixed positioning from the component itself */}
          <TimelineSlider />
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
