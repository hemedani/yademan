"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const getUsers = async ({ set, get }: ReqType["main"]["user"]["getUsers"]) => {
  const token = (await cookies()).get("token");
  return await AppApi().send(
    {
      service: "main",
      model: "user",
      act: "getUsers",
      details: {
        set,
        get,
      },
    },
    { token: token?.value }
  );
};
