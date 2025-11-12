"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const add = async (data: {
  text: string;
  rating?: number;
  placeId: string;
  is_anonymous?: boolean;
}) => {
  const token = (await cookies()).get("token");

  // Only include token if it exists
  const authOptions = token ? { token: token.value } : {};

  return await AppApi().send(
    {
      service: "main",
      model: "comment",
      act: "add",
      details: {
        set: {
          text: data.text,
          rating: data.rating,
          is_anonymous: data.is_anonymous || false,
          place: data.placeId, // Use 'place' instead of 'placeId' to match backend schema
        },
        get: {
          _id: 1,
          text: 1,
          rating: 1,
          status: 1,
          is_anonymous: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            level: 1,
            is_verified: 1,
          },
          place: {
            _id: 1,
            name: 1,
            description: 1,
            center: 1,
            area: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      },
    },
    authOptions,
  );
};
