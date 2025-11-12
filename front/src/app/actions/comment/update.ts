"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const update = async (data: {
  _id: string;
  text?: string;
  rating?: number;
  status?: "pending" | "approved" | "rejected";
}) => {
  const token = (await cookies()).get("token");

  // Only include token if it exists
  const authOptions = token ? { token: token.value } : {};

  return await AppApi().send(
    {
      service: "main",
      model: "comment",
      act: "update",
      details: {
        set: {
          _id: data._id,
          ...(data.text !== undefined && { text: data.text }),
          ...(data.rating !== undefined && { rating: data.rating }),
          ...(data.status !== undefined && { status: data.status }),
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
