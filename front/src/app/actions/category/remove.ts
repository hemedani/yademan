"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const remove = async (data: {
  _id: string;
  hardCascade?: boolean;
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "category",
      act: "remove",
      details: {
        set: {
          _id: data._id,
          ...(data.hardCascade !== undefined && { hardCascade: data.hardCascade }),
        },
        get: {
          success: 1,
        },
      },
    },
    { token: token?.value },
  );
};
