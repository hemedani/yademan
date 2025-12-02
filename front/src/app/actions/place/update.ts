"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const update = async (data: ReqType["main"]["place"]["update"]["set"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "update",
      details: {
        set: data,
        get: {
          _id: 1,
          name: 1,
        },
      },
    },
    { token: token?.value }
  );
};
