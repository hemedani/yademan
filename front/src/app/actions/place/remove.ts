"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const remove = async (_id: string, hardCascade = false) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "remove",
      details: {
        set: {
          _id,
          hardCascade,
        },
        get: {
          _id: 1,
          name: 1,
        },
      },
    },
    { token: token?.value }
  );
};
