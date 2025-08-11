"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Link } from "../../../i18n/routing";
import {
  HomeIcon,
  CalendarDaysIcon,
  Bars3Icon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  Bars3Icon as Bars3IconSolid,
  UserIcon as UserIconSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
  label: string;
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
    },
    {
      key: "events",
      href: "/events",
      icon: CalendarDaysIcon,
      iconSolid: CalendarDaysIconSolid,
      label: t("events"),
    },
    {
      key: "menu",
      href: "/menu",
      icon: Bars3Icon,
      iconSolid: Bars3IconSolid,
      label: t("menu"),
    },
    {
      key: "user",
      href: isAuthenticated ? "/user" : "/login",
      icon: UserIcon,
      iconSolid: UserIconSolid,
      label: isAuthenticated ? t("user") : t("login"),
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return currentPath === "" || currentPath === "/";
    }
    return currentPath.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);
          const IconComponent = isActive ? item.iconSolid : item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-colors touch-manipulation min-h-[56px] ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <IconComponent className="h-6 w-6 mb-1" />
              <span
                className={`text-xs font-medium truncate max-w-full ${
                  isActive ? "text-blue-600" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
