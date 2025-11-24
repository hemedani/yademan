"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const remove = async ({
  set,
  get,
}: ReqType["main"]["event"]["remove"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "event",
      act: "remove",
      details: {
        set,
        get,
      },
    },
    { token: token?.value },
  );
};
