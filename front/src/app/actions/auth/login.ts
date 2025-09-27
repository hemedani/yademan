"use server";

import { AppApi } from "@/services/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface LoginResponse {
  success: boolean;
  token?: string;
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

export const loginAction = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await AppApi().send({
      service: "main",
      model: "user",
      act: "login",
      details: {
        set: {
          email,
          password,
        },
        get: {
          token: 1,
          user: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
            level: 1,
            gender: 1,
            is_verified: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      },
    });

    if (response.success && response.body?.token) {
      // Set cookies for client-side access
      const cookieStore = await cookies();

      // Set token cookie (accessible by client)
      cookieStore.set("token", response.body.token, {
        httpOnly: false, // Allow client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Set user data cookie
      cookieStore.set(
        "user",
        JSON.stringify({ level: response.body.user.level }),
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: "/",
        },
      );

      // Set national_number cookie (use email as fallback)
      cookieStore.set("national_number", response.body.user.email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return {
        success: true,
        token: response.body.token,
        user: response.body.user,
      };
    } else {
      return {
        success: false,
        error: response.body?.message || "Login failed",
      };
    }
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
};

export const logoutAction = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "An error occurred during logout",
    };
  }
};

export const logoutAndRedirect = async (): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
};
