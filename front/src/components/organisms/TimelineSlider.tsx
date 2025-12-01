"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useMapStore } from "@/stores/mapStore";

interface TimelineSliderProps {
  className?: string;
}

const TimelineSlider: React.FC<TimelineSliderProps> = ({ className = "" }) => {
  const t = useTranslations("TimelineSlider");
  const [value, setValue] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  // Minimum and maximum antiquity ranges
  const minAntiquity = 0;
  const maxAntiquity = 10000;

  // Get and update map store
  const antiquityFilter = useMapStore((state) => state.filters.antiquity);
  const setAntiquityFilter = useMapStore((state) => state.setAntiquityFilter);

  // Initialize value from store
  useEffect(() => {
    if (antiquityFilter !== undefined) {
      setValue(antiquityFilter);
      setInputValue(antiquityFilter.toString());
    }
  }, [antiquityFilter]);

  // Update input value when slider value changes
  useEffect(() => {
    setInputValue(Math.round(value).toString());
  }, [value]);

  // Apply filter to map store
  const applyFilter = () => {
    setAntiquityFilter(value);
  };

  // Track position state (in pixels relative to center)
  const [trackPosition, setTrackPosition] = useState<number>(0);

  // When value changes (not from drag), update the track position
  useEffect(() => {
    setTrackPosition(-value * 4);
  }, [value]);

  // Refs to keep track of values during drag
  const dragStartValue = useRef(0);
  const dragStartX = useRef(0);
  const resetTrigger = useRef(false);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#121212] to-[#2a2a2a]/30 backdrop-blur-lg p-4 ${className}`}
    >
      <div className="w-full relative">
        {/* Reset button with animated label */}
        <div className="absolute top-2 left-4 z-40 flex items-center group">
          <button
            onClick={() => {
              setValue(0);
              setInputValue("0");
              setTrackPosition(0); // This will move the track back to center
              setAntiquityFilter(0);
              // Ensure dragging state is reset to avoid any visual issues
              setIsDragging(false);
            }}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm border border-[#333] transition-all duration-200"
            aria-label={t("reset", { defaultValue: "Reset" })}
          >
            <svg
              className="w-5 h-5 text-white group-hover:text-[#FF007A] transition-colors duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M5 12a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v5a2 2 0 01-2 2M5 12a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2m-2-4h.01M17 8h.01"
              />
            </svg>
          </button>
          <div className="ml-2 overflow-hidden whitespace-nowrap">
            <span className="text-white text-sm bg-black/30 rounded px-2 py-1.5 backdrop-blur-sm border border-[#333] transform transition-all duration-300 translate-x-[-100%] opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
              {t("reset", { defaultValue: "Reset" })}
            </span>
          </div>
        </div>

        {/* Gradient overlays on sides */}
        <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#121212] to-transparent z-10"></div>

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#FF007A] to-[#A020F0] bg-clip-text text-transparent">
              {Math.round(value)} {t("years")}
            </div>
          </div>
        </div>

        <div className="mt-4 relative overflow-hidden">
          {/* Fixed center indicator */}
          <motion.div
            className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white z-20 flex flex-col items-center"
            animate={{
              scale: isDragging ? 1.1 : 1,
              backgroundColor: isDragging ? "#FF007A" : "#FFFFFF",
              width: isDragging ? "1px" : "1.5px",
            }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-3 h-3 rounded-full bg-white"
              animate={{
                scale: isDragging ? 1.2 : 1,
                backgroundColor: isDragging ? "#FF007A" : "#FFFFFF",
              }}
            />
          </motion.div>

          {/* Track container with hidden scrollbar */}
          <div className="overflow-x-auto hide-scrollbar pb-2 relative h-20">
            {/* Main track that gets dragged */}
            <motion.div
              className="absolute h-15 cursor-grab active:cursor-grabbing"
              style={{
                left: "50%",
                width: "80000px", // Wide track (80,000px) to allow for full movement
              }}
              animate={{ x: trackPosition }} // Animate the x position when trackPosition changes
              transition={
                isDragging
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 100, damping: 20 }
              } // No transition while dragging for responsiveness, smooth transition otherwise
              drag="x"
              dragMomentum={false}
              dragElastic={0}
              onDragStart={(event, info) => {
                setIsDragging(true);
                dragStartValue.current = value;
                dragStartX.current = info.point.x; // Store the initial screen x position
              }}
              onDrag={(event, info) => {
                // Calculate how far the center of the screen has moved relative to the dragged element
                const xMovement = info.point.x - dragStartX.current;

                // Convert movement to value change (since 4px = 1 year)
                // Moving the track to the left (negative x) shows later years (higher values)
                // Moving track to the right (positive x) shows earlier years (lower values)
                const valueChange = -xMovement / 4;
                const newValue = dragStartValue.current + valueChange;

                if (newValue >= minAntiquity && newValue <= maxAntiquity) {
                  setValue(newValue);
                  setInputValue(newValue.toString());

                  // Update the track position based on current value during drag
                  setTrackPosition(-newValue * 4);
                }
              }}
              onDragEnd={() => {
                setIsDragging(false);
                applyFilter();
              }}
            >
              {/* Base track line - thinner */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2a2a2a] border border-[#333]"></div>

              {/* Graduated tick marks every 10 years */}
              {Array.from({ length: maxAntiquity / 10 + 1 }).map((_, i) => {
                const tickValue = i * 10; // Every 10 years
                const xPos = tickValue * 4; // 4px per year

                const isMajor = tickValue % 50 === 0; // Every 50 years is taller
                const isVeryMajor = tickValue % 1000 === 0; // Every 1000 years is even taller

                return (
                  <div
                    key={tickValue}
                    className="absolute top-1/2 origin-bottom"
                    style={{ left: `${xPos}px`, transform: "translateX(-50%)" }}
                  >
                    <motion.div
                      className={`origin-bottom ${value >= tickValue ? "bg-white" : "bg-[#a0a0a0]"}`}
                      style={{
                        height: isVeryMajor
                          ? "32px"
                          : isMajor
                            ? "24px"
                            : "14px", // Taller marks
                        width: isMajor ? "1.5px" : "0.75px", // Slightly thicker
                      }}
                      whileHover={{
                        height: isVeryMajor
                          ? "36px"
                          : isMajor
                            ? "28px"
                            : "18px",
                        backgroundColor: "#FF007A",
                      }}
                    />
                    {/* Year label below major ticks */}
                    {isMajor && (
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 text-xs text-white mt-1"
                        style={{
                          color: value >= tickValue ? "white" : "#a0a0a0",
                        }}
                      >
                        {tickValue}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Filled part of the track */}
              <div
                className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-[#FF007A] via-[#A020F0] to-[#FF007A]"
                style={{ width: "100%" }}
              />
            </motion.div>
          </div>

          {/* Fixed slider handle in the middle */}
          <motion.div
            className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${isDragging ? "bg-gradient-to-r from-[#ff66b3] to-[#bf70ff]" : "bg-gradient-to-r from-[#FF007A] to-[#A020F0]"} shadow-lg cursor-pointer border-2 border-white flex items-center justify-center z-30`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 1.3 }}
            animate={{
              scale: isDragging ? 1.15 : 1,
              boxShadow: isDragging
                ? "0 0 12px rgba(255, 0, 122, 0.5), 0 0 18px rgba(160, 32, 240, 0.3)"
                : "0 4px 8px rgba(0, 0, 0, 0.3)",
            }}
            aria-valuemin={minAntiquity}
            aria-valuemax={maxAntiquity}
            aria-valuenow={value}
            aria-label={t("timelineSlider")}
            role="slider"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {(showTooltip || isDragging) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{
                    opacity: 1,
                    y: -40,
                    scale: isDragging ? 1.1 : 1,
                  }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-[#121212] text-white text-sm rounded shadow-lg border border-[#333] whitespace-nowrap z-50"
                >
                  {Math.round(value)} {t("years")}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#121212]"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
          }
          .hide-scrollbar {
            -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
          }
        `}</style>

        <div className="mt-4 text-center text-sm text-[#a0a0a0]">
          {t("showSitesOlderThan")}{" "}
          <span className="text-white font-medium">
            {Math.round(value)} {t("years")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;
