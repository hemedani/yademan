"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const gets = async (params: {
  page?: number;
  limit?: number;
  name?: string;
} = {}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "category",
      act: "gets",
      details: {
        set: {
          page: params.page || 1,
          limit: params.limit || 50,
          ...(params.name && { name: params.name }),
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
            father_name: 1,
            gender: 1,
            birth_date: 1,
            summary: 1,
            address: 1,
            level: 1,
            email: 1,
            is_verified: 1,
            createdAt: 1,
            updatedAt: 1,
            avatar: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
              createdAt: 1,
              updatedAt: 1,
            },
            national_card: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
              createdAt: 1,
              updatedAt: 1,
            },
            uploadedAssets: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
              createdAt: 1,
              updatedAt: 1,
            },
            registered_places: {
              _id: 1,
              name: 1,
              description: 1,
              slug: 1,
              center: 1,
              area: 1,
              address: 1,
              contact: 1,
              hoursOfOperation: 1,
              meta: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
            comments: {
              _id: 1,
              text: 1,
              rating: 1,
              status: 1,
              is_anonymous: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        },
      },
    },
    { token: token?.value },
  );
};
