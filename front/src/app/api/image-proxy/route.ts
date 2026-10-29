import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Only files served from the backend's `/uploads` tree may be proxied, and only
// with a safe path. Without this the route acted as an open reader for any
// backend path and would happily forward `text/html` from our own origin.
const SAFE_PATH = /^uploads\/[A-Za-z0-9._\-\/]+$/;

export async function GET(request: NextRequest) {
  try {
    // Get the image path from query parameters
    const { searchParams } = new URL(request.url);
    const rawPath = searchParams.get("path");

    if (!rawPath) {
      return new NextResponse("Missing path parameter", { status: 400 });
    }

    const path = rawPath.replace(/^\/+/, "");

    if (!SAFE_PATH.test(path) || path.includes("..")) {
      return new NextResponse("Invalid path parameter", { status: 400 });
    }

    // Get the server-side environment variable
    const backendUrl = process.env.LESAN_URL || "http://localhost:1405";
    const fullUrl = `${backendUrl}/${path}`;

    // Fetch the image from the backend
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        // Forward any relevant headers if needed
        "User-Agent": request.headers.get("user-agent") || "Next.js Image Proxy",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${fullUrl} - Status: ${response.status}`,
      );
      return new NextResponse(`Image not found: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "";

    // Only ever answer with an image. Anything else (an uploaded .html, for
    // instance) must not be rendered from our own origin.
    if (!contentType.startsWith("image/")) {
      return new NextResponse("Not an image", { status: 415 });
    }

    // `image/svg+xml` is allowed because the app stores SVG placeholders, and
    // an SVG opened directly (not through <img>) would execute its scripts on
    // our origin. A fully sandboxed CSP makes that inert while leaving <img>
    // rendering untouched.
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error: any) {
    console.error("Image proxy error:", error);
    return new NextResponse(`Failed to fetch image: ${error.message}`, {
      status: 500,
    });
  }
}
