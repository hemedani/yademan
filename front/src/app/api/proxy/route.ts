import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get the server-side environment variable
    const backendUrl = process.env.LESAN_URL || "http://localhost:1405";
    const fullUrl = `${backendUrl}/lesan`;

    // Get the request body
    const body = await request.json();

    // Get the authorization token from cookies or headers
    const authHeader = request.headers.get("authorization") || request.headers.get("token");
    const cookieHeader = request.headers.get("cookie");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "connection": "keep-alive",
    };

    // Add authentication header if present
    if (authHeader) {
      headers["token"] = authHeader;
    }

    // Add cookie header if present
    if (cookieHeader) {
      headers["cookie"] = cookieHeader;
    }

    // Forward the request to the backend service
    const response = await fetch(fullUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // Return the response from the backend service
    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        body: { message: "Proxy request failed" }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
