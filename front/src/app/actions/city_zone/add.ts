"use server";
import { AppApi } from "@/services/api";

import { cookies } from "next/headers";

export const add = async (data: {
  name: string;
  center: {
    type: "Point";
    coordinates: number[];
  };
  area: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
  cityId: string;
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "city_zone",
      act: "add",
      details: {
        set: {
          name: data.name,
          center: data.center,
          area: data.area,
          cityId: data.cityId,
        },
        get: {
          _id: 1,
          name: 1,
          center: 1,
          area: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    },
    { token: token?.value },
  );
};
