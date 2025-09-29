"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const add = async (data: {
  name: string;
  description: string;
  color?: string;
  icon?: string;
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "tag",
      act: "add",
      details: {
        set: {
          name: data.name,
          description: data.description,
          color: data.color || "#3B82F6",
          icon: data.icon || "📍",
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
