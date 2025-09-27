"use server";
import { AppApi } from "@/services/api";
import { ReqType } from "@/types/declarations/selectInp";
import { cookies } from "next/headers";

interface GetMeResponse {
  success: boolean;
  user?: {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    level: string;
    gender: string;
    is_verified: boolean;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}

export const getMe = async (
  get?: ReqType["main"]["user"]["getMe"]["get"],
): Promise<GetMeResponse> => {
  try {
    const token = (await cookies()).get("token");

    if (!token?.value) {
      return {
        success: false,
        error: "No authentication token found",
      };
    }

    get = get || {
      _id: 1,
      email: 1,
      first_name: 1,
      last_name: 1,
      gender: 1,
      level: 1,
      is_verified: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const response = await AppApi().send(
      {
        service: "main",
        model: "user",
        act: "getMe",
        details: {
          set: {},
          get,
        },
      },
      { token: token.value },
    );

    if (response.success) {
      return {
        success: true,
        user: response.body.user || response.body,
      };
    } else {
      return {
        success: false,
        error: response.body.message || "Failed to get user information",
      };
    }
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
};
