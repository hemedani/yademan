/**
 * Utility function to generate image URLs that work both on client and server side
 * Uses the backend URL for images since they're served from the backend service
 */

export const getImageUrl = (path: string): string => {
  const isClientSide = typeof window !== "undefined";

  // Use the appropriate environment variable based on the execution context
  const imageUrlBase = isClientSide
    ? (process.env.NEXT_PUBLIC_LESAN_URL || "http://localhost:1405")
    : (process.env.LESAN_URL || "http://localhost:1405");

  return `${imageUrlBase}/${path}`;
};

/**
 * Specific function for image uploads
 */
export const getImageUploadUrl = (filename: string, type: "images" | "docs" = "images"): string => {
  return getImageUrl(`uploads/${type}/${filename}`);
};
