"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const count = async ({
  set,
}: ReqType["main"]["event"]["count"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "event",
      act: "count",
      details: {
        set,
        get: {
          qty: 1,
        },
      },
    },
    { token: token?.value },
  );
};
