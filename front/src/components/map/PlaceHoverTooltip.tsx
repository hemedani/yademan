"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { placeSchema } from "@/types/declarations/selectInp";
import { getLesanBaseUrl } from "@/services/api";

interface PlaceHoverTooltipProps {
  place: placeSchema;
  position: { x: number; y: number };
}

const PlaceHoverTooltip: React.FC<PlaceHoverTooltipProps> = ({
  place,
  position,
}) => {
  // Extract thumbnail URL from place data
  const thumbnailUrl = place.thumbnail?.name
    ? `${getLesanBaseUrl()}/uploads/images/${place.thumbnail.name}`
    : "/placeholder-image.jpg";

  // Check if we have tags to display
  const hasTags = place.tags && place.tags.length > 0;

  return (
    <motion.div
      className="fixed z-[9999] transform -translate-x-1/2 -translate-y-[120%]"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Tooltip container with cyberpunk glassmorphism effect */}
      <div
        className="relative bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_0_0_1px_rgba(255,0,122,0.5)] min-w-[280px] max-w-[320px] overflow-hidden"
        onMouseEnter={(e) => e.stopPropagation()}
        onMouseLeave={(e) => e.stopPropagation()}
      >
        {/* Scanner line accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF007A] to-transparent blur-[1px] z-20"></div>

        {/* Content container */}
        <div className="relative z-10 p-4">
          {/* Thumbnail image */}
          <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
            <Image
              src={thumbnailUrl}
              alt={place.name}
              fill
              sizes="128px"
              className="object-cover transition-transform duration-300 hover:scale-105"
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 70%, transparent 100%)",
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-image.jpg";
              }}
            />
          </div>

          {/* Place name */}
          <h3 className="text-white font-bold text-lg mb-1 truncate tracking-wide">
            {place.name}
          </h3>

          {/* Category with icon */}
          {place.category && (
            <div className="flex items-center gap-2 mb-2">
              {place.category.icon && (
                <span
                  className="text-base"
                  style={{ color: place.category.color || "#FF007A" }}
                >
                  {place.category.icon.startsWith("fa-") ? (
                    <i className={`fa ${place.category.icon}`}></i>
                  ) : (
                    place.category.icon
                  )}
                </span>
              )}
              <span
                className="text-sm font-medium font-semibold"
                style={{ color: place.category.color || "#FF007A" }}
              >
                {place.category.name}
              </span>
            </div>
          )}

          {/* Tags */}
          {hasTags && (
            <div className="flex flex-wrap gap-1 mb-2">
              {place.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: tag.color
                      ? `${tag.color}20`
                      : "rgba(255, 0, 122, 0.1)",
                    color: tag.color || "#FF007A",
                    border: `1px solid ${tag.color || "#FF007A"}40`,
                  }}
                >
                  {tag.icon && (
                    <span
                      className="text-xs"
                      style={{ color: tag.color || "#FF007A" }}
                    >
                      {tag.icon.startsWith("fa-") ? (
                        <i className={`fa ${tag.icon}`}></i>
                      ) : (
                        tag.icon
                      )}
                    </span>
                  )}
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Description - truncated to 3 lines */}
          <p className="text-[#e0e0e0] text-sm line-clamp-3">
            {place.description}
          </p>
        </div>

        {/* Tooltip pointer */}
        <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/60 rotate-45 border-r border-b border-white/10 z-10"></div>
      </div>
    </motion.div>
  );
};

export default PlaceHoverTooltip;
