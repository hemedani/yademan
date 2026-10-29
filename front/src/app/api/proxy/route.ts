import { NextRequest } from "next/server";

export const maxDuration = 60; // Set max duration to 60 seconds
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Get the server-side environment variable
    const backendUrl = process.env.LESAN_URL || "http://localhost:1405";
    const fullUrl = `${backendUrl}/lesan`;

    // Get the authorization token from headers
    const authHeader =
      request.headers.get("authorization") || request.headers.get("token");

    const contentType = request.headers.get("content-type") || "";
    const headers: Record<string, string> = {};

    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    // Add authentication header if present. The backend expects the raw token
    // in a `token` header, never a `Bearer ` prefix.
    if (authHeader) {
      headers["token"] = authHeader.replace(/^Bearer\s+/i, "");
    }

    // Forward the request to the backend service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000); // 55 second timeout

    try {
      // Stream the request body straight through instead of buffering it.
      // `request.blob()` used to hold the whole payload (up to 550MB) in memory.
      const response = await fetch(fullUrl, {
        method: "POST",
        headers,
        body: request.body,
        // Required by Node's fetch when streaming a request body.
        duplex: "half",
        signal: controller.signal,
      } as RequestInit & { duplex: "half" });

      clearTimeout(timeoutId);

      // Stream the response back rather than parse-and-restringify it.
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("content-type") || "application/json",
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        console.error("Proxy timeout error");
        return new Response(
          JSON.stringify({
            success: false,
            body: { message: "Request timeout - file might be too large" },
          }),
          {
            status: 504,
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      throw fetchError;
    }
  } catch (error: any) {
    console.error("Proxy error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        body: {
          message: "Proxy request failed",
          error: error.message || "Unknown error",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
