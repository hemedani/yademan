"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useMapStore } from "@/stores/mapStore";

interface AntiquitySliderProps {
  className?: string;
}

const AntiquitySlider: React.FC<AntiquitySliderProps> = ({ className = "" }) => {
  const t = useTranslations("AntiquitySlider");
  const [value, setValue] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Minimum and maximum antiquity ranges
  const minAntiquity = 0;
  const maxAntiquity = 5000;

  // Refs for animation
  const animationRef = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

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
    setInputValue(value.toString());
  }, [value]);

  // Handle play/pause animation
  useEffect(() => {
    if (isPlaying) {
      lastUpdateTime.current = Date.now();

      const animate = () => {
        const now = Date.now();
        const delta = (now - lastUpdateTime.current) / 1000; // seconds since last update

        setValue((prev) => {
          const newValue = Math.min(prev + delta * 50, maxAntiquity); // Adjust speed as needed
          setInputValue(newValue.toFixed(0));

          if (newValue >= maxAntiquity) {
            setIsPlaying(false);
            return maxAntiquity;
          }

          return newValue;
        });

        lastUpdateTime.current = now;
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  // Handle slider input
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setValue(newValue);
    setInputValue(newValue.toString());
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= minAntiquity && numValue <= maxAntiquity) {
      setValue(numValue);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < minAntiquity) {
      setValue(minAntiquity);
      setInputValue(minAntiquity.toString());
    } else if (numValue > maxAntiquity) {
      setValue(maxAntiquity);
      setInputValue(maxAntiquity.toString());
    }
  };

  // Apply filter to map store
  const applyFilter = () => {
    setAntiquityFilter(value);
  };

  // Calculate slider position for tooltip
  const getSliderPosition = () => {
    return ((value - minAntiquity) / (maxAntiquity - minAntiquity)) * 100;
  };

  // Reset filter
  const resetFilter = () => {
    setValue(0);
    setInputValue("0");
    setIsPlaying(false);
    setAntiquityFilter(0);
  };

  return (
    <div
      className={`bg-[#121212] border border-[#333] rounded-xl shadow-2xl p-4 w-full max-w-4xl z-50 ${className}`}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
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
          <h3 className="text-white font-semibold text-lg">{t("antiquityFilter")}</h3>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[#a0a0a0] text-sm">{t("min")}</span>
            <div className="bg-[#222] text-white px-2 py-1 rounded text-sm min-w-[60px] text-center">
              {minAntiquity} {t("years")}
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              min={minAntiquity}
              max={maxAntiquity}
              className="w-full bg-[#222] text-white px-3 py-2 rounded-lg border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#FF007A] text-center"
              aria-label={t("antiquityInputLabel")}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-[#222] text-white px-2 py-1 rounded text-sm min-w-[60px] text-center">
              {maxAntiquity} {t("years")}
            </div>
            <span className="text-[#a0a0a0] text-sm">{t("max")}</span>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors"
            aria-label={isPlaying ? t("pauseAnimation") : t("playAnimation")}
          >
            {isPlaying ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                <span>{t("pause")}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>{t("play")}</span>
              </>
            )}
          </button>

          <button
            onClick={resetFilter}
            className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg border border-[#333] transition-colors"
            aria-label={t("resetFilter")}
          >
            {t("reset")}
          </button>
        </div>
      </div>

      <div className="mt-6 relative">
        {/* Slider track */}
        <div
          className="h-2 bg-[#2a2a2a] rounded-full relative cursor-pointer"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => {
            // Handle click to move slider
            const sliderRect = e.currentTarget.getBoundingClientRect();
            const position = Math.min(Math.max(0, e.clientX - sliderRect.left), sliderRect.width);
            const newValue = Math.round(
              (position / sliderRect.width) * (maxAntiquity - minAntiquity) + minAntiquity,
            );

            if (newValue >= minAntiquity && newValue <= maxAntiquity) {
              setValue(newValue);
              setInputValue(newValue.toString());
              applyFilter();
            }
          }}
        >
          {/* Filled part of the track */}
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF007A] to-[#A020F0] rounded-full"
            style={{ width: `${getSliderPosition()}%` }}
          />

          {/* Slider handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-lg cursor-grab active:cursor-grabbing"
            style={{ left: `calc(${getSliderPosition()}% - 12px)` }}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDrag={(event, info) => {
              setIsDragging(true);
              setIsPlaying(false);

              // Calculate new value based on drag position
              if (event.currentTarget) {
                const targetElement = event.currentTarget as HTMLElement;
                const sliderRect = targetElement.parentElement?.getBoundingClientRect();
                if (sliderRect) {
                  const position = Math.min(
                    Math.max(0, info.point.x - sliderRect.left),
                    sliderRect.width,
                  );
                  const newValue = Math.round(
                    (position / sliderRect.width) * (maxAntiquity - minAntiquity) + minAntiquity,
                  );

                  if (newValue >= minAntiquity && newValue <= maxAntiquity) {
                    setValue(newValue);
                    setInputValue(newValue.toString());
                  }
                }
              }
            }}
            onDragEnd={() => {
              setIsDragging(false);
              applyFilter();
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.2 }}
            aria-valuemin={minAntiquity}
            aria-valuemax={maxAntiquity}
            aria-valuenow={value}
            aria-label={t("antiquitySlider")}
            role="slider"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {(showTooltip || isDragging) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: -30 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#121212] text-white text-xs rounded shadow-lg border border-[#333] whitespace-nowrap z-50"
                >
                  {value} {t("years")}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#121212]"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Tick marks and labels */}
        <div className="relative h-6 mt-2">
          {[0, 1000, 2000, 3000, 4000, 5000].map((tick) => (
            <div
              key={tick}
              className={`absolute top-0 transform -translate-x-1/2 ${getSliderPosition() >= (tick / maxAntiquity) * 100 ? "text-[#FF007A]" : "text-[#a0a0a0]"}`}
              style={{ left: `${(tick / maxAntiquity) * 100}%` }}
            >
              <span className="block text-xs">{tick}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center text-sm text-[#a0a0a0]">
        {t("showSitesOlderThan")}{" "}
        <span className="text-white font-medium">
          {value} {t("years")}
        </span>
      </div>
    </div>
  );
};

export default AntiquitySlider;
