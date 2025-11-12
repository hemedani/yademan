"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const get = async (id: string) => {
  const token = (await cookies()).get("token");

  // Only include token if it exists
  const authOptions = token ? { token: token.value } : {};

  return await AppApi().send(
    {
      service: "main",
      model: "comment",
      act: "get",
      details: {
        set: {
          _id: id,
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
            avatar: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
              createdAt: 1,
              updatedAt: 1,
            },
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
