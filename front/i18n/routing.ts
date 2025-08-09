import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
