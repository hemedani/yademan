"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const count = async (params: {
  name?: string;
} = {}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "category",
      act: "count",
      details: {
        set: {
          ...(params.name && { name: params.name }),
        },
        get: {
          qty: 1,
        },
      },
    },
    { token: token?.value },
  );
};
