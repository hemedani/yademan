"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { PlaceData } from "@/components/atoms/PlaceMarker";
import { getLesanBaseUrl } from "@/services/api";

interface PlaceDetailsModalProps {
  place: PlaceData | null;
  onClose: () => void;
  onLaunchVirtualTour?: (tourId: string) => void;
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  place,
  onClose,
  onLaunchVirtualTour,
}) => {
  const t = useTranslations();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Reset image index when place changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [place?._id]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullScreen) {
          setIsFullScreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [onClose, isFullScreen]);

  // If no place, don't render
  if (!place) return null;

  // Check if the place has virtual tours
  const hasVirtualTours =
    place?.virtual_tours && place.virtual_tours.length > 0;

  // Check if the place has gallery images
  const hasGallery = place?.gallery ? place.gallery.length > 0 : false;

  // Determine what image to show in the header
  const headerImage =
    place?.thumbnail?.name ||
    (hasGallery && place.gallery?.[0]?.name) ||
    "/images/placeholder-image.jpg";

  return (
    <AnimatePresence mode="wait">
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
        <motion.div
          className="fixed inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className={`
            relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-lg bg-[#121212] shadow-xl
            flex flex-col border border-[#333]
            ${isFullScreen ? "fixed inset-0 max-w-none max-h-none rounded-none" : ""}
          `}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header with image */}
          <div className="relative h-64 w-full overflow-hidden">
            {headerImage && (
              <Image
                src={`${getLesanBaseUrl()}/uploads/images/${headerImage}`}
                alt={place.name}
                fill
                className="object-cover"
                priority
              />
            )}

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent p-4 flex justify-between items-start">
              {/* Back button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-[#1e1e1e] hover:bg-[#333] transition-colors text-white"
                aria-label={t("Common.close")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Actions */}
              <div className="flex gap-2">
                {hasVirtualTours && place.virtual_tours && (
                  <button
                    onClick={() =>
                      onLaunchVirtualTour?.(place.virtual_tours![0]._id!)
                    }
                    className="px-3 py-2 bg-[#FF007A] hover:bg-[#ff339c] text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("place.virtualTour")}
                  </button>
                )}

                {hasGallery && (
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
                    aria-label={
                      isFullScreen ? t("Common.close") : t("Common.moreInfo")
                    }
                  >
                    {isFullScreen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-6">
            {/* Title and category */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                {place.category && (
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
                    style={{
                      backgroundColor: place.category.color || "#FF007A",
                      color: "#fff",
                    }}
                  >
                    {place.category.name}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white">{place.name}</h2>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none mb-6 text-[#a0a0a0]">
              <p>{place.description}</p>
            </div>

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white mb-2">
                  {t("place.tags")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#1e1e1e] text-white border border-[#333]"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div>
                {/* Address */}
                {place?.address && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-1">
                      {t("place.address")}
                    </h3>
                    <p className="text-sm text-[#a0a0a0]">{place.address}</p>
                  </div>
                )}

                {/* Hours of Operation */}
                {place?.hoursOfOperation && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-1">
                      {t("place.hours")}
                    </h3>
                    <p className="text-sm text-[#a0a0a0]">
                      {place.hoursOfOperation}
                    </p>
                  </div>
                )}
              </div>

              {/* Right column */}
              <div>
                {/* Contact */}
                {place?.contact &&
                  Object.keys(place.contact).some(
                    (key) =>
                      !!place.contact?.[key as keyof typeof place.contact],
                  ) && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-white mb-1">
                        {t("place.contact")}
                      </h3>
                      <div className="space-y-1">
                        {place.contact.phone && (
                          <p className="text-sm text-[#a0a0a0] flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {place.contact.phone}
                          </p>
                        )}

                        {place.contact.email && (
                          <p className="text-sm text-[#a0a0a0] flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            {place.contact.email}
                          </p>
                        )}

                        {place.contact.website && (
                          <p className="text-sm text-[#a0a0a0] flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                              />
                            </svg>
                            <a
                              href={place.contact.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF007A] hover:text-[#ff339c] transition-colors"
                            >
                              {place.contact.website.replace(
                                /^https?:\/\//,
                                "",
                              )}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Gallery */}
            {hasGallery && place?.gallery && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-white mb-3">
                  {t("place.gallery")}
                </h3>

                {/* Current Image */}
                <div className="relative aspect-video mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={`${getLesanBaseUrl()}/uploads/images/${place.gallery[activeImageIndex]?.name || ""}`}
                    alt={`${place?.name || "Place"} - ${activeImageIndex + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Navigation arrows */}
                  {place?.gallery && place.gallery.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-[#1e1e1e] text-white hover:bg-[#333] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) =>
                            prev === 0 ? place.gallery!.length - 1 : prev - 1,
                          );
                        }}
                        aria-label={t("Common.previous")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-[#1e1e1e] text-white hover:bg-[#333] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) =>
                            prev === place.gallery!.length - 1 ? 0 : prev + 1,
                          );
                        }}
                        aria-label={t("Common.next")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Image counter */}
                      <div className="absolute bottom-2 right-2 bg-[#1e1e1e] text-white text-xs px-2 py-1 rounded-md border border-[#333]">
                        {activeImageIndex + 1} / {place.gallery?.length || 0}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {place?.gallery && place.gallery.length > 1 && (
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {place.gallery.map((image, index) => (
                      <button
                        key={image._id}
                        className={`
                          aspect-square rounded-md overflow-hidden relative border border-[#333]
                          ${activeImageIndex === index ? "ring-2 ring-[#FF007A]" : "hover:opacity-90"}
                        `}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={`${getLesanBaseUrl()}/uploads/images/${image.name}`}
                          alt={`${place.name} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer with call-to-action buttons */}
          <div className="border-t border-[#333] p-4 flex justify-between items-center">
            <div className="text-sm text-[#a0a0a0]">
              <span>{t("place.lastUpdated")}: </span>
              <time
                dateTime={
                  place?.updatedAt
                    ? new Date(place.updatedAt).toISOString()
                    : ""
                }
              >
                {place?.updatedAt
                  ? new Intl.DateTimeFormat(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }).format(new Date(place.updatedAt))
                  : "-"}
              </time>
            </div>

            <div className="flex gap-2">
              {hasVirtualTours &&
                place?.virtual_tours &&
                place.virtual_tours[0]?._id && (
                  <button
                    onClick={() =>
                      onLaunchVirtualTour?.(place.virtual_tours![0]._id!)
                    }
                    className="px-4 py-2 bg-[#FF007A] hover:bg-[#ff339c] text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t("place.virtualTour")}
                  </button>
                )}

              {/* Directions button */}
              {place?.center?.coordinates &&
                place.center.coordinates.length >= 2 && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.center.coordinates[1]},${place.center.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1e1e1e] border border-[#333] hover:bg-[#333] text-white rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    {t("place.directions")}
                  </a>
                )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PlaceDetailsModal;
