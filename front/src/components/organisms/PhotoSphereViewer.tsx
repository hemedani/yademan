"use client";

import { Viewer, ViewerConfig } from "@photo-sphere-viewer/core";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { Component, ErrorInfo, useEffect, useRef, useState } from "react";

interface Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  description?: string;
  target?: string;
}

interface PhotoSphereViewerProps {
  panoramaUrl: string;
  height?: string;
  width?: string;
  hotspots?: Hotspot[];
  onReady?: () => void;
}

const PhotoSphereViewer: React.FC<PhotoSphereViewerProps> = ({
  panoramaUrl,
  height = "100vh",
  width = "100%",
  hotspots = [],
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset state on new URL
    setIsLoading(true);
    setError(null);

    // Validate inputs
    if (!containerRef.current) {
      setError("Container element not available");
      setIsLoading(false);
      return;
    }

    if (!panoramaUrl) {
      setError("No panorama image URL provided");
      setIsLoading(false);
      return;
    }

    // Cleanup previous viewer
    const cleanup = () => {
      if (viewerRef.current) {
        try {
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
        const viewerOptions: ViewerConfig = {
          container: containerRef.current as HTMLElement,
          panorama: panoramaUrl,
          navbar: ["zoom", "move", "fullscreen", "caption"],
          plugins: [
            [
              MarkersPlugin,
              {
                markers: hotspots.map((hotspot) => ({
                  id: hotspot.id,
                  position: { yaw: hotspot.yaw, pitch: hotspot.pitch }, // [longitude, latitude] format
                  html: `
                    <div class="bg-[#FF007A] border-2 border-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer hover:bg-[#ff339c] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  `,
                  tooltip: hotspot.description || hotspot.target || hotspot.id,
                })),
              },
            ],
          ],
          caption: "360° Virtual Tour",
          defaultZoomLvl: 1,
          touchmoveTwoFingers: true,
          mousewheelCtrlKey: false,
        };

        viewerRef.current = new Viewer(viewerOptions);

        // Add event listeners
        const onReadyHandler = () => {
          setIsLoading(false);
          onReady?.();
        };

        const onError = (e: any) => {
          const errorMsg = e?.message || "Unknown error loading panorama";
          setError(`Failed to load panorama: ${errorMsg}`);
          setIsLoading(false);
        };

        // Add core event listeners
        viewerRef.current.addEventListener("ready", onReadyHandler);
        viewerRef.current.addEventListener("panorama-error", onError);

        // Remove event listeners on cleanup
        return () => {
          viewerRef.current?.removeEventListener("ready", onReadyHandler);
          viewerRef.current?.removeEventListener("panorama-error", onError);
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(`Failed to initialize virtual tour: ${errorMsg}`);
        setIsLoading(false);
      }
    }, 200); // Delay to ensure DOM is ready

    // Cleanup function
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, [panoramaUrl, hotspots, onReady]); // Reinitialize when URL or hotspots change

  return (
    <div className="relative w-full h-full">
      {/* Viewer container */}
      <div
        ref={containerRef}
        className="w-full h-full bg-gray-900"
        style={{ height, width }}
      />

      {/* Loading indicator */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="flex flex-col items-center text-white">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-2">Loading virtual tour...</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
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
            <p className="text-gray-600 mb-4">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Error boundary component to catch CSS loading errors
class PhotoSphereViewerErrorBoundary extends Component<{
  children: React.ReactNode;
}> {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("PhotoSphereViewer error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
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
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Export the component wrapped in error boundary
const PhotoSphereViewerWithErrorBoundary: React.FC<PhotoSphereViewerProps> = (
  props,
) => (
  <PhotoSphereViewerErrorBoundary>
    <PhotoSphereViewer {...props} />
  </PhotoSphereViewerErrorBoundary>
);

export default PhotoSphereViewerWithErrorBoundary;
