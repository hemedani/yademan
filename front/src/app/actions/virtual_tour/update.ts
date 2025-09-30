"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const update = async ({ set, get }: ReqType["main"]["virtual_tour"]["update"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "category",
      act: "update",
      details: {
        set,
        get,
      },
    },
    { token: token?.value },
  );
};
