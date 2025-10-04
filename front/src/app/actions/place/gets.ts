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

  // Ensure required pagination parameters are set
  const paginatedSet = {
    ...set,
    page: set.page ?? 1,
    limit: set.limit ?? 50,
  };

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "gets",
      details: {
        set: paginatedSet,
        get,
      },
    },
    { token: token?.value },
  );
};
