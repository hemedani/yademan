"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const update = async (data: {
  _id: string;
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "tag",
      act: "update",
      details: {
        set: {
          _id: data._id,
          ...(data.name && { name: data.name }),
          ...(data.description && { description: data.description }),
          ...(data.color && { color: data.color }),
          ...(data.icon && { icon: data.icon }),
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
            email: 1,
          },
        },
      },
    },
    { token: token?.value },
  );
};
