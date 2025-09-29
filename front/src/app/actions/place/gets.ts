"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";
import { ReqType } from "@/types/declarations/selectInp";

export const gets = async ({
  set,
  get,
}: {
  set: ReqType["main"]["place"]["gets"]["set"];
  get: ReqType["main"]["place"]["gets"]["get"];
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "gets",
      details: {
        set,
        get,
      },
    },
    { token: token?.value }
  );
};
