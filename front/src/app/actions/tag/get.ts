"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const get = async (id: string) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "tag",
      act: "get",
      details: {
        set: {
          _id: id,
        },
        get: {
          _id: 1,
          name: 1,
          description: 1,
          color: 1,
          icon: 1,
          createdAt: 1,
          updatedAt: 1,
          registrar: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            gender: 1,
            address: 1,
            level: 1,
            email: 1,
            is_verified: 1,
            avatar: {
              _id: 1,
              name: 1,
              mimType: 1,
              alt_text: 1,
            },
            national_card: {
              _id: 1,
              name: 1,
              mimType: 1,
              alt_text: 1,
            },
            registered_places: {
              _id: 1,
              name: 1,
              description: 1,
              slug: 1,
              address: 1,
              contact: 1,
              hoursOfOperation: 1,
              status: 1,
            },
            comments: {
              _id: 1,
              text: 1,
              rating: 1,
              status: 1,
              is_anonymous: 1,
            },
          },
        },
      },
    },
    { token: token?.value },
  );
};
