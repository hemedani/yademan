// Purpose: Protected user profile page displaying user info and favorited locations

import { redirect } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FavoriteLocations from "@/components/profile/FavoriteLocations";
import ProfileSettings from "@/components/profile/ProfileSettings";
import ActivityHistory from "@/components/profile/ActivityHistory";

export const metadata = {
  title: "پروفایل - یادمان",
  description: "مدیریت پروفایل و مکان‌های مورد علاقه",
};

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#FF007A]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#A020F0]/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href={`/${locale}?map=1`}
            className="inline-flex items-center gap-2 text-sm text-[#a0a0a0] hover:text-white transition-colors group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            بازگشت به نقشه
          </Link>
        </div>

        {/* Page heading */}
        <div className="mb-8 flex items-center space-x-4 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center shadow-lg shadow-[#FF007A]/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#a0a0a0] bg-clip-text text-transparent">
              پروفایل کاربری
            </h1>
            <p className="text-sm text-[#a0a0a0] mt-0.5">مدیریت اطلاعات و تنظیمات حساب</p>
          </div>
        </div>

        {/* Profile Header Card */}
        <ProfileHeader
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            level: user.role,
            joinDate: user.createdAt,
          }}
        />

        {/* Tabs + Tab Content */}
        <div className="mt-6">
          <ProfileTabs defaultTab="favorites" />
        </div>

        {/* Section Cards */}
        <div className="mt-6 space-y-6">
          <Suspense
            fallback={
              <div className="bg-[#121212] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF007A]" />
                  <span className="text-[#a0a0a0] text-sm">در حال بارگذاری علاقه‌مندی‌ها...</span>
                </div>
              </div>
            }
          >
            <FavoriteLocations />
          </Suspense>

          <Suspense
            fallback={
              <div className="bg-[#121212] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF007A]" />
                  <span className="text-[#a0a0a0] text-sm">در حال بارگذاری فعالیت‌ها...</span>
                </div>
              </div>
            }
          >
            <ActivityHistory />
          </Suspense>

          <ProfileSettings />
        </div>
      </div>
    </div>
  );
}
