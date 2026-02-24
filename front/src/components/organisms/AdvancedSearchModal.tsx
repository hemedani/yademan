"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import AsyncSelectBox from "@/components/atoms/AsyncSelectBox";
import MyInput from "@/components/atoms/MyInput";
import { useMapStore } from "@/stores/mapStore";
import { gets as getCategoryOptions } from "@/app/actions/category/gets";
import { gets as getTagOptions } from "@/app/actions/tag/gets";
import { gets as getProvinceOptions } from "@/app/actions/province/gets";
import { gets as getCityOptions } from "@/app/actions/city/gets";
import { categorySchema, tagSchema } from "@/types/declarations/selectInp";

const PAGE_SIZE = 8;

// Stable fallback — must NOT be inline (`?? []`) inside a Zustand selector.
// Inline `?? []` creates a new array reference on every render; Zustand's
// Object.is check then always sees a "change" → infinite re-render loop.
const EMPTY_IDS: string[] = [];

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (filters: any) => void;
}

// ---------------------------------------------------------------------------
// Pill chip list with "..." load-more
// ---------------------------------------------------------------------------
interface ChipListProps {
  label: string;
  items: Array<{ _id: string; name: string; icon?: string; color?: string }>;
  selectedIds: string[];
  onToggle: (id: string) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

const ChipList: React.FC<ChipListProps> = ({
  label,
  items,
  selectedIds,
  onToggle,
  hasMore,
  isLoading,
  onLoadMore,
}) => (
  <div className="mb-5">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const isSelected = selectedIds.includes(item._id);
        return (
          <motion.button
            key={item._id}
            type="button"
            onClick={() => onToggle(item._id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? "bg-[#FF007A]/20 text-white border border-[#FF007A] drop-shadow-[0_0_6px_#FF007A]"
                : "bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:border-white/40"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {item.icon && (
              <>
                <span className="text-base leading-none" style={{ color: item.color }}>
                  {item.icon}
                </span>
                <span className="w-px h-4 bg-white/20" />
              </>
            )}
            <span>{item.name}</span>
          </motion.button>
        );
      })}

      {/* Load-more "..." button */}
      {hasMore && (
        <motion.button
          type="button"
          onClick={onLoadMore}
          disabled={isLoading}
          className="flex items-center justify-center px-3 py-1.5 rounded-full text-sm border border-white/10 bg-white/5 text-white/50 hover:border-white/40 hover:text-white/80 transition-all duration-200 disabled:opacity-40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            "···"
          )}
        </motion.button>
      )}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------
const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const t = useTranslations("AdvancedSearchModal");

  // Form
  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      province: "",
      city: "",
      categoryIds: [] as string[],
      tagIds: [] as string[],
      maxDistance: undefined as number | undefined,
      minDistance: undefined as number | undefined,
    },
  });

  // Map store — single source of truth for selections
  const filters = useMapStore((state) => state.filters);
  const setFilters = useMapStore((state) => state.setFilters);

  // Selections live in the store so both SearchFilterHub and this modal stay in sync.
  // EMPTY_IDS is a stable module-level ref — avoids the infinite loop caused by
  // returning a new [] reference on every selector evaluation.
  const selectedCategoryIds = useMapStore((state) => state.filters.categoryIds ?? EMPTY_IDS);
  const selectedTagIds = useMapStore((state) => state.filters.tagIds ?? EMPTY_IDS);

  // ---- Categories list state ----
  const [categories, setCategories] = useState<categorySchema[]>([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);

  // ---- Tags list state ----
  const [tags, setTags] = useState<tagSchema[]>([]);
  const [tagPage, setTagPage] = useState(1);
  const [hasMoreTags, setHasMoreTags] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  // ---- Fetch helpers ----
  const fetchCategories = useCallback(async (page: number, append = false) => {
    setIsCategoriesLoading(true);
    try {
      const response = await getCategoryOptions({
        set: { page, limit: PAGE_SIZE },
        get: { _id: 1, name: 1, icon: 1, color: 1 },
      });
      if (response.success && response.body) {
        const items: categorySchema[] = response.body;
        setCategories((prev) => (append ? [...prev, ...items] : items));
        setHasMoreCategories(items.length >= PAGE_SIZE);
      }
    } catch (e) {
      console.error("Error fetching categories:", e);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  const fetchTags = useCallback(async (page: number, append = false) => {
    setIsTagsLoading(true);
    try {
      const response = await getTagOptions({
        set: { page, limit: PAGE_SIZE },
        get: { _id: 1, name: 1, icon: 1, color: 1 },
      });
      if (response.success && response.body) {
        const items: tagSchema[] = response.body;
        setTags((prev) => (append ? [...prev, ...items] : items));
        setHasMoreTags(items.length >= PAGE_SIZE);
      }
    } catch (e) {
      console.error("Error fetching tags:", e);
    } finally {
      setIsTagsLoading(false);
    }
  }, []);

  // ---- On open: reset form & fetch first page ----
  useEffect(() => {
    if (!isOpen) return;

    // Restore form state from current map filters
    // categoryIds / tagIds are already live from the store — no need to copy them
    reset({
      province: filters.province || "",
      city: filters.city || "",
      categoryIds: filters.categoryIds || [],
      tagIds: filters.tagIds || [],
      maxDistance: filters.maxDistance || undefined,
      minDistance: filters.minDistance || undefined,
    });

    // Reset to page 1 and fetch
    setCategoryPage(1);
    setTagPage(1);
    fetchCategories(1, false);
    fetchTags(1, false);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---- Keep form values in sync with store selections ----
  useEffect(() => {
    setValue("categoryIds", selectedCategoryIds);
  }, [selectedCategoryIds, setValue]);

  useEffect(() => {
    setValue("tagIds", selectedTagIds);
  }, [selectedTagIds, setValue]);

  // ---- Toggle handlers — write directly to store ----
  const toggleCategory = (id: string) => {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((x) => x !== id)
      : [...selectedCategoryIds, id];
    setFilters({ categoryIds: next.length > 0 ? next : undefined });
  };

  const toggleTag = (id: string) => {
    const next = selectedTagIds.includes(id)
      ? selectedTagIds.filter((x) => x !== id)
      : [...selectedTagIds, id];
    setFilters({ tagIds: next.length > 0 ? next : undefined });
  };

  // ---- Load-more handlers ----
  const loadMoreCategories = () => {
    const next = categoryPage + 1;
    setCategoryPage(next);
    fetchCategories(next, true);
  };

  const loadMoreTags = () => {
    const next = tagPage + 1;
    setTagPage(next);
    fetchTags(next, true);
  };

  // ---- Form submit ----
  const handleFormSubmit = (data: any) => {
    const preparedFilters = { ...data };
    Object.keys(preparedFilters).forEach((key) => {
      if (
        preparedFilters[key] === "" ||
        preparedFilters[key] === null ||
        preparedFilters[key] === undefined ||
        (Array.isArray(preparedFilters[key]) && preparedFilters[key].length === 0)
      ) {
        delete preparedFilters[key];
      }
    });
    onSubmit(preparedFilters);
    onClose();
  };

  const handleReset = () => {
    // Clear selections in the store so SearchFilterHub also reflects the reset
    setFilters({ categoryIds: undefined, tagIds: undefined });
    reset({
      province: "",
      city: "",
      categoryIds: [],
      tagIds: [],
      maxDistance: undefined,
      minDistance: undefined,
    });
  };

  // ---- Render ----
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full w-1/4 min-w-[280px] bg-[#121212] border-l border-[#333] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex flex-col min-h-full">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 shrink-0">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FF007A] to-[#A020F0] bg-clip-text text-transparent">
                  {t("advancedSearch")}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={t("closeModal")}
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
              </div>

              {/* ---- Categories chip list (top) ---- */}
              <ChipList
                label={t("categories")}
                items={
                  (
                    categories as Array<{ _id: string; name: string; icon?: string; color?: string }>
                  ).filter((c) => c._id != null) as Array<{
                    _id: string;
                    name: string;
                    icon?: string;
                    color?: string;
                  }>
                }
                selectedIds={selectedCategoryIds}
                onToggle={toggleCategory}
                hasMore={hasMoreCategories}
                isLoading={isCategoriesLoading}
                onLoadMore={loadMoreCategories}
              />

              {/* Divider */}
              <div className="h-px bg-white/10 mb-5 shrink-0" />

              {/* ---- Tags chip list ---- */}
              <ChipList
                label={t("tags")}
                items={
                  (tags as Array<{ _id: string; name: string; icon?: string; color?: string }>).filter(
                    (tg) => tg._id != null,
                  ) as Array<{ _id: string; name: string; icon?: string; color?: string }>
                }
                selectedIds={selectedTagIds}
                onToggle={toggleTag}
                hasMore={hasMoreTags}
                isLoading={isTagsLoading}
                onLoadMore={loadMoreTags}
              />

              {/* Divider */}
              <div className="h-px bg-white/10 mb-5 shrink-0" />

              {/* ---- Other filters ---- */}
              <div className="flex flex-col gap-5 flex-1">
                {/* Province */}
                <AsyncSelectBox
                  name="province"
                  label={t("province")}
                  setValue={setValue}
                  loadOptions={async () => {
                    try {
                      const response = await getProvinceOptions({
                        set: { page: 1, limit: 100 },
                        get: { _id: 1, name: 1 },
                      });
                      if (response.success && response.body) {
                        return response.body.map((p: any) => ({ value: p._id, label: p.name }));
                      }
                      return [];
                    } catch (e) {
                      console.error("Error loading provinces:", e);
                      return [];
                    }
                  }}
                  placeholder={t("provincePlaceholder")}
                  defaultOptions
                />

                {/* City */}
                <AsyncSelectBox
                  key={watch("province") || "no-province"}
                  name="city"
                  label={t("city")}
                  setValue={setValue}
                  loadOptions={async () => {
                    try {
                      const selectedProvince = watch("province");
                      if (!selectedProvince) return [];
                      const response = await getCityOptions({
                        set: { page: 1, limit: 100, provinceId: selectedProvince },
                        get: { _id: 1, name: 1 },
                      });
                      if (response.success && response.body) {
                        return response.body.map((c: any) => ({ value: c._id, label: c.name }));
                      }
                      return [];
                    } catch (e) {
                      console.error("Error loading cities:", e);
                      return [];
                    }
                  }}
                  placeholder={t("cityPlaceholder")}
                  defaultOptions
                />

                {/* Max Distance */}
                <div>
                  <MyInput
                    name="maxDistance"
                    label={t("maxDistance")}
                    register={register}
                    type="number"
                    placeholder={t("maxDistancePlaceholder")}
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">{t("maxDistanceDescription")}</p>
                </div>

                {/* Min Distance */}
                <div>
                  <MyInput
                    name="minDistance"
                    label={t("minDistance")}
                    register={register}
                    type="number"
                    placeholder={t("minDistancePlaceholder")}
                    min="0"
                  />
                  <p className="text-xs text-gray-400 mt-1">{t("minDistanceDescription")}</p>
                </div>
              </div>

              {/* ---- Action buttons (sticky bottom) ---- */}
              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors text-sm"
                >
                  {t("reset")}
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmit(handleFormSubmit)()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF007A] to-[#A020F0] hover:from-[#e6006c] hover:to-[#8a1bc4] text-white transition-all text-sm"
                >
                  {t("applyFilters")}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdvancedSearchModal;
