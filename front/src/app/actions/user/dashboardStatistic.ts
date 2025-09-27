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
            provinces: 1,
            cities: 1,
            city_zones: 1,
            locaions: 1,
            categories: 1,
            tags: 1,
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
    provinces: 0,
    cities: 0,
    city_zones: 0,
    locaions: 0,
    categories: 0,
    tags: 0,
  };
};
