"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";
import { ReqType } from "@/types/declarations/selectInp";

export const count = async ({
  set,
  get,
}: {
  set: ReqType["main"]["place"]["count"]["set"];
  get: ReqType["main"]["place"]["count"]["get"];
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "count",
      details: {
        set,
        get,
      },
    },
    { token: token?.value }
  );
};
