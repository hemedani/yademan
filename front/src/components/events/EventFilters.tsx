"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import AsyncSelectBox from "@/components/atoms/AsyncSelectBox";
import { gets as getTagOptions } from "@/app/actions/tag/gets";
import { useForm } from "react-hook-form";

interface EventFiltersProps {
  onFilterChange: (filters: any) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function EventFilters({ onFilterChange, onClose, isOpen = true }: EventFiltersProps) {
  const t = useTranslations("Events");
  const { setValue, watch, reset } = useForm({
    defaultValues: {
      status: "",
      tagIds: [] as string[],
      isPublic: undefined as boolean | undefined,
      registrationRequired: undefined as boolean | undefined,
      startDate: "",
      endDate: "",
      searchQuery: "",
    },
  });

  const [localFilters, setLocalFilters] = useState({
    status: "",
    tagIds: [] as string[],
    isPublic: undefined as boolean | undefined,
    registrationRequired: undefined as boolean | undefined,
    startDate: "",
    endDate: "",
    searchQuery: "",
  });

  // Watch form changes
  const status = watch("status");
  const tagIds = watch("tagIds");
  const isPublic = watch("isPublic");
  const registrationRequired = watch("registrationRequired");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const searchQuery = watch("searchQuery");

  // Load tag options
  const loadTagOptions = async (inputValue: string) => {
    try {
      const response = await getTagOptions({
        set: {
          limit: 20,
          page: 1,
        },
        get: {
          _id: 1,
          name: 1,
          color: 1,
          icon: 1,
        },
      });

      if (response.success && Array.isArray(response.body)) {
        return response.body
          .filter((tag: any) => tag.name.toLowerCase().includes(inputValue.toLowerCase()))
          .map((tag: any) => ({
            value: tag._id || "",
            label: tag.name,
            color: tag.color,
            icon: tag.icon,
          }));
      }
      return [];
    } catch (error) {
      console.error("Error loading tags:", error);
      return [];
    }
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    const filters: any = {};

    if (status && status !== "") {
      filters.status = status;
    }

    if (tagIds && tagIds.length > 0) {
      filters.tagIds = tagIds;
    }

    if (isPublic !== undefined) {
      filters.isPublic = isPublic;
    }

    if (registrationRequired !== undefined) {
      filters.registrationRequired = registrationRequired;
    }

    if (startDate) {
      filters.startTimeAfter = new Date(startDate).toISOString();
    }

    if (endDate) {
      filters.endTimeBefore = new Date(endDate).toISOString();
    }

    if (searchQuery && searchQuery.trim()) {
      filters.name = searchQuery.trim();
    }

    onFilterChange(filters);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    reset();
    setLocalFilters({
      status: "",
      tagIds: [],
      isPublic: undefined,
      registrationRequired: undefined,
      startDate: "",
      endDate: "",
      searchQuery: "",
    });
    onFilterChange({});
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-[#333] rounded-2xl p-6 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF007A] to-[#7B2FF7] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white">{t("filters")}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#a0a0a0] hover:text-white transition-colors"
            aria-label="Close filters"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          {t("searchPlaceholder")}
        </label>
        <input
          type="text"
          value={localFilters.searchQuery}
          onChange={(e) => {
            setValue("searchQuery", e.target.value);
            setLocalFilters({ ...localFilters, searchQuery: e.target.value });
          }}
          placeholder={t("searchPlaceholder")}
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#FF007A] transition-colors"
        />
      </div>

      {/* Status Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">{t("status")}</label>
        <select
          value={localFilters.status}
          onChange={(e) => {
            setValue("status", e.target.value);
            setLocalFilters({ ...localFilters, status: e.target.value });
          }}
          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#FF007A] transition-colors"
        >
          <option value="">{t("allStatuses")}</option>
          <option value="draft">{t("draft")}</option>
          <option value="published">{t("published")}</option>
          <option value="archived">{t("archived")}</option>
          <option value="cancelled">{t("cancelled")}</option>
        </select>
      </div>

      {/* Tags Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">{t("tags")}</label>
        <AsyncSelectBox
          name="tagIds"
          label=""
          setValue={setValue}
          loadOptions={loadTagOptions}
          placeholder={t("selectTags")}
          isMulti={true}
          className="w-full"
        />
      </div>

      {/* Date Range */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#a0a0a0] mb-2">{t("startDate")}</label>
          <input
            type="datetime-local"
            value={localFilters.startDate}
            onChange={(e) => {
              setValue("startDate", e.target.value);
              setLocalFilters({ ...localFilters, startDate: e.target.value });
            }}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#FF007A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#a0a0a0] mb-2">{t("endDate")}</label>
          <input
            type="datetime-local"
            value={localFilters.endDate}
            onChange={(e) => {
              setValue("endDate", e.target.value);
              setLocalFilters({ ...localFilters, endDate: e.target.value });
            }}
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white focus:outline-none focus:border-[#FF007A] transition-colors"
          />
        </div>
      </div>

      {/* Boolean Filters */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group">
          <input
            type="checkbox"
            checked={localFilters.isPublic === true}
            onChange={(e) => {
              const value = e.target.checked ? true : undefined;
              setValue("isPublic", value);
              setLocalFilters({ ...localFilters, isPublic: value });
            }}
            className="w-5 h-5 rounded border-[#333] bg-[#1a1a1a] text-[#FF007A] focus:ring-[#FF007A] focus:ring-offset-0 focus:ring-2"
          />
          <span className="text-sm text-[#a0a0a0] group-hover:text-white transition-colors">
            {t("showPublicOnly")}
          </span>
        </label>

        <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer group">
          <input
            type="checkbox"
            checked={localFilters.registrationRequired === true}
            onChange={(e) => {
              const value = e.target.checked ? true : undefined;
              setValue("registrationRequired", value);
              setLocalFilters({
                ...localFilters,
                registrationRequired: value,
              });
            }}
            className="w-5 h-5 rounded border-[#333] bg-[#1a1a1a] text-[#FF007A] focus:ring-[#FF007A] focus:ring-offset-0 focus:ring-2"
          />
          <span className="text-sm text-[#a0a0a0] group-hover:text-white transition-colors">
            {t("showWithRegistration")}
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 rtl:space-x-reverse">
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FF007A] to-[#7B2FF7] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#FF007A]/50 transition-all duration-300 transform hover:scale-105"
        >
          {t("applyFilters")}
        </button>
        <button
          onClick={handleResetFilters}
          className="px-6 py-3 bg-[#1a1a1a] border border-[#333] text-[#a0a0a0] rounded-xl font-medium hover:bg-[#222] hover:text-white hover:border-[#FF007A] transition-all duration-300"
        >
          {t("resetFilters")}
        </button>
      </div>
    </motion.div>
  );
}
