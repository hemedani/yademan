"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import "@/app/dark-theme.css";

interface MenuItem {
  id: string;
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  children?: MenuItem[];
  allowedLevels?: string[];
}

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userLevel, logout } = useAuth();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "places",
    "geography",
    "content",
    "virtualTours",
  ]);
  const sidebarCollapsed = isCollapsed;
  const setSidebarCollapsed = onToggle;

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      title: "داشبورد",
      href: "/admin",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      allowedLevels: ["Manager", "Editor", "Ghost"],
    },
    {
      id: "places",
      title: "مدیریت مکان‌ها",
      href: "/admin/places",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      ),
      allowedLevels: ["Manager", "Editor", "Ghost"],
      children: [
        {
          id: "places-all",
          title: "همه مکان‌ها",
          href: "/admin/places",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          ),
        },
        {
          id: "places-add",
          title: "افزودن مکان جدید",
          href: "/admin/places/create",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          ),
        },
        // {
        //   id: "places-pending",
        //   title: "درانتظار تأیید",
        //   href: "/admin/places/pending",
        //   badge: "۵",
        //   icon: (
        //     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        //       <path
        //         strokeLinecap="round"
        //         strokeLinejoin="round"
        //         strokeWidth={2}
        //         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        //       />
        //     </svg>
        //   ),
        // },
        {
          id: "places-categories",
          title: "دسته‌بندی‌ها",
          href: "/admin/categories",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: "geography",
      title: "مدیریت جغرافیایی",
      href: "/admin/geography",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      allowedLevels: ["Manager", "Editor", "Ghost"],
      children: [
        {
          id: "province",
          title: "مدیریت استان‌ها",
          href: "/admin/province",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          allowedLevels: ["Manager", "Editor", "Ghost"],
        },
        {
          id: "city",
          title: "مدیریت شهرها",
          href: "/admin/city",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          ),
          allowedLevels: ["Manager", "Editor", "Ghost"],
        },
      ],
    },
    {
      id: "virtualTours",
      title: "تورهای مجازی",
      href: "/admin/virtual-tours",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
      allowedLevels: ["Manager", "Editor", "Ghost"],
    },
    {
      id: "content",
      title: "مدیریت محتوا",
      href: "/admin/content",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      allowedLevels: ["Manager", "Editor", "Ghost"],
      children: [
        {
          id: "content-tags",
          title: "برچسب‌ها",
          href: "/admin/tags",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          ),
        },
        {
          id: "content-gallery",
          title: "گالری تصاویر",
          href: "/admin/gallery",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        },
        {
          id: "content-virtual-tours",
          title: "تورهای مجازی",
          href: "/admin/virtual-tours",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          ),
        },
        {
          id: "content-events",
          title: "رویدادهای شهرداری",
          href: "/admin/events",
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      id: "users",
      title: "مدیریت کاربران",
      href: "/admin/users",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
      allowedLevels: ["Manager", "Ghost"],
    },
    {
      id: "comments",
      title: "مدیریت نظرات",
      href: "/admin/comments",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
      badge: "۱۲",
      allowedLevels: ["Manager", "Editor", "Ghost"],
    },
    {
      id: "reports",
      title: "گزارشات و آمار",
      href: "/admin/reports",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      allowedLevels: ["Manager", "Editor", "Ghost"],
    },
    {
      id: "settings",
      title: "تنظیمات سایت",
      href: "/admin/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      ),
      allowedLevels: ["Manager", "Ghost"],
    },
  ];

  const handleItemToggle = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId],
    );
  };

  const isItemActive = (href: string): boolean => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const hasAccess = (allowedLevels?: string[]): boolean => {
    if (!allowedLevels) return true;
    return allowedLevels.includes(userLevel || "");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const formatPersianNumber = (num: number): string => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return num.toString().replace(/[0-9]/g, (digit) => persianDigits[parseInt(digit)]);
  };

  const renderMenuItem = (item: MenuItem, isChild = false) => {
    if (!hasAccess(item.allowedLevels)) return null;

    const isActive = isItemActive(item.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);

    if (sidebarCollapsed) {
      return (
        <div key={item.id} title={item.title}>
          <div
            className={`
              flex items-center justify-center p-2 rounded-xl transition-all duration-300 cursor-pointer
              ${
                isActive
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }
            `}
            onClick={() => {
              if (!hasChildren) {
                router.push(item.href);
              }
            }}
          >
            <div
              className={`
                p-2 rounded-lg transition-all duration-300
                ${isActive ? "bg-white/20" : ""}
              `}
            >
              {item.icon}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={item.id} className={`${isChild ? "mr-4" : ""}`}>
        <div
          className={`
            group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer
            ${
              isActive
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25"
                : "text-gray-400 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 hover:text-white"
            }
            ${isChild ? "py-2 text-sm" : ""}
          `}
          onClick={() => {
            if (hasChildren) {
              handleItemToggle(item.id);
            } else {
              router.push(item.href);
            }
          }}
        >
          <div className="flex items-center  space-x-3">
            <div
              className={`
              p-2 rounded-lg transition-all duration-300
              ${isActive ? "bg-white/20" : "group-hover:bg-gray-700 group-hover:text-pink-400"}
            `}
            >
              {item.icon}
            </div>
            <span className="font-medium">{item.title}</span>
            {item.badge && (
              <span
                className={`
                px-2 py-1 text-xs rounded-full font-bold
                ${isActive ? "bg-white/20 text-white" : "bg-pink-500 text-white"}
              `}
              >
                {formatPersianNumber(parseInt(item.badge.toString()))}
              </span>
            )}
          </div>
          {hasChildren && (
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-1 animate-fadeIn">
            {item.children!.map((child) => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        fixed right-0 top-0 h-screen bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/60 shadow-2xl z-50 transition-all duration-300 flex flex-col
        ${sidebarCollapsed ? "w-20" : "w-80"}
      `}
      dir="rtl"
      style={{ fontFamily: "IRANSans, Tahoma, Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700/60">
        <div
          className={`flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"}`}
        >
          <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              پنل مدیریت
            </h1>
            <p className="text-sm text-gray-400 mt-1">نقشه ایران</p>
          </div>
          <button
            onClick={() => setSidebarCollapsed()}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
        {menuItems.map((item) => renderMenuItem(item))}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700/60">
        {!sidebarCollapsed && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <div className="flex items-center  space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.first_name?.charAt(0) || "ک"}
              </div>
              <div>
                <p className="font-medium text-white">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-sm text-gray-400">
                  {userLevel === "Manager" ? "مدیر سیستم" : "ویراستار"}
                </p>
              </div>
            </div>
            <div className="flex  space-x-2">
              <Link
                href="/admin/profile"
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-center border border-gray-600"
              >
                پروفایل
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                خروج
              </button>
            </div>
          </div>
        )}
        {sidebarCollapsed && (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.first_name?.charAt(0) || "ک"}
            </div>
            <button
              onClick={handleLogout}
              className="w-10 h-10 bg-pink-600 hover:bg-pink-700 text-white rounded-lg flex items-center justify-center transition-colors duration-200"
              title="خروج"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 opacity-60"></div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;
