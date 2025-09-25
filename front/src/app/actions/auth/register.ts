"use server";

import { AppApi } from "@/services/api";

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: "Male" | "Female";
  father_name?: string;
  birth_date?: Date;
  summary?: string;
  address?: string;
}

interface RegisterResponse {
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
  message?: string;
}

export const registerAction = async (
  userData: RegisterData,
): Promise<RegisterResponse> => {
  try {
    const response = await AppApi().send({
      service: "main",
      model: "user",
      act: "registerUser",
      details: {
        set: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password: userData.password,
          gender: userData.gender,
          father_name: userData.father_name,
          birth_date: userData.birth_date,
          summary: userData.summary,
          address: userData.address,
          level: "Ordinary" as const, // Default level for new users
          is_verified: false, // New users are not verified by default
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        get: {
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
    });

    if (response.success) {
      return {
        success: true,
        user: response.body.user || response.body,
        message:
          "Registration successful! Please check your email for verification.",
      };
    } else {
      return {
        success: false,
        error: response.body.message || "Registration failed",
      };
    }
  } catch (error: unknown) {
    console.error("Register action error:", error);

    // Handle specific API errors
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as { response: { data: { message: string } } };
      errorMessage = apiError.response.data.message;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Handle common registration errors
    if (errorMessage.includes("email")) {
      errorMessage =
        "This email is already registered. Please use a different email or try logging in.";
    } else if (errorMessage.includes("validation")) {
      errorMessage = "Please check your information and try again.";
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Validation helper function
export const validateRegistrationData = async (
  data: RegisterData,
): Promise<{ isValid: boolean; errors: string[] }> => {
  const errors: string[] = [];

  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.push("First name must be at least 2 characters long");
  }

  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.push("Last name must be at least 2 characters long");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.password || data.password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (!data.gender || !["Male", "Female"].includes(data.gender)) {
    errors.push("Please select a valid gender");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
