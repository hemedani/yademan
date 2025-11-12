"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const remove = async (id: string) => {
  const token = (await cookies()).get("token");

  // Only include token if it exists
  const authOptions = token ? { token: token.value } : {};

  return await AppApi().send(
    {
      service: "main",
      model: "comment",
      act: "remove",
      details: {
        set: {
          _id: id,
        },
        get: {
          success: 1,
        },
      },
    },
    authOptions,
  );
};
