"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Link } from "../../../i18n/routing";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";

interface TopBarProps {
  onFilterClickAction?: () => Promise<void>;
  searchValue: string;
  onSearchChangeAction?: (value: string) => Promise<void>;
  onSearchSubmitAction?: (value: string) => Promise<void>;
  locale?: string;
  // Client-side state flags
  _filterOpen?: boolean;
  _searchOpen?: boolean;
  _eventsOpen?: boolean;
}

export default function TopBar({
  onFilterClickAction,
  searchValue = "",
  onSearchChangeAction,
  onSearchSubmitAction,
  locale = "fa",
  _filterOpen = false,
  _searchOpen = false,
  _eventsOpen = false,
}: TopBarProps) {
  const t = useTranslations();
  const { isAuthenticated, displayName, initials, userLevel, logout, user } =
    useAuth();
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // States for panel visibility
  const [showSearchPanel, setShowSearchPanel] = useState(_searchOpen);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showEventsPanel, setShowEventsPanel] = useState(_eventsOpen);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refs for detecting outside clicks
  const topBarRef = useRef<HTMLDivElement>(null);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);
  const eventsPanelRef = useRef<HTMLDivElement>(null);

  // Function to safely format date (with error handling)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const isAdmin =
    isAuthenticated && (userLevel === "Manager" || userLevel === "Ghost");

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setLocalSearchValue(value);
    if (onSearchChangeAction) {
      onSearchChangeAction(value).catch(console.error);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchSubmitAction) {
      onSearchSubmitAction(localSearchValue).catch(console.error);
    }
  };

  // Handle filter click
  const handleFilterClick = () => {
    if (onFilterClickAction) {
      onFilterClickAction().catch(console.error);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoggingOut(false);
      setShowUserPanel(false);
    }
  };

  // Handle outside clicks to close panels
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside of topbar completely
      if (
        topBarRef.current &&
        !topBarRef.current.contains(event.target as Node)
      ) {
        setShowSearchPanel(false);
        setShowUserPanel(false);
        setShowEventsPanel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle ESC key to close panels
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearchPanel(false);
        setShowUserPanel(false);
        setShowEventsPanel(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // Mock events data (in a real app, this would come from an API)
  const upcomingEvents = [
    {
      id: "1",
      title: t("Events.eventTitle1") || "Art Exhibition Opening",
      date: "2023-11-15T18:00:00",
      location:
        t("Events.eventLocation1") || "Tehran Museum of Contemporary Art",
    },
    {
      id: "2",
      title: t("Events.eventTitle2") || "Historical Tour",
      date: "2023-11-20T10:00:00",
      location: t("Events.eventLocation2") || "Golestan Palace",
    },
    {
      id: "3",
      title: t("Events.eventTitle3") || "Cultural Festival",
      date: "2023-11-25T12:00:00",
      location: t("Events.eventLocation3") || "Milad Tower",
    },
  ];

  return (
    <div ref={topBarRef} className="fixed top-4 right-4 z-50" dir="rtl">
      {/* Main TopBar Container */}
      <motion.div
        className="flex items-center bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-200 p-1"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Icons Row */}
        <div className="flex items-center space-x-1 space-x-reverse">
          {/* Filter Button */}
          <motion.button
            onClick={handleFilterClick}
            className="p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
            title={t("Navigation.filterTooltip")}
            aria-label={t("Navigation.filterButtonAriaLabel")}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </motion.button>

          {/* Search Button */}
          <button
            onClick={() => {
              setShowSearchPanel(!showSearchPanel);
              setShowUserPanel(false);
              setShowEventsPanel(false);
            }}
            className={`p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 ${
              showSearchPanel
                ? "bg-gray-100 text-blue-600 shadow-inner transform scale-105"
                : ""
            }`}
            title={t("Navigation.searchTooltip")}
            aria-label={t("Navigation.searchButtonAriaLabel")}
            type="button"
          >
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Events Button */}
          <button
            onClick={() => {
              setShowEventsPanel(!showEventsPanel);
              setShowSearchPanel(false);
              setShowUserPanel(false);
            }}
            className={`p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 ${
              showEventsPanel
                ? "bg-gray-100 text-blue-600 shadow-inner transform scale-105"
                : ""
            }`}
            title={t("Navigation.eventsTooltip")}
            aria-label={t("Navigation.eventsButtonAriaLabel")}
            type="button"
          >
            <CalendarDaysIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* User Button */}
          {isAuthenticated ? (
            <button
              onClick={() => {
                setShowUserPanel(!showUserPanel);
                setShowSearchPanel(false);
                setShowEventsPanel(false);
              }}
              className={`p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95 ${
                showUserPanel
                  ? "bg-gray-100 shadow-inner transform scale-105"
                  : ""
              }`}
              title={displayName || t("Navigation.userTooltip")}
              aria-label={t("Navigation.userButtonAriaLabel")}
              type="button"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {initials}
              </div>
            </button>
          ) : (
            <Link
              href="/login"
              locale={locale}
              className="p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
              title={t("Navigation.loginTooltip")}
              aria-label={t("Navigation.loginButtonAriaLabel")}
            >
              <UserIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}

          {/* Admin Panel Button - If user is admin */}
          {isAdmin && (
            <Link
              href="/admin"
              locale={locale}
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-95"
              title={t("Navigation.adminPanelTooltip")}
              aria-label={t("Navigation.adminPanelAriaLabel")}
            >
              <Cog6ToothIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Sliding Panels */}
      <AnimatePresence>
        {/* Search Panel */}
        {showSearchPanel && (
          <motion.div
            ref={searchPanelRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="absolute top-16 right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg p-4 border border-gray-200 z-50"
          >
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                value={localSearchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="block w-full pr-10 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 transition-all duration-200 touch-manipulation min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                placeholder={t("HomePage.searchPlaceholder")}
                aria-label={t("Navigation.searchAriaLabel")}
                autoFocus
              />
              <button
                type="submit"
                className="absolute inset-y-0 left-0 pl-3 flex items-center"
                title={t("Navigation.searchSubmitTooltip")}
              >
                <svg
                  className="h-5 w-5 text-blue-500 hover:text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
            <div className="mt-3 text-xs text-gray-500">
              {t("HomePage.searchTip")}
            </div>
          </motion.div>
        )}

        {/* User Panel */}
        {showUserPanel && (
          <motion.div
            ref={userPanelRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="absolute top-16 right-0 mt-2 w-72 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
          >
            <motion.div
              className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {initials || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">
                    {displayName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Link
                href="/profile"
                locale={locale}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                onClick={() => setShowUserPanel(false)}
              >
                <UserIcon className="w-5 h-5 ml-3" />
                {t("Navigation.profile")}
              </Link>

              {/* Only show settings if user has appropriate level */}
              {isAuthenticated &&
                userLevel &&
                ["Manager", "Editor", "Ghost"].includes(userLevel) && (
                  <Link
                    href="/settings"
                    locale={locale}
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    onClick={() => setShowUserPanel(false)}
                  >
                    <Cog6ToothIcon className="w-5 h-5 ml-3" />
                    {t("Navigation.settings")}
                  </Link>
                )}

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 ml-3" />
                {isLoggingOut ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4 ml-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("Navigation.loggingOut")}
                  </>
                ) : (
                  t("Navigation.logout")
                )}
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Events Panel */}
        {showEventsPanel && (
          <motion.div
            ref={eventsPanelRef}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
            className="absolute top-16 right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50"
          >
            <motion.div
              className="flex items-center justify-between p-4 border-b border-gray-100"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <h3 className="text-base font-semibold text-gray-900">
                {t("Events.upcomingEvents")}
              </h3>
              <Link
                href="/events"
                locale={locale}
                className="text-sm text-blue-500 hover:text-blue-600"
                onClick={() => setShowEventsPanel(false)}
              >
                {t("Events.viewAll")}
              </Link>
            </motion.div>

            <div className="py-2 max-h-80 overflow-y-auto">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h4>
                    <div className="mt-1 flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="mt-1 flex items-center space-x-2 space-x-reverse text-xs text-gray-500">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-sm">{t("Events.noEvents")}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 text-center">
              <Link
                href="/events/create"
                locale={locale}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowEventsPanel(false)}
              >
                {t("Events.createEvent")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
