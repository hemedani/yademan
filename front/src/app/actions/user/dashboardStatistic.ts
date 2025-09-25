"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const getCounts = async () => {
  const token = (await cookies()).get("token");

  try {
    const getCountDashboard = await AppApi().send(
      {
        service: "main",
        model: "user",
        act: "dashboardStatistic",
        details: {
          set: {},
          get: {
            users: 1,
            places: 1,
            comments: 1,
            pendingComments: 1,
            approvedComments: 1,
            rejectedComments: 1,
            categories: 1,
            tags: 1,
            files: 1,
            visits: 1,
            favorites: 1,
            activeUsers: 1,
            newUsersThisMonth: 1,
            popularPlaces: 1,
            recentPlaces: 1,
            provinces: 1,
            cities: 1,
          },
        },
      },
      { token: token?.value },
    );

    if (getCountDashboard.success && getCountDashboard.body) {
      return getCountDashboard.body;
    }
  } catch (error) {
    console.error("Failed to fetch dashboard statistics:", error);
  }

  // Return default values if API call fails
  return {
    users: 0,
    places: 0,
    comments: 0,
    pendingComments: 0,
    approvedComments: 0,
    rejectedComments: 0,
    categories: 0,
    tags: 0,
    files: 0,
    visits: 0,
    favorites: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    popularPlaces: 0,
    recentPlaces: 0,
    provinces: 0,
    cities: 0,
  };
};
