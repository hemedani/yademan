import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { getLesanBaseUrl } from "@/services/api";
import { virtual_tourSchema } from "@/types/declarations/selectInp";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface VirtualTourPreviewProps {
  virtualTours: virtual_tourSchema[];
  placeName: string;
  onClose: () => void;
  onLaunchVirtualTour?: (tourId: string) => void; // Optional since we're navigating directly now
}

const VirtualTourPreview: React.FC<VirtualTourPreviewProps> = ({
  virtualTours,
  placeName,
  onClose,
  onLaunchVirtualTour,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const handleLaunchVirtualTour = (tourId: string) => {
    // If onLaunchVirtualTour prop is provided, use it (e.g., from parent components)
    if (onLaunchVirtualTour) {
      onLaunchVirtualTour(tourId);
    } else {
      // Otherwise, navigate directly to the virtual tour page
      router.push(`/${locale}/virtual-tour/${tourId}`);
    }
    onClose(); // Close the preview modal
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-0">
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-[#0a0a00]/80 backdrop-blur-3xl shadow-2xl flex flex-col border border-[#333] shadow-[0_0_60px_rgba(255,0,122,0.2)]"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#333]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {t("place.virtualTours")} - {placeName}
              </h2>
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
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-y-auto p-6">
            {virtualTours.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {t("place.noVirtualToursAvailable")}
                </h3>
                <p className="text-[#a0a0a0]">
                  {t("place.noVirtualToursDescription")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {virtualTours.map((tour, index) => (
                  <motion.div
                    key={tour._id || `tour-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-[#1e1e1e]/50 to-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#333] shadow-xl overflow-hidden hover:shadow-[0_0_25px_rgba(255,0,122,0.15)] transition-all duration-300"
                  >
                    <div className="relative h-48 overflow-hidden">
                      {tour.panorama?.name ? (
                        <Image
                          src={`${getLesanBaseUrl()}/uploads/images/${tour.panorama.name}`}
                          alt={tour.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#FF007A] to-[#A020F0] flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-white opacity-70"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-[#1e1e1e]/80 backdrop-blur-sm text-xs text-white rounded-full border border-[#333]">
                          {tour.status === "active"
                            ? t("Common.active")
                            : tour.status === "draft"
                              ? t("Common.draft")
                              : t("Common.archived")}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-2 truncate">
                        {tour.name}
                      </h3>
                      {tour.description && (
                        <p className="text-[#a0a0a0] text-sm mb-4 line-clamp-2">
                          {tour.description}
                        </p>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLaunchVirtualTour(tour._id!)}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-[#FF007A] to-[#A020F0] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-[#FF007A]/30"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("place.launchVirtualTour")}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VirtualTourPreview;
