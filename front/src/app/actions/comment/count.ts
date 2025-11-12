"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const count = async (filter: any = {}) => {
  const token = (await cookies()).get("token");

  // Only include token if it exists
  const authOptions = token ? { token: token.value } : {};

  return await AppApi().send(
    {
      service: "main",
      model: "comment",
      act: "count",
      details: {
        set: filter,
        get: {
          total: 1,
        },
      },
    },
    authOptions,
  );
};
