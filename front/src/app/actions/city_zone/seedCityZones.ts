"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const seedCityZones = async (_id: string, details: any) => {
  const token = (await cookies()).get("token");
  return await AppApi().send(
    {
      service: "main",
      model: "city_zone",
      act: "add",
      details,
    },
    { token: token?.value },
  );
};
