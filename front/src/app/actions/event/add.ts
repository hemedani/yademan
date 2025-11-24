"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const add = async ({
  set,
  get,
}: ReqType["main"]["event"]["add"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "event",
      act: "add",
      details: {
        set,
        get,
      },
    },
    { token: token?.value },
  );
};
