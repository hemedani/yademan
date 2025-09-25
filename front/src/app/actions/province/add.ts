"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const add = async (data: {
  name: string;
  english_name: string;
  area: {
    type: "MultiPolygon";
    coordinates: number[][][][];
  };
  center: {
    type: "Point";
    coordinates: number[];
  };
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "province",
      act: "add",
      details: {
        set: {
          name: data.name,
          english_name: data.english_name,
          area: data.area,
          center: data.center,
        },
        get: {
          _id: 1,
          name: 1,
          english_name: 1,
          area: 1,
          center: {
            _id: 1,
            name: 1,
            english_name: 1,
            area: 1,
            center: 1,
            createdAt: 1,
            updatedAt: 1,
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    },
    { token: token?.value },
  );
};
