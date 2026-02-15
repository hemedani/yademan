"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { eventSchema } from "@/types/declarations/selectInp";
import { getImageUploadUrl } from "@/utils/imageUrl";
import { get as getEvent } from "@/app/actions/event/get";
import { useMapStore } from "@/stores/mapStore";

// Dynamic import for map to avoid SSR issues
const InteractiveMap = dynamic(() => import("@/components/map/InteractiveMap"), { ssr: false });

export default function EventDetailContent() {
  const t = useTranslations("Events");
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const eventId = params._id as string;

  const [event, setEvent] = useState<eventSchema | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getEvent(eventId, {
          _id: 1,
          name: 1,
          description: 1,
          startTime: 1,
          endTime: 1,
          color: 1,
          icon: 1,
          status: 1,
          isPublic: 1,
          ticketPrice: 1,
          registrationRequired: 1,
          maxAttendees: 1,
          capacity: 1,
          eventUrl: 1,
          registrationUrl: 1,
          createdAt: 1,
          places: {
            _id: 1,
            name: 1,
            description: 1,
            center: 1,
            address: 1,
          },
          organizer: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            email: 1,
          },
          registrar: {
            _id: 1,
            first_name: 1,
            last_name: 1,
          },
          tags: {
            _id: 1,
            name: 1,
            color: 1,
            icon: 1,
          },
          thumbnail: {
            _id: 1,
            name: 1,
            alt_text: 1,
          },
          gallery: {
            _id: 1,
            name: 1,
            alt_text: 1,
          },
        });

        if (response.success && response.body) {
          setEvent(response.body);
        } else {
          setError(response.body?.message || t("fetchError"));
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(t("fetchError"));
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, t]);

  // Handle route visualization
  const handleViewRoute = async () => {
    if (!event?.places || event.places.length === 0) return;

    setShowMap(true);

    // Get user's current location or use default
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation: [number, number] = [position.coords.longitude, position.coords.latitude];

          await visualizeRoute(userLocation);
        },
        async (error) => {
          console.error("Error getting user location:", error);
          // Fallback to Tehran
          const defaultLocation: [number, number] = [51.389, 35.6892];
          await visualizeRoute(defaultLocation);
        },
      );
    } else {
      // Fallback to Tehran
      const defaultLocation: [number, number] = [51.389, 35.6892];
      await visualizeRoute(defaultLocation);
    }
  };

  const visualizeRoute = async (startLocation: [number, number]) => {
    if (!event?.places) return;

    const placesForPathfinding = event.places.map((place) => ({
      coordinates: place.center.coordinates as [number, number],
      name: place.name,
      id: place._id || "",
    }));

    // Set the pathfinding state in the store
    useMapStore.getState().setIsPathfindingActive(true);
    useMapStore.getState().setPathfindingStartLocation(startLocation);
    useMapStore.getState().setPathfindingPlaces(placesForPathfinding);

    // Calculate the path
    const { findShortestPath } = await import("@/utils/pathfinding");
    const result = findShortestPath(startLocation, placesForPathfinding);

    // Update the store with the pathfinding results
    useMapStore.getState().setPathfindingPath(result.path);
    useMapStore.getState().setPathfindingTotalDistance(result.totalDistance);

    // Generate route geometry
    const routeGeometry: [number, number][] = [startLocation];
    for (const place of result.path) {
      routeGeometry.push(place.coordinates);
    }
    useMapStore.getState().setPathfindingRouteGeometry(routeGeometry);
  };

  // Format date
  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return String(dateString);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF007A]"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">{error || t("noEvents")}</h3>
          <button
            onClick={() => router.push(`/${locale}/events`)}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF007A]/50 transition-all duration-300"
          >
            {t("backToEvents")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Back Button */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#333]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push(`/${locale}/events`)}
            className="flex items-center space-x-2 rtl:space-x-reverse text-[#a0a0a0] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>{t("backToEvents")}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-96 rounded-2xl overflow-hidden border border-[#333]">
              {event.thumbnail?.name || (event.gallery && event.gallery.length > 0) ? (
                <Image
                  src={getImageUploadUrl(
                    event.gallery && event.gallery.length > 0
                      ? event.gallery[selectedImageIndex]?.name || ""
                      : event.thumbnail?.name || "",
                    "images",
                  )}
                  alt={
                    event.gallery && event.gallery.length > 0
                      ? event.gallery[selectedImageIndex]?.alt_text || event.name
                      : event.thumbnail?.alt_text || event.name
                  }
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className="h-full w-full flex items-center justify-center text-9xl font-bold"
                  style={{
                    background: event.color
                      ? `linear-gradient(135deg, ${event.color}20, ${event.color}40)`
                      : "linear-gradient(135deg, #FF007A20, #7B2FF740)",
                  }}
                >
                  {event.icon || event.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {event.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-[#FF007A]"
                        : "border-[#333] hover:border-[#666]"
                    }`}
                  >
                    <Image
                      src={getImageUploadUrl(image.name, "images")}
                      alt={image.alt_text || event.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Event Info */}
          <div className="space-y-6">
            {/* Status & Type */}
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm ${getStatusColor(
                  event.status,
                )}`}
              >
                {t(event.status)}
              </span>
              {event.isPublic !== undefined && (
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#1a1a1a] text-white border border-[#333]">
                  {event.isPublic ? t("publicEvent") : t("privateEvent")}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-white leading-tight">{event.name}</h1>

            {/* Description */}
            {event.description ? (
              <p className="text-lg text-[#a0a0a0] leading-relaxed">{event.description}</p>
            ) : (
              <p className="text-lg text-[#666] italic">{t("noDescription")}</p>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-lg border border-[#333] text-[#a0a0a0] bg-[#1a1a1a]"
                    style={{
                      borderColor: tag.color || undefined,
                      color: tag.color || undefined,
                    }}
                  >
                    {tag.icon && <span className="mr-1">{tag.icon}</span>}
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {event.registrationUrl && (
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF007A]/50 transition-all duration-300 text-center"
                >
                  {t("register")}
                </a>
              )}
              {event.eventUrl && (
                <a
                  href={event.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#1a1a1a] border border-[#333] text-white rounded-xl font-medium hover:border-[#FF007A] transition-all duration-300 text-center"
                >
                  {t("visitWebsite")}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Time & Date */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2 rtl:space-x-reverse">
                <svg
                  className="w-6 h-6 text-[#FF007A]"
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
                <span>{t("dateRange")}</span>
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#a0a0a0] mb-1">{t("startTime")}</p>
                  <p className="text-lg text-white">{formatDate(event.startTime)}</p>
                </div>
                {event.endTime && (
                  <div>
                    <p className="text-sm text-[#a0a0a0] mb-1">{t("endTime")}</p>
                    <p className="text-lg text-white">{formatDate(event.endTime)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Locations */}
            {event.places && event.places.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2 rtl:space-x-reverse">
                    <svg
                      className="w-6 h-6 text-[#FF007A]"
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
                    <span>{t("locations")}</span>
                  </h2>
                  <button
                    onClick={handleViewRoute}
                    className="px-4 py-2 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white text-sm rounded-lg font-medium hover:shadow-lg hover:shadow-[#FF007A]/50 transition-all duration-300"
                  >
                    {t("viewRoute")}
                  </button>
                </div>
                <div className="space-y-3">
                  {event.places.map((place, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#1a1a1a] border border-[#333] rounded-xl hover:border-[#FF007A] transition-colors"
                    >
                      <div className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF007A] to-[#7B2FF7] flex items-center justify-center flex-shrink-0 text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{place.name}</h3>
                          {place.description && (
                            <p className="text-sm text-[#a0a0a0] mt-1">{place.description}</p>
                          )}
                          {place.address && (
                            <p className="text-xs text-[#666] mt-2">{place.address}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {showMap && event.places && event.places.length > 0 && (
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl overflow-hidden">
                <div className="h-96">
                  <InteractiveMap />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">{t("eventDetails")}</h2>
              <div className="space-y-4">
                {/* Price */}
                <div>
                  <p className="text-sm text-[#a0a0a0] mb-1">{t("ticketPrice")}</p>
                  <p className="text-lg font-semibold text-white">{event.ticketPrice || t("free")}</p>
                </div>

                {/* Registration */}
                {event.registrationRequired !== undefined && (
                  <div>
                    <p className="text-sm text-[#a0a0a0] mb-1">{t("registrationRequired")}</p>
                    <p className="text-lg font-semibold text-white">
                      {event.registrationRequired ? "✓" : "✗"}
                    </p>
                  </div>
                )}

                {/* Capacity */}
                {(event.maxAttendees || event.capacity) && (
                  <div>
                    <p className="text-sm text-[#a0a0a0] mb-1">{t("capacity")}</p>
                    <p className="text-lg font-semibold text-white">
                      {event.maxAttendees || event.capacity || t("unlimited")}
                    </p>
                  </div>
                )}

                {/* Organizer */}
                {event.organizer && (
                  <div>
                    <p className="text-sm text-[#a0a0a0] mb-1">{t("organizer")}</p>
                    <p className="text-lg font-semibold text-white">
                      {event.organizer.first_name} {event.organizer.last_name}
                    </p>
                    {event.organizer.email && (
                      <p className="text-sm text-[#666] mt-1">{event.organizer.email}</p>
                    )}
                  </div>
                )}

                {/* Registrar */}
                {event.registrar && (
                  <div>
                    <p className="text-sm text-[#a0a0a0] mb-1">{t("registrar")}</p>
                    <p className="text-lg font-semibold text-white">
                      {event.registrar.first_name} {event.registrar.last_name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
