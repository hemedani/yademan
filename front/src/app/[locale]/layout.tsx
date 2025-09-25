import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MapComparisonProvider } from "@/context/MapComparisonContext";

import { Toaster } from "react-hot-toast";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../i18n/routing";

export const metadata: Metadata = {
  title: "یادمان | نقشه گنجینه های ایران",
  description: "مکان های تاریخی و فرهنگی ایران را کاوش کنید",
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as "fa" | "en")) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body className="overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
          <MapComparisonProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                  duration: 4000,
                  style: {
                    fontSize: "14px",
                    maxWidth: "90vw",
                  },
                }}
              />
            </AuthProvider>
          </MapComparisonProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
