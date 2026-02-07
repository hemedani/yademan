import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MapComparisonProvider } from "@/context/MapComparisonContext";

const inter = Inter({ subsets: ["latin"] });

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
  themeColor: "#000000",
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
      <body className={`${inter.className} overflow-x-hidden`}>
        <NextIntlClientProvider messages={messages}>
          <MapComparisonProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "rgba(18, 18, 18, 0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(51, 51, 51, 0.3)",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                    maxWidth: "90vw",
                    fontSize: "14px",
                    color: "#a0a0a0",
                  },
                  success: {
                    style: {
                      background: "rgba(18, 18, 18, 0.95)",
                      color: "#00ff85",
                      border: "1px solid rgba(0, 255, 133, 0.3)",
                      boxShadow: "0 0 15px rgba(0, 255, 133, 0.3)",
                    },
                  },
                  error: {
                    style: {
                      background: "rgba(18, 18, 18, 0.95)",
                      color: "#ff007a",
                      border: "1px solid rgba(255, 0, 122, 0.3)",
                      boxShadow: "0 0 15px rgba(255, 0, 122, 0.3)",
                    },
                  },
                  loading: {
                    style: {
                      background: "rgba(18, 18, 18, 0.95)",
                      color: "#a0a0a0",
                      border: "1px solid rgba(160, 160, 160, 0.3)",
                      boxShadow: "0 0 15px rgba(160, 160, 160, 0.3)",
                    },
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
