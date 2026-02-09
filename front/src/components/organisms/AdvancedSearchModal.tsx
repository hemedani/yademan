"use client";

import React, { useEffect } from "react";
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

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (filters: any) => void;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const t = useTranslations("AdvancedSearchModal");

  // Initialize form with default values
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      status: "",
      province: "",
      city: "",
      registrarId: "",
      categoryIds: [] as string[], // Specify the type as string[]
      tagIds: [] as string[], // Specify the type as string[]
      maxDistance: undefined as number | undefined,
      minDistance: undefined as number | undefined,
    },
  });

  // Get map store for getting current values
  const filters = useMapStore((state) => state.filters);

  // Initialize with current map filters when opening
  useEffect(() => {
    if (isOpen) {
      reset({
        name: filters.name || "",
        slug: filters.slug || "",
        status: filters.status || "",
        province: filters.province || "",
        city: filters.city || "",
        registrarId: filters.registrarId || "",
        categoryIds: filters.categoryIds || [],
        tagIds: filters.tagIds || [],
        maxDistance: filters.maxDistance || undefined,
        minDistance: filters.minDistance || undefined,
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data: any) => {
    // Prepare filters for submission
    const preparedFilters = { ...data };

    // Remove empty values
    Object.keys(preparedFilters).forEach((key) => {
      if (
        preparedFilters[key] === "" ||
        preparedFilters[key] === null ||
        (Array.isArray(preparedFilters[key]) && preparedFilters[key].length === 0)
      ) {
        delete preparedFilters[key];
      }
    });

    onSubmit(preparedFilters);
    onClose();
  };

  const handleReset = () => {
    reset({
      name: "",
      slug: "",
      status: "",
      province: "",
      city: "",
      registrarId: "",
      categoryIds: [],
      tagIds: [],
      maxDistance: undefined,
      minDistance: undefined,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#121212] rounded-xl border border-[#333] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <MyInput
                    name="name"
                    label={t("name")}
                    register={register}
                    placeholder={t("namePlaceholder")}
                  />
                </div>

                {/* Slug */}
                <div>
                  <MyInput
                    name="slug"
                    label={t("slug")}
                    register={register}
                    placeholder={t("slugPlaceholder")}
                  />
                </div>

                {/* Status */}
                <div>
                  <AsyncSelectBox
                    name="status"
                    label={t("status")}
                    setValue={setValue}
                    loadOptions={async () => {
                      try {
                        // Return the static options for status as AsyncSelectBox expects
                        return [
                          { value: "", label: t("any") },
                          { value: "draft", label: t("draft") },
                          { value: "active", label: t("active") },
                          { value: "archived", label: t("archived") },
                        ];
                      } catch (error) {
                        console.error("Error loading status options:", error);
                        return [];
                      }
                    }}
                    placeholder={t("selectStatus")}
                    defaultOptions
                  />
                </div>

                {/* Province */}
                <div>
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
                          return response.body.map((province: any) => ({
                            value: province._id,
                            label: province.name,
                          }));
                        }
                        return [];
                      } catch (error) {
                        console.error("Error loading provinces:", error);
                        return [];
                      }
                    }}
                    placeholder={t("provincePlaceholder")}
                    defaultOptions
                  />
                </div>

                {/* City */}
                <div>
                  <AsyncSelectBox
                    key={watch("province") || "no-province"}
                    name="city"
                    label={t("city")}
                    setValue={setValue}
                    loadOptions={async () => {
                      try {
                        // Only load cities if a province is selected
                        const selectedProvince = watch("province");
                        if (!selectedProvince) return [];

                        const response = await getCityOptions({
                          set: {
                            page: 1,
                            limit: 100,
                            provinceId: selectedProvince,
                          },
                          get: { _id: 1, name: 1 },
                        });

                        if (response.success && response.body) {
                          return response.body.map((city: any) => ({
                            value: city._id,
                            label: city.name,
                          }));
                        }
                        return [];
                      } catch (error) {
                        console.error("Error loading cities:", error);
                        return [];
                      }
                    }}
                    placeholder={t("cityPlaceholder")}
                    defaultOptions
                  />
                </div>

                {/* Registrar ID */}
                <div>
                  <MyInput
                    name="registrarId"
                    label={t("registrarId")}
                    register={register}
                    placeholder={t("registrarIdPlaceholder")}
                  />
                </div>

                {/* Categories */}
                <div>
                  <AsyncSelectBox
                    name="categoryIds"
                    label={t("categories")}
                    setValue={setValue}
                    isMulti
                    loadOptions={async () => {
                      try {
                        const response = await getCategoryOptions({
                          set: { page: 1, limit: 100 },
                          get: { _id: 1, name: 1 },
                        });

                        if (response.success && response.body) {
                          return response.body.map((category: any) => ({
                            value: category._id,
                            label: category.name,
                          }));
                        }
                        return [];
                      } catch (error) {
                        console.error("Error loading categories:", error);
                        return [];
                      }
                    }}
                    placeholder={t("selectCategories")}
                    defaultOptions
                  />
                </div>

                {/* Tags */}
                <div>
                  <AsyncSelectBox
                    name="tagIds"
                    label={t("tags")}
                    setValue={setValue}
                    isMulti
                    loadOptions={async () => {
                      try {
                        const response = await getTagOptions({
                          set: { page: 1, limit: 100 },
                          get: { _id: 1, name: 1 },
                        });

                        if (response.success && response.body) {
                          return response.body.map((tag: any) => ({
                            value: tag._id,
                            label: tag.name,
                          }));
                        }
                        return [];
                      } catch (error) {
                        console.error("Error loading tags:", error);
                        return [];
                      }
                    }}
                    placeholder={t("selectTags")}
                    defaultOptions
                  />
                </div>

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
                  <p className="text-sm text-gray-400 mt-1">{t("maxDistanceDescription")}</p>
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
                  <p className="text-sm text-gray-400 mt-1">{t("minDistanceDescription")}</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                >
                  {t("reset")}
                </button>
                <button
                  onClick={() => handleSubmit(handleFormSubmit)()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF007A] to-[#A020F0] hover:from-[#e6006c] hover:to-[#8a1bc4] text-white transition-all"
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
