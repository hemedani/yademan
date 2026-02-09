"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMapStore } from "@/stores/mapStore";
import { categorySchema } from "@/types/declarations/selectInp";
import { gets as getCategoryList } from "@/app/actions/category/gets";

interface SearchFilterHubProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const SearchFilterHub: React.FC<SearchFilterHubProps> = ({ searchValue, onSearchChange }) => {
  const [categories, setCategories] = useState<categorySchema[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const setFilters = useMapStore((state) => state.setFilters);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoryList({
          set: {
            page: 1,
            limit: 50,
          },
          get: {
            _id: 1,
            name: 1,
            icon: 1,
            color: 1,
          },
        });

        if (response.success && response.body) {
          setCategories(response.body);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category selection for multi-select
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryIds((prev) => {
      const newIds = prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
      return newIds;
    });
  };

  // Update map filters when selectedCategoryIds changes
  useEffect(() => {
    setFilters({ categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined });
  }, [selectedCategoryIds, setFilters]);

  return (
    <div className="flex flex-col items-center w-full px-4">
      {/* Search Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xl mb-3"
      >
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو در نقشه..."
          dir="rtl"
          className="w-full py-4 pr-14 pl-6 rounded-full bg-black/10 backdrop-blur-2xl border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-0 focus:border-[#FF007A] focus:shadow-[0_0_15px_rgba(255,0,122,0.3)] relative search-filter-input"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-white/70" />
        </div>
        {/* Neon scanner line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF007A] to-transparent opacity-50" />
      </motion.div>

      {/* Category Filters */}
      {!isCategoriesLoading && categories.length > 0 && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-3xl overflow-x-auto scrollbar-hide"
        >
          <div className="flex space-x-3 pb-2 min-w-max">
            {categories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category._id!);
              return (
                <motion.button
                  key={category._id}
                  onClick={() => handleCategorySelect(category._id!)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                    isSelected
                      ? "bg-[#FF007A]/20 text-white border border-[#FF007A] drop-shadow-[0_0_8px_#FF007A]"
                      : "bg-white/5 backdrop-blur-md border border-white/10 text-white/60 hover:border-white/40"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {category.icon && (
                    <>
                      <span className="text-lg" style={{ color: category.color }}>
                        {category.icon}
                      </span>
                      <div className="w-px h-5 bg-white/30 mx-1" /> {/* Divider */}
                    </>
                  )}
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchFilterHub;
