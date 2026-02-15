/**
 * Utility function to generate image URLs that work both on client and server side
 * Uses the backend URL for images since they're served from the backend service
 */

export const getImageUrl = (path: string): string => {
  const isClientSide = typeof window !== "undefined";

  if (isClientSide) {
    // On client side, use the proxy route to avoid CORS and environment issues
    // This works in both development and production
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/image-proxy?path=${encodeURIComponent(path)}`;
  } else {
    // On server side, use the backend URL directly
    const imageUrlBase = process.env.LESAN_URL || "http://localhost:1405";
    return `${imageUrlBase}/${path}`;
  }
};

/**
 * Specific function for image uploads
 */
export const getImageUploadUrl = (filename: string, type: "images" | "docs" = "images"): string => {
  return getImageUrl(`uploads/${type}/${filename}`);
};
