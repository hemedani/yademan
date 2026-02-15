"use client";
// File Address
// src/components/layout/TopBar.tsx

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Link as ILink } from "../../../i18n/routing";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import EventsList from "../EventsList";

// Icons
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";

interface TopBarProps {
  locale?: string;
  // Client-side state flags
  _eventsOpen?: boolean;
}

export default function TopBar({ locale = "fa", _eventsOpen = false }: TopBarProps) {
  const t = useTranslations();
  const { isAuthenticated, displayName, initials, userLevel, logout, user } = useAuth();

  // States for panel visibility
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [showEventsPanel, setShowEventsPanel] = useState(_eventsOpen);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Refs for detecting outside clicks
  const topBarRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);
  const eventsPanelRef = useRef<HTMLDivElement>(null);

  const isAdmin = isAuthenticated && (userLevel === "Manager" || userLevel === "Ghost");

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
      if (topBarRef.current && !topBarRef.current.contains(event.target as Node)) {
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
        setShowUserPanel(false);
        setShowEventsPanel(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <div ref={topBarRef} className="fixed top-4 right-4 z-50" dir="rtl">
      {/* Main TopBar Container */}
      <motion.div
        className="flex items-center bg-[#121212]/90 backdrop-blur-md rounded-full shadow-lg border border-[#333] p-1"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Icons Row */}
        <div className="flex items-center space-x-1 ">
          {/* Events Button */}
          <button
            onClick={() => {
              setShowEventsPanel(!showEventsPanel);
              setShowUserPanel(false);
            }}
            className={`p-3 text-white hover:text-[#FF007A] hover:bg-[#1e1e1e] rounded-full transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus-visible:ring-2 focus-visible:ring-[#FF007A] active:scale-95 ${
              showEventsPanel
                ? "bg-[#1e1e1e] text-[#FF007A] shadow-inner transform scale-105 border border-[#FF007A]"
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
                setShowEventsPanel(false);
              }}
              className={`p-2 text-white hover:text-[#FF007A] hover:bg-[#1e1e1e] rounded-full transition-all duration-300 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus-visible:ring-2 focus-visible:ring-[#FF007A] active:scale-95 ${
                showUserPanel
                  ? "bg-[#1e1e1e] shadow-inner transform scale-105 border border-[#FF007A]"
                  : ""
              }`}
              title={displayName || t("Navigation.userTooltip")}
              aria-label={t("Navigation.userButtonAriaLabel")}
              type="button"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                {initials}
              </div>
            </button>
          ) : (
            <ILink
              href="/login"
              locale={locale}
              className="p-3 text-white hover:text-[#FF007A] hover:bg-[#1e1e1e] rounded-full transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus-visible:ring-2 focus-visible:ring-[#FF007A] active:scale-95"
              title={t("Navigation.loginTooltip")}
              aria-label={t("Navigation.loginButtonAriaLabel")}
            >
              <UserIcon className="h-5 w-5" aria-hidden="true" />
            </ILink>
          )}

          {/* Admin Panel Button - If user is admin */}
          {isAdmin && (
            <Link
              href="/admin"
              className="p-3 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#FF007A] focus-visible:ring-2 focus-visible:ring-[#FF007A] active:scale-95"
              title={t("Navigation.adminPanelTooltip")}
              aria-label={t("Navigation.adminPanelAriaLabel")}
            >
              <Cog6ToothIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </Link>
          )}
        </div>
      </motion.div>

      {/* Sliding Panels */}
      <AnimatePresence>
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
            className="absolute top-16 right-0 mt-2 w-72 bg-[#121212] rounded-2xl shadow-lg border border-[#333] z-50"
          >
            <motion.div
              className="p-4 border-b border-[#333] bg-gradient-to-r from-[#FF007A]/10 to-[#A020F0]/10 rounded-t-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <div className="flex items-center space-x-3 ">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {initials || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white truncate">{displayName}</h3>
                  <p className="text-xs text-[#a0a0a0] truncate">{user?.email}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="py-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <ILink
                href="/profile"
                locale={locale}
                className="flex items-center px-4 py-3 text-sm text-[#a0a0a0] hover:bg-[#1e1e1e] hover:text-white transition-colors duration-150"
                onClick={() => setShowUserPanel(false)}
              >
                <UserIcon className="w-5 h-5 ml-3 text-[#FF007A]" />
                {t("Navigation.profile")}
              </ILink>

              {/* Only show settings if user has appropriate level */}
              {isAuthenticated && userLevel && ["Manager", "Editor", "Ghost"].includes(userLevel) && (
                <ILink
                  href="/settings"
                  locale={locale}
                  className="flex items-center px-4 py-3 text-sm text-[#a0a0a0] hover:bg-[#1e1e1e] hover:text-white transition-colors duration-150"
                  onClick={() => setShowUserPanel(false)}
                >
                  <Cog6ToothIcon className="w-5 h-5 ml-3 text-[#FF007A] hover:text-white" />
                  {t("Navigation.settings")}
                </ILink>
              )}

              <div className="border-t border-[#333] my-1"></div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center px-4 py-3 text-sm text-[#FF007A] hover:bg-[#1e1e1e]/50 hover:text-[#ff339c] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 ml-3" />
                {isLoggingOut ? (
                  <>
                    <svg className="animate-spin w-4 h-4 ml-2 text-[#FF007A]" viewBox="0 0 24 24">
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
                        className="opacity-75 text-[#FF007A]"
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
            className="absolute top-16 right-0 mt-2 w-80 bg-[#121212] rounded-2xl shadow-lg border border-[#333] z-50"
          >
            <motion.div
              className="flex items-center justify-between p-4 border-b border-[#333]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.2 }}
            >
              <h3 className="text-base font-semibold text-white">{t("Events.upcomingEvents")}</h3>
              <ILink
                href="/events"
                locale={locale}
                className="text-sm text-[#FF007A] hover:text-[#ff339c]"
                onClick={() => setShowEventsPanel(false)}
              >
                {t("Events.viewAll")}
              </ILink>
            </motion.div>

            {/* Use the EventsList component to display real events */}
            <div className="py-2 max-h-80 overflow-y-auto">
              <EventsList limit={5} showAllLink={false} upcomingOnly={true} className="" />
            </div>

            <div className="p-4 border-t border-[#333] text-center">
              <ILink
                href="/events"
                locale={locale}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#333] rounded-lg hover:bg-[#444] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF007A]"
                onClick={() => setShowEventsPanel(false)}
              >
                {t("Events.viewAllEvents")}
              </ILink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
