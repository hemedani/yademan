// Purpose: Authentication API route for login, logout, and token validation

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginUser, refreshToken } from "@/lib/api/auth";
import { LoginCredentials } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case "login":
        return await handleLogin(data as LoginCredentials);
      case "logout":
        return await handleLogout();
      case "refresh":
        return await handleRefresh();
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

async function handleLogin(credentials: LoginCredentials) {
  try {
    const result = await loginUser(credentials);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    if (!result.data) {
      return NextResponse.json({ error: "No data returned" }, { status: 500 });
    }

    const { user, tokens } = result.data;

    // Set HTTP-only cookies for tokens
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: (user as any).avatar || null,
      },
    });

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
    });

    response.cookies.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

async function handleLogout() {
  const response = NextResponse.json({ success: true });

  // Clear authentication cookies
  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}

async function handleRefresh() {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    const result = await refreshToken({
      refreshToken: refreshTokenCookie.value,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Token refresh failed" },
        { status: 401 },
      );
    }

    if (!result.data) {
      return NextResponse.json({ error: "No data returned" }, { status: 500 });
    }

    const { tokens } = result.data;

    const response = NextResponse.json({ success: true });

    response.cookies.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes
    });

    if (tokens.refreshToken) {
      response.cookies.set("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });
    }

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Token refresh failed" },
      { status: 500 },
    );
  }
}
