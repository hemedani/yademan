"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const update = async (
  _id: string,
  name?: string,
  english_name?: string,
  area?: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  },
  center?: {
    type: "Point";
    coordinates: number[];
  },
) => {
  const token = (await cookies()).get("token");

  // Build the set object with only provided fields
  const set: Record<string, unknown> = { _id };

  if (name !== undefined) set.name = name;
  if (english_name !== undefined) set.english_name = english_name;
  if (area !== undefined) set.area = area;
  if (center !== undefined) set.center = center;

  return await AppApi().send(
    {
      service: "main",
      model: "city",
      act: "update",
      details: {
        set,
        get: {
          _id: 1,
          name: 1,
          english_name: 1,
          area: 1,
          center: 1,
        },
      },
    },
    { token: token?.value },
  );
};
