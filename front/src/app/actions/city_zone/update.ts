"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const update = async (
  _id: string,
  name?: string,
  area?: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  },
) => {
  const token = (await cookies()).get("token");

  // Build the set object with only provided fields
  const set: Record<string, unknown> = { _id };

  if (name !== undefined) set.name = name;
  if (area !== undefined) set.area = area;

  return await AppApi().send(
    {
      service: "main",
      model: "city_zone",
      act: "update",
      details: {
        set,
        get: {
          _id: 1,
          name: 1,
          area: 1,
          center: 1,
        },
      },
    },
    { token: token?.value },
  );
};
