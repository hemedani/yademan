// Purpose: Protected user profile page displaying user info and favorited locations

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import FavoriteLocations from "@/components/profile/FavoriteLocations";
import ProfileSettings from "@/components/profile/ProfileSettings";
import ActivityHistory from "@/components/profile/ActivityHistory";

export const metadata = {
  title: "Profile - Yademan",
  description: "Manage your profile and view your favorite locations",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // Redirect if not authenticated
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProfileHeader
            user={{
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              level: user.role,
              joinDate: user.createdAt,
            }}
          />

          <div className="mt-8">
            <ProfileTabs defaultTab="favorites" />

            <div className="mt-8 space-y-8">
              <Suspense fallback={<div>Loading favorites...</div>}>
                <FavoriteLocations />
              </Suspense>

              <Suspense fallback={<div>Loading activity...</div>}>
                <ActivityHistory />
              </Suspense>

              <ProfileSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
