"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

export const updateRelations = async (data: ReqType["main"]["place"]["updatePlaceRelations"]["set"]) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "updatePlaceRelations",
      details: {
        set: data,
        get: {
          _id: 1,
          name: 1,
          province: {
            _id: 1,
            name: 1,
          },
          city: {
            _id: 1,
            name: 1,
          },
          category: {
            _id: 1,
            name: 1,
            color: 1,
          },
          tags: {
            _id: 1,
            name: 1,
            color: 1,
          },
          thumbnail: {
            _id: 1,
            name: 1,
            mimType: 1,
          },
          gallery: {
            _id: 1,
            name: 1,
            mimType: 1,
          },
        },
      },
    },
    { token: token?.value },
  );
};
