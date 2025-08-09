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
          <ProfileHeader user={user} />

          <div className="mt-8">
            <ProfileTabs
              tabs={[
                {
                  id: "favorites",
                  label: "Favorite Locations",
                  content: (
                    <Suspense fallback={<div>Loading favorites...</div>}>
                      <FavoriteLocations userId={user.id} />
                    </Suspense>
                  ),
                },
                {
                  id: "activity",
                  label: "Activity History",
                  content: (
                    <Suspense fallback={<div>Loading activity...</div>}>
                      <ActivityHistory userId={user.id} />
                    </Suspense>
                  ),
                },
                {
                  id: "settings",
                  label: "Settings",
                  content: <ProfileSettings user={user} />,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
