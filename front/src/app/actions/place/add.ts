"use server";
import { AppApi } from "@/services/api";
import { cookies } from "next/headers";

export const add = async (data: {
  name: string;
  description: string;
  slug?: string;
  center: {
    type: "Point";
    coordinates: [number, number];
  };
  address?: string;
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
    social?: string[];
  };
  category?: string;
  hoursOfOperation?: string;
  status: "draft" | "active" | "archived";
  tags?: string[];
}) => {
  const token = (await cookies()).get("token");

  return await AppApi().send(
    {
      service: "main",
      model: "place",
      act: "add",
      details: {
        set: {
          name: data.name,
          description: data.description,
          slug: data.slug,
          center: data.center,
          address: data.address,
          contact: data.contact,
          category: data.category,
          hoursOfOperation: data.hoursOfOperation,
          status: data.status,
          tags: data.tags,
        },
        get: {
          _id: 1,
          name: 1,
          description: 1,
          slug: 1,
          center: 1,
          address: 1,
          contact: 1,
          category: {
            _id: 1,
            name: 1,
            color: 1,
          },
          hoursOfOperation: 1,
          status: 1,
          tags: {
            _id: 1,
            name: 1,
          },
          createdAt: 1,
          updatedAt: 1,
          registrar: {
            _id: 1,
            first_name: 1,
            last_name: 1,
          },
        },
      },
    },
    { token: token?.value }
  );
};
