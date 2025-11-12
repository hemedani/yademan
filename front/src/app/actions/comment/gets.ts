"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const gets = async ({
  set,
  get,
}: ReqType["main"]["comment"]["gets"]) => {
  const token = (await cookies()).get("token");

  // Only include token if it exists
  const authOptions = token ? { token: token.value } : {};

  return await AppApi().send(
    {
      service: "main",
      model: "comment",
      act: "gets",
      details: {
        set,
        get,
      },
    },
    authOptions,
  );
};
