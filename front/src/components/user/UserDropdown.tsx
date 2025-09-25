"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { Link } from "../../../i18n/routing";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import ArrowRightOnRectangleIcon from "@heroicons/react/24/outline/ArrowRightOnRectangleIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

export default function UserDropdown() {
  const t = useTranslations();
  const { user, loading, logout, displayName, initials, isAuthenticated } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      // Handle logout error silently
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  if (!isAuthenticated || (!user && !loading)) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="hidden sm:block space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* User Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center space-x-3 rtl:space-x-reverse p-2 rounded-lg
          transition-all duration-200 group focus:outline-none focus:ring-2
          focus:ring-blue-500 focus:ring-offset-2 hover:bg-gray-50
          ${isOpen ? "bg-gray-50 ring-2 ring-blue-500 ring-offset-2" : ""}
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={t("Navigation.userMenuAriaLabel")}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            {initials}
          </div>
          {user?.is_verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <svg
                className="w-2 h-2 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse">
          <div className="text-left rtl:text-right">
            <p className="text-sm font-medium text-gray-900 truncate max-w-32">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.level?.toLowerCase() || "User"}
            </p>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`
            absolute top-full right-0 rtl:right-auto rtl:left-0 mt-2 w-56
            bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5
            z-50 py-2 animate-in slide-in-from-top-5 duration-200
          `}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <UserIcon className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
              {t("Navigation.profile")}
            </Link>

            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Cog6ToothIcon className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
              {t("Navigation.settings")}
            </Link>
          </div>

          {/* Logout */}
          <div className="py-1 border-t border-gray-100">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              role="menuitem"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 rtl:mr-0 rtl:ml-3" />
              {isLoggingOut ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2"
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
          </div>
        </div>
      )}
    </div>
  );
}
