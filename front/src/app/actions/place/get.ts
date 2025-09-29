"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";
import { ReqType } from "@/types/declarations/selectInp";

export const get = async ({
  set,
  get,
}: {
  set: ReqType["main"]["place"]["get"]["set"];
  get: ReqType["main"]["place"]["get"]["get"];
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "get",
      details: {
        set,
        get,
      },
    },
    { token: token?.value }
  );
};
