import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { MapComparisonProvider } from "@/context/MapComparisonContext";
import { AuthInitializer } from "@/components/AuthInitializer";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/organisms/Navbar";
import { getMe } from "../actions/user/getMe";
import { Footer } from "@/components/organisms/NewFooter";
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
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // Temporarily commented out API call to test frontend routing
  // const me = await getMe();
  // const isAuthenticated = me.success;
  // const userLevel = me.success ? me.body.level : null;
  const isAuthenticated = false;
  const userLevel = null;

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
              <AuthInitializer
                isAuthenticated={isAuthenticated}
                userLevel={userLevel}
              />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 px-2 sm:px-4 lg:px-6 py-4 bg-gray-50 mt-16 overflow-x-hidden">
                  {children}
                </main>
                <Footer />
              </div>
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
