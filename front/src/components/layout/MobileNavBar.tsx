"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Link } from "../../../i18n/routing";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import HomeIconSolid from "@heroicons/react/24/solid/HomeIcon";
import CalendarDaysIconSolid from "@heroicons/react/24/solid/CalendarDaysIcon";
import Bars3IconSolid from "@heroicons/react/24/solid/Bars3Icon";
import UserIconSolid from "@heroicons/react/24/solid/UserIcon";

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  label: string;
  ariaLabel: string;
}

export default function MobileNavBar() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Remove locale prefix from pathname for comparison
  const currentPath = pathname.replace(/^\/[a-z]{2}/, "");

  const navItems: NavItem[] = [
    {
      key: "home",
      href: "/",
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      label: t("home"),
      ariaLabel: t("homeAriaLabel"),
    },
    {
      key: "events",
      href: "/events",
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIconSolid,
      label: t("events"),
      ariaLabel: t("eventsAriaLabel"),
    },
    {
      key: "menu",
      href: "/menu",
      icon: Bars3Icon,
      iconSolid: Bars3IconSolid,
      label: t("menu"),
      ariaLabel: t("menuAriaLabel"),
    },
    {
      key: "user",
      href: isAuthenticated ? "/user" : "/login",
      icon: UserIcon,
      iconSolid: UserIconSolid,
      label: isAuthenticated ? t("user") : t("login"),
      ariaLabel: isAuthenticated ? t("userAriaLabel") : t("loginAriaLabel"),
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return currentPath === "" || currentPath === "/";
    }
    // For user/login, check both paths since they can be interchangeable
    if (href === "/user" || href === "/login") {
      return currentPath === "/user" || currentPath === "/login";
    }
    return currentPath.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav
        className="flex items-center justify-around px-1 py-2"
        role="navigation"
        aria-label="Main navigation"
      >
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const IconComponent = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-label={item.ariaLabel}
              aria-current={isActive ? "page" : undefined}
              className={`
                flex flex-col items-center justify-center py-3 px-3 min-w-0 flex-1
                transition-all duration-200 touch-manipulation min-h-[60px] rounded-lg mx-1
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white
                focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50 bg-opacity-80 shadow-sm scale-105"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:bg-opacity-50 focus:text-gray-700 focus:bg-gray-50"
                }
              `}
            >
              <div
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-100 bg-opacity-60"
                      : "group-hover:bg-gray-100"
                  }
                `}
              >
                <IconComponent
                  className={`
                    h-6 w-6 transition-all duration-200
                    ${isActive ? "text-blue-600 scale-110" : "text-gray-500"}
                  `}
                  aria-hidden="true"
                />
              </div>
              <span
                className={`
                  text-xs font-medium truncate max-w-full mt-1 transition-all duration-200
                  ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-500 group-hover:text-gray-700"
                  }
                `}
              >
                {item.label}
              </span>
              {/* Active indicator dot */}
              {isActive && (
                <div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2"
                  aria-hidden="true"
                >
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
