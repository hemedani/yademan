"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Image from "next/image";
import { getLesanBaseUrl } from "@/services/api";
import CommentSection, { MinimalComment } from "../organisms/CommentSection";
import { get as getPlace } from "@/app/actions/place";
import { placeSchema, virtual_tourSchema } from "@/types/declarations/selectInp";
import VirtualTourPreview from "@/components/organisms/VirtualTourPreview";

interface PlaceDetailsModalProps {
  placeId: string;
  place?: placeSchema; // Optional - if provided, use it as initial data
  onClose: () => void;
  onLaunchVirtualTour?: (tourId: string) => void;
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({
  placeId,
  place: initialPlace,
  onClose,
  onLaunchVirtualTour,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const [place, setPlace] = useState<placeSchema | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showVirtualTourSelector, setShowVirtualTourSelector] = useState(false);
  const [loading, setLoading] = useState(true); // Always show loading initially when fetching

  // Use the router to navigate to the virtual tour page
  const handleLaunchVirtualTour = (tourId: string) => {
    router.push(`/${locale}/virtual-tour/${tourId}`);
    onClose();
  };

  // Fetch place details when modal opens
  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true);
      try {
        // Fetch the place with all details including comments
        const result = await getPlace({
          set: {
            _id: placeId,
          },
          get: {
            _id: 1,
            name: 1,
            description: 1,
            slug: 1,
            center: 1,
            area: 1,
            address: 1,
            contact: 1,
            hoursOfOperation: 1,
            meta: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1,
            registrar: {
              _id: 1,
              first_name: 1,
              last_name: 1,
              email: 1,
              level: 1,
            },
            province: {
              _id: 1,
              name: 1,
              english_name: 1,
            },
            city: {
              _id: 1,
              name: 1,
              english_name: 1,
            },
            category: {
              _id: 1,
              name: 1,
              description: 1,
              color: 1,
              icon: 1,
            },
            tags: {
              _id: 1,
              name: 1,
              description: 1,
              color: 1,
              icon: 1,
            },
            thumbnail: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
            },
            gallery: {
              _id: 1,
              name: 1,
              mimType: 1,
              size: 1,
              alt_text: 1,
            },
            comments: {
              _id: 1,
              text: 1,
              rating: 1,
              status: 1,
              is_anonymous: 1,
              createdAt: 1,
              updatedAt: 1,
              user: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
                level: 1,
                is_verified: 1,
                avatar: {
                  _id: 1,
                  name: 1,
                  mimType: 1,
                  size: 1,
                  alt_text: 1,
                  createdAt: 1,
                  updatedAt: 1,
                },
              },
            },
            virtual_tours: {
              _id: 1,
              name: 1,
              description: 1,
              status: 1,
              createdAt: 1,
              updatedAt: 1,
            },
          },
        });

        if (result.success) {
          // Ensure comments is always an array, even if the API returns different structure
          const placeData = result.body[0];
          const normalizedPlaceData = {
            ...placeData,
            comments: Array.isArray(placeData.comments) ? placeData.comments : [],
          } as placeSchema;
          setPlace(normalizedPlaceData);
        } else {
          throw new Error(result.body);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setLoading(false);
      }
    };

    // We always fetch full details to ensure we have comments and other required data
    // Even if initialPlace is provided, it might be minimal data from the map
    fetchPlaceDetails();
  }, [placeId]);

  // Reset image index when place changes
  useEffect(() => {
    if (place?._id) {
      setActiveImageIndex(0);
    }
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

  // Check if the place has virtual tours
  const hasVirtualTours = place?.virtual_tours && place?.virtual_tours.length > 0;

  // Check if the place has gallery images
  const hasGallery = place?.gallery && place?.gallery.length > 0;

  // Determine what image to show in the header
  const headerImage =
    place?.thumbnail?.name ||
    (hasGallery && place?.gallery?.[0]?.name) ||
    "/images/placeholder-image.jpg";

  // If no place and loading, show loading indicator
  if (!place && loading) {
    return (
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-0">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative max-w-md rounded-2xl bg-[#0a0a00]/60 backdrop-blur-3xl shadow-2xl flex flex-col border border-[#333] shadow-[0_0_60px_rgba(255,0,122,0.2)] p-8 text-center">
          <p className="text-white">{t("Common.loading")}</p>
        </div>
      </div>
    );
  }

  // If no place after loading, don't render
  if (!place) return null;

  return (
    <AnimatePresence>
      <div
        key={`place-modal-${placeId}`}
        className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-0"
      >
        <motion.div
          className="fixed inset-0 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className={`
            relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0a0a00]/60 backdrop-blur-3xl shadow-2xl
            flex flex-col border border-[#333] shadow-[0_0_60px_rgba(255,0,122,0.2)]
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent p-4 flex justify-between items-start group">
              {/* Back button */}
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] hover:bg-[#2a2a2a] transition-colors text-white shadow-lg"
                aria-label={t("Common.close")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#FF007A]"
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
              </motion.button>

              {/* Actions */}
              <div className="flex gap-2">
                {hasVirtualTours && place.virtual_tours && (
                  <motion.button
                    onClick={() => setShowVirtualTourSelector(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 py-2 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FF007A]/30"
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
                  </motion.button>
                )}

                {hasGallery && (
                  <motion.button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] hover:bg-[#2a2a2a] transition-colors text-white shadow-lg"
                    aria-label={isFullScreen ? t("Common.close") : t("Common.moreInfo")}
                  >
                    {isFullScreen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-[#FF007A]"
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
                        className="h-6 w-6 text-[#A020F0]"
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
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {/* Title and category */}
            <motion.div
              className="mb-6 p-6 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                {place.category && (
                  <span
                    className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1"
                    style={{
                      backgroundColor: place.category.color || "#FF007A",
                      color: "#fff",
                    }}
                  >
                    {place.category.icon && (
                      <span className="text-xs">
                        {place.category.icon.startsWith("fa-") ? (
                          <i className={`fa ${place.category.icon}`}></i>
                        ) : (
                          place.category.icon
                        )}
                      </span>
                    )}
                    {place.category.name}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white">{place.name}</h2>
            </motion.div>

            {/* Description */}
            <motion.div
              className="mb-6 p-6 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-[#a0a0a0] leading-relaxed whitespace-pre-line">{place.description}</p>
            </motion.div>

            {/* Tags */}
            {place.tags && place.tags.length > 0 && (
              <motion.div
                className="mb-6 p-6 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-medium text-white mb-3">{t("place.tags")}</h3>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag, index) => (
                    <motion.span
                      key={tag._id || `tag-${index}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1"
                      style={{
                        backgroundColor: tag.color ? `${tag.color}20` : "rgba(30, 30, 30, 0.5)",
                        color: tag.color || "#a0a0a0",
                        border: `1px solid ${tag.color || "#333"}40`,
                      }}
                    >
                      {tag.icon && (
                        <span className="text-xs">
                          {tag.icon.startsWith("fa-") ? (
                            <i className={`fa ${tag.icon}`}></i>
                          ) : (
                            tag.icon
                          )}
                        </span>
                      )}
                      {tag.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Info & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <motion.div
                className="p-4 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {/* Address */}
                {place?.address && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-1">{t("place.address")}</h3>
                    <p className="text-sm text-[#a0a0a0]">{place.address}</p>
                  </div>
                )}

                {/* Hours of Operation */}
                {place?.hoursOfOperation && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-1">{t("place.hours")}</h3>
                    <p className="text-sm text-[#a0a0a0]">{place.hoursOfOperation}</p>
                  </div>
                )}
              </motion.div>

              {/* Right column */}
              <motion.div
                className="p-4 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {/* Contact */}
                {place?.contact &&
                  Object.keys(place.contact).some(
                    (key) => !!place.contact?.[key as keyof typeof place.contact],
                  ) && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-white mb-1">{t("place.contact")}</h3>
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
                              {place.contact.website.replace(/^https?:\/\//, "")}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </motion.div>
            </div>

            {/* Gallery */}
            {hasGallery && place?.gallery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm font-medium text-white mb-3">{t("place.gallery")}</h3>

                {/* Current Image */}
                <div className="relative aspect-video mb-3 overflow-hidden rounded-lg group">
                  {place.gallery && place.gallery[activeImageIndex] && (
                    <Image
                      src={`${getLesanBaseUrl()}/uploads/images/${place.gallery[activeImageIndex].name}`}
                      alt={`${place.name} - ${activeImageIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Navigation arrows - only show if there are multiple images */}
                  {place.gallery && place.gallery.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
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
                          className="h-5 w-5 text-[#FF007A]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
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
                          className="h-5 w-5 text-[#FF007A]"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </motion.button>

                      {/* Image counter */}
                      <div className="absolute bottom-2 right-2 bg-[#1e1e1e]/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-[#333] shadow-lg">
                        {activeImageIndex + 1} / {place.gallery.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {place.gallery && place.gallery.length > 1 && (
                  <motion.div
                    className="grid grid-cols-5 sm:grid-cols-6 gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {place.gallery.map((image, index) => (
                      <motion.button
                        key={image._id || `image-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`
                          aspect-square rounded-lg overflow-hidden relative border-2 transition-all duration-200
                          ${
                            activeImageIndex === index
                              ? "border-[#FF007A] ring-2 ring-[#FF007A]/30 shadow-lg"
                              : "border-[#333] hover:border-[#FF007A]/50"
                          }
                        `}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={`${getLesanBaseUrl()}/uploads/images/${image.name}`}
                          alt={`${place.name} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Comment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 p-6 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
            >
              <CommentSection
                placeId={place._id!}
                placeComments={
                  place.comments && Array.isArray(place.comments)
                    ? (place.comments as unknown as MinimalComment[])
                    : []
                }
              />
            </motion.div>
          </div>

          {/* Footer with call-to-action buttons */}
          <div className="border-t border-[#333] p-6 flex justify-between items-center bg-gradient-to-b from-[#1a1a1a]/70 to-[#0a0a00]/70 backdrop-blur-sm">
            <div className="text-sm text-[#a0a0a0]">
              <span>{t("place.lastUpdated")}: </span>
              <time dateTime={place?.updatedAt ? new Date(place.updatedAt).toISOString() : ""}>
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
              {hasVirtualTours && place?.virtual_tours && (
                <motion.button
                  onClick={() => setShowVirtualTourSelector(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FF007A]/30"
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
                </motion.button>
              )}

              {/* Directions button */}
              {place?.center?.coordinates && place.center.coordinates.length >= 2 && (
                <motion.a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.center.coordinates[1]},${place.center.coordinates[0]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-[#1e1e1e] border border-[#333] hover:bg-[#2a2a2a] text-white rounded-md text-sm font-medium flex items-center gap-2 transition-all hover:shadow-lg"
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
                </motion.a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Virtual Tour Selector Modal */}
      <AnimatePresence>
        {showVirtualTourSelector && place?.virtual_tours && place.virtual_tours.length > 0 ? (
          <VirtualTourPreview
            virtualTours={place.virtual_tours as unknown as virtual_tourSchema[]}
            placeName={place.name}
            onClose={() => setShowVirtualTourSelector(false)}
            onLaunchVirtualTour={handleLaunchVirtualTour}
          />
        ) : null}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default PlaceDetailsModal;
