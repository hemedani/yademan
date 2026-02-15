"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { eventSchema } from "@/types/declarations/selectInp";
import { gets as getEvents } from "@/app/actions/event/gets";
import { useMapStore } from "@/stores/mapStore";

interface EventsListProps {
  limit?: number;
  showAllLink?: boolean;
  className?: string;
  upcomingOnly?: boolean; // Whether to show only upcoming events (default: true)
}

export default function EventsList({
  limit = 5,
  showAllLink = true,
  className = "",
  upcomingOnly = true,
}: EventsListProps) {
  const [events, setEvents] = useState<eventSchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  // Function to safely format date (with error handling)
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call the backend API to get events
        const response = await getEvents({
          set: {
            page: 1,
            limit,
            startTimeAfter: upcomingOnly ? new Date().toISOString() : undefined,
          },
          get: {
            data: {
              _id: 1,
              name: 1,
              description: 1,
              startTime: 1,
              endTime: 1,
              color: 1,
              icon: 1,
              status: 1,
              isPublic: 1,
              places: {
                name: 1,
                center: 1,
              },
              organizer: {
                first_name: 1,
                last_name: 1,
              },
              thumbnail: {
                name: 1,
              },
            },
            metadata: {
              total: 1,
              page: 1,
              limit: 1,
              pageCount: 1,
            },
          },
        });

        if (response.success && response.body?.data) {
          setEvents(response.body.data);
        } else {
          setError(response.body?.message || t("Events.fetchError"));
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(t("Events.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit, t, upcomingOnly]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-6 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF007A]"></div>
      </div>
    );
  }

  if (error) {
    return <div className={`p-4 text-center text-red-500 ${className}`}>{error}</div>;
  }

  if (events.length === 0) {
    return (
      <div className={`p-6 text-center text-[#a0a0a0] ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-[#a0a0a0]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm">{t("Events.noEvents")}</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {events.map((event) => (
        <div
          key={event._id}
          className="px-4 py-3 hover:bg-[#1e1e1e] transition-colors border-b border-[#333] last:border-0 cursor-pointer"
          onClick={() => {
            // Check if the event has places to create a path for
            if (event.places && event.places.length > 0) {
              // Get user's current location
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    // Wrap the async operations in an immediately invoked async function
                    (async () => {
                      const userLocation: [number, number] = [
                        position.coords.longitude,
                        position.coords.latitude,
                      ];

                      // Prepare places for pathfinding
                      const placesForPathfinding = event.places!.map((place) => ({
                        coordinates: place.center.coordinates as [number, number],
                        name: place.name,
                        id: place._id || "",
                      }));

                      // Set the pathfinding state in the store
                      useMapStore.getState().setIsPathfindingActive(true);
                      useMapStore.getState().setPathfindingStartLocation(userLocation);
                      useMapStore.getState().setPathfindingPlaces(placesForPathfinding);

                      // Calculate the path
                      const { findShortestPath } = await import("@/utils/pathfinding");
                      const result = findShortestPath(userLocation, placesForPathfinding);

                      // Update the store with the pathfinding results
                      useMapStore.getState().setPathfindingPath(result.path);
                      useMapStore.getState().setPathfindingTotalDistance(result.totalDistance);

                      // Generate a simple line geometry for the path
                      const routeGeometry: [number, number][] = [userLocation];
                      for (const place of result.path) {
                        routeGeometry.push(place.coordinates);
                      }
                      useMapStore.getState().setPathfindingRouteGeometry(routeGeometry);
                    })().catch(console.error);
                  },
                  (error) => {
                    console.error("Error getting user location:", error);
                    // If we can't get the user's location, use Tehran as default
                    // Wrap the async operations in an immediately invoked async function
                    (async () => {
                      const defaultLocation: [number, number] = [51.389, 35.6892];

                      // Prepare places for pathfinding
                      const placesForPathfinding = event.places!.map((place) => ({
                        coordinates: place.center.coordinates as [number, number],
                        name: place.name,
                        id: place._id || "",
                      }));

                      // Set the pathfinding state in the store
                      useMapStore.getState().setIsPathfindingActive(true);
                      useMapStore.getState().setPathfindingStartLocation(defaultLocation);
                      useMapStore.getState().setPathfindingPlaces(placesForPathfinding);

                      // Calculate the path
                      const { findShortestPath } = await import("@/utils/pathfinding");
                      const result = findShortestPath(defaultLocation, placesForPathfinding);

                      // Update the store with the pathfinding results
                      useMapStore.getState().setPathfindingPath(result.path);
                      useMapStore.getState().setPathfindingTotalDistance(result.totalDistance);

                      // Generate a simple line geometry for the path
                      const routeGeometry: [number, number][] = [defaultLocation];
                      for (const place of result.path) {
                        routeGeometry.push(place.coordinates);
                      }
                      useMapStore.getState().setPathfindingRouteGeometry(routeGeometry);
                    })().catch(console.error);
                  },
                );
              } else {
                console.error("Geolocation is not supported by this browser.");
                // Wrap the async operations in an immediately invoked async function
                (async () => {
                  // Fallback to Tehran as default location
                  const defaultLocation: [number, number] = [51.389, 35.6892];

                  // Prepare places for pathfinding
                  const placesForPathfinding = event.places!.map((place) => ({
                    coordinates: place.center.coordinates as [number, number],
                    name: place.name,
                    id: place._id || "",
                  }));

                  // Set the pathfinding state in the store
                  useMapStore.getState().setIsPathfindingActive(true);
                  useMapStore.getState().setPathfindingStartLocation(defaultLocation);
                  useMapStore.getState().setPathfindingPlaces(placesForPathfinding);

                  // Calculate the path
                  const { findShortestPath } = await import("@/utils/pathfinding");
                  const result = findShortestPath(defaultLocation, placesForPathfinding);

                  // Update the store with the pathfinding results
                  useMapStore.getState().setPathfindingPath(result.path);
                  useMapStore.getState().setPathfindingTotalDistance(result.totalDistance);

                  // Generate a simple line geometry for the path
                  const routeGeometry: [number, number][] = [defaultLocation];
                  for (const place of result.path) {
                    routeGeometry.push(place.coordinates);
                  }
                  useMapStore.getState().setPathfindingRouteGeometry(routeGeometry);
                })().catch(console.error);
              }
            }
          }}
        >
          <div className="flex items-start">
            {/* Event Icon/Circle */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold mr-3"
              style={{ backgroundColor: event.color || "#FF007A" }}
            >
              {event.icon || event.name.charAt(0) || ""}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{event.name}</h4>
              <p className="text-xs text-[#a0a0a0] mt-1 line-clamp-2">{event.description}</p>

              <div className="mt-2 flex items-center space-x-2 text-xs text-[#a0a0a0]">
                <svg
                  className="w-4 h-4 text-[#a0a0a0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>{formatDate(event.startTime?.toString() || "")}</span>
              </div>

              {event.places && event.places.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {event.places.map((place, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-[#a0a0a0]">
                      <svg
                        className="w-4 h-4 text-[#a0a0a0]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span>{place.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {showAllLink && (
        <div className="px-4 py-3 border-t border-[#333]">
          <a
            href="/events"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#333] rounded-lg hover:bg-[#444] transition-colors"
          >
            {t("Events.viewAllEvents")}
          </a>
        </div>
      )}
    </div>
  );
}
