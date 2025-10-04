"use client";

import { Viewer } from "@photo-sphere-viewer/core";
import { Component, ErrorInfo, useEffect, useRef, useState } from "react";

interface MyVertualTourProps {
  imageUrl: string;
}

// Custom hook to safely load CSS
const MyVertualTour: React.FC<MyVertualTourProps> = ({ imageUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Add debug message with timestamp
  const addDebug = (message: string) => {
    const now = new Date().toISOString().split("T")[1].slice(0, 12);
    const logMessage = `[${now}] ${message}`;
    console.log(logMessage);
    setDebugInfo((prev) => [...prev.slice(-50), logMessage]);
  };

  useEffect(() => {
    // Reset state on new URL
    setIsLoading(true);
    setError(null);

    // Check if CSS is loaded

    addDebug(`Initializing with URL: ${imageUrl}`);

    // Validation
    if (!containerRef.current) {
      setError("Container element not available");
      setIsLoading(false);
      return;
    }

    if (!imageUrl) {
      setError("No panorama image URL provided");
      setIsLoading(false);
      return;
    }

    // Cleanup previous viewer
    const cleanup = () => {
      if (viewerRef.current) {
        try {
          addDebug("Cleaning up previous viewer");
          viewerRef.current.destroy();
          viewerRef.current = null;
        } catch (err) {
          console.error("Error during cleanup:", err);
        }
      }
    };

    // Clean up any existing viewer
    cleanup();

    // Create viewer with delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        // Create viewer instance
        addDebug("Creating new viewer instance");

        viewerRef.current = new Viewer({
          container: containerRef.current as HTMLElement,
          panorama: imageUrl,
          navbar: ["autorotate", "zoom", "fullscreen"],
          defaultZoomLvl: 0,
          touchmoveTwoFingers: true,
          mousewheel: true,
        });

        addDebug("Viewer created successfully");

        // Add event listeners
        const onReady = () => {
          addDebug("Panorama loaded successfully");
          setIsLoading(false);
        };

        const onProgress = (e: any) => {
          const progress = e && e.progress ? Math.round(e.progress * 100) : 0;
          addDebug(`Loading progress: ${progress}%`);
        };

        const onError = (e: any) => {
          const errorMsg = e?.message || "Unknown error loading panorama";
          addDebug(`Error loading panorama: ${errorMsg}`);
          setError(`Failed to load panorama: ${errorMsg}`);
          setIsLoading(false);
        };

        // Add core event listeners
        viewerRef.current.addEventListener("ready", onReady);
        viewerRef.current.addEventListener("load-progress", onProgress);
        viewerRef.current.addEventListener("panorama-error", onError);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        addDebug(`Error initializing viewer: ${errorMsg}`);
        setError(`Failed to initialize virtual tour: ${errorMsg}`);
        setIsLoading(false);
      }
    }, 200);

    // Cleanup function
    return () => {
      addDebug("Component unmounting, cleaning up");
      clearTimeout(timer);
      cleanup();
    };
  }, [imageUrl]); // Reinitialize when URL or CSS status changes

  // Try with fallback image
  const tryFallbackImage = () => {
    setError(null);
    setIsLoading(true);
    addDebug("Trying fallback image");

    if (!containerRef.current) {
      setError("Container not available");
      return;
    }

    // Clean up existing viewer
    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
        viewerRef.current = null;
      } catch (err) {
        console.error("Error cleaning up:", err);
      }
    }

    // Create new viewer with test image
    try {
      const fallbackUrl =
        "https://photo-sphere-viewer-data.netlify.app/assets/sphere.jpg";

      viewerRef.current = new Viewer({
        container: containerRef.current as HTMLElement,
        panorama: fallbackUrl,
        navbar: ["autorotate", "zoom", "fullscreen"],
        defaultZoomLvl: 0,
      });

      // Add event listeners
      viewerRef.current.addEventListener("ready", () => {
        addDebug("Fallback panorama loaded successfully");
        setIsLoading(false);
      });

      viewerRef.current.addEventListener("panorama-error", (e: any) => {
        const errorMsg = e?.message || "Unknown error";
        addDebug(`Fallback panorama error: ${errorMsg}`);
        setError(`Failed to load fallback image: ${errorMsg}`);
        setIsLoading(false);
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setError(`Could not initialize fallback: ${errorMsg}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-300">
      {/* Debug toggle button */}
      <button
        className="absolute top-0 right-0 bg-black bg-opacity-50 text-white text-xs px-2 py-1 z-30"
        onClick={() => setShowDebug(!showDebug)}
      >
        {showDebug ? "Hide Debug" : "Debug"}
      </button>

      {/* Viewer container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-100"
        data-testid="virtual-tour-container"
      />

      {/* Loading indicator */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="flex flex-col items-center text-white">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-2">Loading panorama...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md m-4">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
              Virtual Tour Error
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="text-sm text-gray-500 mb-4 break-all">
              <strong>Image URL:</strong> {imageUrl}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
              <button
                className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={tryFallbackImage}
              >
                Try Test Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Debug panel */}
      {showDebug && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white z-30 p-3 max-h-[200px] overflow-y-auto text-xs font-mono">
          <div className="mb-2 font-bold">Debug Info:</div>
          {debugInfo.map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>URL: {imageUrl || "none"}</div>
            <div>
              Container: {containerRef.current ? "Ready" : "Not mounted"}
            </div>
            <div>
              Viewer: {viewerRef.current ? "Initialized" : "Not initialized"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Error boundary component to catch CSS loading errors
class VirtualTourErrorBoundary extends Component<{
  children: React.ReactNode;
}> {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Virtual tour error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            <div className="text-red-500 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Virtual Tour Error
            </h3>
            <p className="text-gray-600 mb-4">
              Failed to load virtual tour component.
              {this.state.errorMessage && (
                <span className="block mt-2 text-sm text-red-500">
                  {this.state.errorMessage}
                </span>
              )}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export the component wrapped in error boundary
const VirtualTourWithErrorBoundary = (props: MyVertualTourProps) => (
  <VirtualTourErrorBoundary>
    <MyVertualTour {...props} />
  </VirtualTourErrorBoundary>
);

export default VirtualTourWithErrorBoundary;
