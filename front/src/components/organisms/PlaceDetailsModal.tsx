"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Image from "next/image";
import { getImageUploadUrl } from "@/utils/imageUrl";
import CommentSection, { MinimalComment } from "../organisms/CommentSection";
import { get as getPlace } from "@/app/actions/place";
import { get as getVirtualTour } from "@/app/actions/virtual_tour/get";
import { placeSchema, virtual_tourSchema } from "@/types/declarations/selectInp";
import VirtualTourPreview from "@/components/organisms/VirtualTourPreview";
import dynamic from "next/dynamic";

const PhotoSphereViewer = dynamic(() => import("@/components/organisms/PhotoSphereViewer"), {
  ssr: false,
});

interface PlaceDetailsModalProps {
  placeId: string;
  place?: placeSchema;
  onClose: () => void;
  onLaunchVirtualTour?: (tourId: string) => void;
}

const PlaceDetailsModal: React.FC<PlaceDetailsModalProps> = ({ placeId, onClose }) => {
  const t = useTranslations();
  const locale = useLocale();
  const [place, setPlace] = useState<placeSchema | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showVirtualTourSelector, setShowVirtualTourSelector] = useState(false);
  const [activeTour, setActiveTour] = useState<virtual_tourSchema | null>(null);
  const [tourLoading, setTourLoading] = useState(false);
  const [tourLoaded, setTourLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const HEADER_MAX = 256;
  const HEADER_MIN = 72;
  const COLLAPSE_RANGE = HEADER_MAX - HEADER_MIN;

  const scrollY = useMotionValue(0);
  const headerHeight = useTransform(scrollY, [0, COLLAPSE_RANGE], [HEADER_MAX, HEADER_MIN]);
  const imageOpacity = useTransform(scrollY, [0, COLLAPSE_RANGE * 0.6], [1, 0.35]);
  const imageScale = useTransform(scrollY, [0, COLLAPSE_RANGE], [1, 1.18]);
  const miniTitleOpacity = useTransform(scrollY, [COLLAPSE_RANGE * 0.6, COLLAPSE_RANGE], [0, 1]);
  const overlayDarkness = useTransform(scrollY, [0, COLLAPSE_RANGE], [0.4, 0.75]);

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollY.set(e.currentTarget.scrollTop);
  };

  const handleLaunchVirtualTour = async (tourId: string) => {
    setTourLoading(true);
    setTourLoaded(false);
    try {
      const result = await getVirtualTour({
        set: { _id: tourId },
        get: {
          _id: 1,
          name: 1,
          description: 1,
          status: 1,
          panorama: { _id: 1, name: 1, mimType: 1, alt_text: 1 },
          place: { _id: 1, name: 1 },
          hotspots: 1,
        },
      });
      if (result.success && result.body[0]) {
        setActiveTour(result.body[0]);
        setShowVirtualTourSelector(false);
      }
    } finally {
      setTourLoading(false);
    }
  };

  const handleCloseTour = () => {
    setActiveTour(null);
    setTourLoaded(false);
    setShowVirtualTourSelector(true);
  };

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true);
      try {
        const result = await getPlace({
          set: { _id: placeId },
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
            registrar: { _id: 1, first_name: 1, last_name: 1, email: 1, level: 1 },
            province: { _id: 1, name: 1, english_name: 1 },
            city: { _id: 1, name: 1, english_name: 1 },
            category: { _id: 1, name: 1, color: 1, icon: 1 },
            tags: { _id: 1, name: 1, color: 1, icon: 1 },
            thumbnail: { _id: 1, name: 1, mimType: 1, alt_text: 1 },
            gallery: { _id: 1, name: 1, mimType: 1, alt_text: 1 },
            comments: {
              _id: 1,
              text: 1,
              rating: 1,
              status: 1,
              is_anonymous: 1,
              user: {
                _id: 1,
                first_name: 1,
                last_name: 1,
                email: 1,
                level: 1,
                is_verified: 1,
                avatar: { _id: 1, name: 1, mimType: 1, alt_text: 1 },
              },
            },
            virtual_tours: { _id: 1, name: 1, status: 1 },
          },
        });

        if (result.success) {
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

    fetchPlaceDetails();
  }, [placeId]);

  useEffect(() => {
    if (place?._id) {
      setActiveImageIndex(0);
    }
  }, [place?._id]);

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isGalleryOpen) {
          setIsGalleryOpen(false);
        } else {
          onClose();
        }
        return;
      }

      if (!isGalleryOpen || !place?.gallery?.length) return;

      if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev === 0 ? place.gallery!.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev === place.gallery!.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isGalleryOpen, place?.gallery]);

  // Scroll active thumbnail into view when gallery is open
  useEffect(() => {
    if (!isGalleryOpen || !thumbnailStripRef.current) return;
    const strip = thumbnailStripRef.current;
    const activeThumbnail = strip.children[activeImageIndex] as HTMLElement;
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeImageIndex, isGalleryOpen]);

  const hasVirtualTours = place?.virtual_tours && place.virtual_tours.length > 0;
  const hasGallery = place?.gallery && place.gallery.length > 0;

  const headerImage =
    place?.thumbnail?.name ||
    (hasGallery && place?.gallery?.[0]?.name) ||
    "/images/placeholder-image.jpg";

  const navigatePrev = () => {
    setActiveImageIndex((prev) => (prev === 0 ? (place?.gallery?.length ?? 1) - 1 : prev - 1));
  };

  const navigateNext = () => {
    setActiveImageIndex((prev) => (prev === (place?.gallery?.length ?? 1) - 1 ? 0 : prev + 1));
  };

  if (!place && loading) {
    return (
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-xl z-60 flex items-center justify-center">
        <div className="relative rounded-2xl bg-[#0a0a00] shadow-2xl flex flex-col border border-[#333] shadow-[0_0_60px_rgba(255,0,122,0.2)] p-8 text-center">
          <p className="text-white">{t("Common.loading")}</p>
        </div>
      </div>
    );
  }

  if (!place) return null;

  return (
    <>
      {/* ── Main Modal ── */}
      <AnimatePresence>
        <motion.div
          key={`place-modal-${placeId}`}
          className="fixed top-0 right-0 bottom-0 w-full max-w-xl z-60 flex flex-col bg-[#0a0a00] border-l border-[#333] shadow-[-8px_0_40px_rgba(0,0,0,0.6)]"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          {/* Header image — collapses on scroll */}
          <motion.div
            style={{ height: headerHeight }}
            className="relative w-full overflow-hidden shrink-0 rounded-none"
          >
            {headerImage && (
              <motion.div
                style={{ scale: imageScale, opacity: imageOpacity }}
                className="absolute inset-0 origin-center"
              >
                <Image
                  src={getImageUploadUrl(headerImage, "images")}
                  alt={place.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            )}

            {/* Gradient overlay — darkens as header collapses */}
            <motion.div
              style={{ opacity: overlayDarkness }}
              className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent pointer-events-none"
            />

            {/* Mini title — fades in when header is collapsed, centered between buttons */}
            <motion.div
              style={{ opacity: miniTitleOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none px-24"
            >
              <p className="text-white font-semibold text-sm truncate drop-shadow text-center">
                {place.name}
              </p>
            </motion.div>

            <div className="absolute inset-0 p-4 flex justify-between items-start">
              {/* Close button */}
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

              {/* Action buttons */}
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
                    onClick={() => setIsGalleryOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] hover:bg-[#2a2a2a] transition-colors text-white shadow-lg"
                    aria-label={t("place.gallery")}
                  >
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
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Scrollable content */}
          <div
            ref={contentScrollRef}
            onScroll={handleContentScroll}
            className="flex-grow overflow-y-auto p-6"
          >
            {/* Title & category */}
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
                    style={{ backgroundColor: place.category.color || "#FF007A", color: "#fff" }}
                  >
                    {place.category.icon && (
                      <span className="text-xs">
                        {place.category.icon.startsWith("fa-") ? (
                          <i className={`fa ${place.category.icon}`} />
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
                        backgroundColor: tag.color ? `${tag.color}20` : "rgba(30,30,30,0.5)",
                        color: tag.color || "#a0a0a0",
                        border: `1px solid ${tag.color || "#333"}40`,
                      }}
                    >
                      {tag.icon && (
                        <span className="text-xs">
                          {tag.icon.startsWith("fa-") ? <i className={`fa ${tag.icon}`} /> : tag.icon}
                        </span>
                      )}
                      {tag.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="p-4 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {place?.address && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-1">{t("place.address")}</h3>
                    <p className="text-sm text-[#a0a0a0]">{place.address}</p>
                  </div>
                )}
                {place?.hoursOfOperation && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-white mb-1">{t("place.hours")}</h3>
                    <p className="text-sm text-[#a0a0a0]">{place.hoursOfOperation}</p>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="p-4 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
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

            {/* Gallery preview (inside modal) */}
            {hasGallery && place?.gallery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl"
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white">{t("place.gallery")}</h3>
                  <motion.button
                    onClick={() => setIsGalleryOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-xs text-[#FF007A] hover:text-[#ff339c] flex items-center gap-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
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
                    {t("Common.fullscreen") ?? "Fullscreen"}
                  </motion.button>
                </div>

                {/* Current image */}
                <div
                  className="relative aspect-video mb-3 overflow-hidden rounded-xl group cursor-pointer"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  {place.gallery[activeImageIndex] && (
                    <Image
                      src={getImageUploadUrl(place.gallery[activeImageIndex].name, "images")}
                      alt={`${place.name} - ${activeImageIndex + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {/* Expand hint overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="p-3 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
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
                    </div>
                  </div>

                  {place.gallery.length > 1 && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigatePrev();
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
                          navigateNext();
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

                      <div className="absolute bottom-2 right-2 bg-[#1e1e1e]/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-[#333] shadow-lg">
                        {activeImageIndex + 1} / {place.gallery.length}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {place.gallery.length > 1 && (
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
                        className={`aspect-square rounded-lg overflow-hidden relative border-2 transition-all duration-200 ${
                          activeImageIndex === index
                            ? "border-[#FF007A] ring-2 ring-[#FF007A]/30 shadow-lg"
                            : "border-[#333] hover:border-[#FF007A]/50"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={getImageUploadUrl(image.name, "images")}
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

            {/* Comments */}
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

          {/* Footer */}
          <div className="border-t border-[#333] p-6 flex justify-between items-center bg-gradient-to-b from-[#1a1a1a]/70 to-[#0a0a00]/70 backdrop-blur-sm shrink-0">
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
      </AnimatePresence>

      {/* ── Fullscreen Gallery Lightbox ── */}
      <AnimatePresence>
        {isGalleryOpen && hasGallery && place?.gallery && (
          <motion.div
            key="gallery-lightbox"
            className="fixed inset-0 z-[70] flex flex-col bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Top bar */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur-md">
              {/* Back to modal */}
              <motion.button
                onClick={() => setIsGalleryOpen(false)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1e1e1e] border border-[#333] hover:bg-[#2a2a2a] text-white text-sm font-medium transition-colors shadow"
                aria-label={t("Common.back") ?? "Back"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#FF007A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">{t("Common.back") ?? "Back"}</span>
              </motion.button>

              {/* Place name */}
              <h2 className="text-white font-semibold text-sm sm:text-base truncate max-w-[40%] text-center">
                {place.name}
              </h2>

              {/* Image counter + close */}
              <div className="flex items-center gap-3">
                <span className="text-[#a0a0a0] text-sm tabular-nums">
                  {activeImageIndex + 1} <span className="text-[#555]">/</span> {place.gallery.length}
                </span>
                <motion.button
                  onClick={() => setIsGalleryOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-[#1e1e1e] border border-[#333] hover:bg-[#2a2a2a] transition-colors"
                  aria-label={t("Common.close")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-[#FF007A]"
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
              </div>
            </div>

            {/* Main image viewer */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  className="relative w-full h-full"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.18 }}
                >
                  <Image
                    src={getImageUploadUrl(place.gallery[activeImageIndex].name, "images")}
                    alt={
                      place.gallery[activeImageIndex].alt_text ||
                      `${place.name} - ${activeImageIndex + 1}`
                    }
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev arrow */}
              {place.gallery.length > 1 && (
                <motion.button
                  onClick={navigatePrev}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="absolute left-3 sm:left-5 p-3 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-all shadow-xl z-10"
                  aria-label={t("Common.previous")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#FF007A]"
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
              )}

              {/* Next arrow */}
              {place.gallery.length > 1 && (
                <motion.button
                  onClick={navigateNext}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  className="absolute right-3 sm:right-5 p-3 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-all shadow-xl z-10"
                  aria-label={t("Common.next")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-[#FF007A]"
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
              )}

              {/* Alt text caption */}
              {place.gallery[activeImageIndex]?.alt_text && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#1e1e1e]/80 backdrop-blur-sm text-[#a0a0a0] text-xs px-4 py-1.5 rounded-full border border-[#333] max-w-[80%] truncate">
                  {place.gallery[activeImageIndex].alt_text}
                </div>
              )}
            </div>

            {/* Thumbnail strip — always visible at the bottom */}
            {place.gallery.length > 1 && (
              <div className="shrink-0 border-t border-[#222] bg-[#0a0a0a]/90 backdrop-blur-md py-3 px-3">
                <div
                  ref={thumbnailStripRef}
                  className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent pb-1"
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {place.gallery.map((image, index) => (
                    <motion.button
                      key={image._id || `thumb-${index}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        activeImageIndex === index
                          ? "border-[#FF007A] ring-2 ring-[#FF007A]/40 shadow-lg shadow-[#FF007A]/20"
                          : "border-[#333] opacity-60 hover:opacity-90 hover:border-[#FF007A]/50"
                      }`}
                      style={{ scrollSnapAlign: "start" }}
                      aria-label={`Image ${index + 1}`}
                    >
                      <Image
                        src={getImageUploadUrl(image.name, "images")}
                        alt={image.alt_text || `${place.name} - ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      {activeImageIndex === index && (
                        <div className="absolute inset-0 bg-[#FF007A]/10" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Virtual Tour Selector */}
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

      {/* Inline Virtual Tour Overlay */}
      <AnimatePresence>
        {(activeTour || tourLoading) && (
          <motion.div
            className="fixed inset-0 z-70 flex items-center justify-center bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {tourLoading ? (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF007A]"></div>
                <p className="mt-4 text-white">{t("virtualTour.loading")}</p>
              </div>
            ) : activeTour && activeTour.panorama?.name ? (
              <div className="relative w-full h-full">
                <div className="absolute top-4 left-4 z-10 bg-[#1e1e1e]/80 backdrop-blur-sm rounded-xl p-4 border border-[#333] max-w-xs">
                  <h1 className="text-xl font-bold text-white truncate">{activeTour.name}</h1>
                  {activeTour.description && (
                    <p className="text-[#a0a0a0] text-sm mt-2 line-clamp-2">
                      {activeTour.description}
                    </p>
                  )}
                  {activeTour.place?.name && (
                    <div className="mt-2 text-xs text-[#a0a0a0]">
                      <span>{activeTour.place.name}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCloseTour}
                  className="absolute top-4 right-4 z-10 p-3 rounded-full bg-[#1e1e1e]/80 backdrop-blur-sm border border-[#333] text-white hover:bg-[#2a2a2a] transition-colors shadow-lg"
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
                </button>

                <PhotoSphereViewer
                  panoramaUrl={getImageUploadUrl(activeTour.panorama.name, "images")}
                  height="100vh"
                  width="100%"
                  hotspots={(activeTour.hotspots || []).map((hotspot, index) => ({
                    ...hotspot,
                    id: `hotspot-${index}`,
                  }))}
                  onReady={() => setTourLoaded(true)}
                />

                {!tourLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a00]">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF007A]"></div>
                      <p className="mt-4 text-white">{t("virtualTour.loading")}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlaceDetailsModal;
