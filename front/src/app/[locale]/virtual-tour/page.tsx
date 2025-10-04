"use client";

import { useState, useEffect } from "react";
import SimpleTourViewer from "@/components/organisms/SimpleTourViewer";
import { getLesanBaseUrl } from "@/services/api";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Define tour data interface
interface Hotspot {
  id?: string;
  pitch: number;
  yaw: number;
  description?: string;
  target?: string;
}

interface Tour {
  _id: string;
  name: string;
  description?: string;
  panorama: {
    _id?: string;
    name: string;
  };
  hotspots?: Hotspot[];
  status: "draft" | "active" | "archived";
  place?: {
    _id?: string;
    name: string;
  };
}

export default function VirtualTourPage() {
  const searchParams = useSearchParams();
  const initialTourId = searchParams.get("tourId");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [activeTour, setActiveTour] = useState<Tour | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  // Fetch available tours
  useEffect(() => {
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Replace this URL with your actual API endpoint
        const response = await axios.get(`${getLesanBaseUrl()}/api/virtual-tours`);

        if (response.data.success) {
          const toursData = response.data.body;
          setTours(toursData.filter((tour: Tour) => tour.status === "active"));

          // If initialTourId is provided, set it as active tour
          if (initialTourId && toursData.length > 0) {
            const tour = toursData.find((t: Tour) => t._id === initialTourId);
            if (tour) {
              setActiveTour(tour);
            } else {
              // If tour not found, use the first one
              setActiveTour(toursData[0]);
            }
          } else if (toursData.length > 0) {
            // Set first tour as active if no initialTourId
            setActiveTour(toursData[0]);
          }
        } else {
          setError(response.data.body.message || "Failed to fetch tours");
        }
      } catch (err) {
        console.error("Error fetching tours:", err);
        setError("Failed to load virtual tours. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [initialTourId]);

  const handleOpenTour = (tour: Tour) => {
    setActiveTour(tour);
    setShowViewer(true);
  };

  const handleCloseTour = () => {
    setShowViewer(false);
  };

  const handleHotspotClick = (hotspotId: string, target?: string) => {
    if (!target) return;

    // Find target tour and set as active
    const targetTour = tours.find(tour => tour._id === target);
    if (targetTour) {
      setActiveTour(targetTour);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">Virtual Tours</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-700">No virtual tours available</h2>
          <p className="mt-2 text-gray-500">Please check back later for new virtual tours.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {tours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 relative">
                  {/* Placeholder image or thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-gray-500">Tour Preview</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{tour.name}</h3>
                  {tour.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                  )}
                  <button
                    onClick={() => handleOpenTour(tour)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors w-full"
                  >
                    Start Tour
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Virtual Tour Viewer */}
          {showViewer && activeTour && (
            <SimpleTourViewer
              panoramaUrl={`${getLesanBaseUrl()}/uploads/images/${activeTour.panorama.name}`}
              title={activeTour.name}
              description={activeTour.description}
              hotspots={activeTour.hotspots || []}
              onClose={handleCloseTour}
              onHotspotClick={handleHotspotClick}
            />
          )}
        </>
      )}

      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">About Virtual Tours</h2>
        <p className="text-gray-700 mb-4">
          Explore our locations in immersive 360° panoramic views. Navigate between spaces by clicking
          on the hotspots within each panorama.
        </p>

        <h3 className="text-lg font-medium mt-6 mb-2">How to Use:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Click and drag to look around</li>
          <li>Use mouse wheel to zoom in and out</li>
          <li>Click on hotspots (circular icons) to navigate or view information</li>
          <li>Use the control bar at the bottom for additional options</li>
        </ul>

        <div className="mt-8 flex justify-end">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
