import { lesanApi } from "@/types/declarations/selectInp";

// Get environment variables at module level
const envLesanUrl = process.env.LESAN_URL as string;
const publicLesanUrl = process.env.NEXT_PUBLIC_LESAN_URL as string;

// Function to get the appropriate URL based on environment
const getLesanUrl = (): string => {
  // Check if we're on the server side
  const isServerSide = typeof window === "undefined";

  let url: string;

  if (isServerSide) {
    // Server-side: use internal Docker network or env variable
    url = envLesanUrl ? `${envLesanUrl}/lesan` : "http://localhost:1405/lesan";
  } else {
    // Client-side: use public env var if available
    if (publicLesanUrl) {
      url = `${publicLesanUrl}/lesan`;
    } else {
      // Default to localhost for development
      url = "http://localhost:1405/lesan";
    }
  }

  return url;
};

// Helper function to get base URL without /lesan suffix
export const getLesanBaseUrl = (): string => {
  // Check if we're on the server side
  const isServerSide = typeof window === "undefined";

  let baseUrl: string;

  try {
    if (isServerSide) {
      // Server-side: use internal Docker network or env variable
      baseUrl = envLesanUrl || "http://localhost:1405";
    } else {
      // Client-side: use public env var if available
      if (publicLesanUrl) {
        baseUrl = publicLesanUrl;
      } else {
        // Default to localhost for development
        baseUrl = "http://localhost:1405";
      }
    }

    return baseUrl;
  } catch {
    // Fallback to localhost on error
    return "http://localhost:1405";
  }
};

// Export the main function for external use
export { getLesanUrl };

export const AppApi = (lesanUrl?: string) => {
  try {
    const url = lesanUrl ? lesanUrl : getLesanUrl();

    return lesanApi({
      URL: url,
      baseHeaders: {
        connection: "keep-alive",
      },
    });
  } catch {
    // Fallback to default URL on error
    return lesanApi({
      URL: "http://localhost:1405/lesan",
      baseHeaders: {
        connection: "keep-alive",
      },
    });
  }
};
