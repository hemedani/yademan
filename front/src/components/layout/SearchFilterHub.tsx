"use client";
import React, { useState, useEffect } from "react";

// Stable fallback — must NOT be inline in the selector or a new reference is created
// on every render, causing Zustand's Object.is check to always differ → infinite loop.
const EMPTY_IDS: string[] = [];
import { motion } from "framer-motion";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMapStore } from "@/stores/mapStore";
import { AnimatePresence } from "framer-motion";
import { categorySchema } from "@/types/declarations/selectInp";
import { gets as getCategoryList } from "@/app/actions/category/gets";

interface SearchFilterHubProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch?: (searchValue: string) => void;
}

const SearchFilterHub: React.FC<SearchFilterHubProps> = ({
  searchValue,
  onSearchChange,
  onSearch,
}) => {
  const [categories, setCategories] = useState<categorySchema[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const setFilters = useMapStore((state) => state.setFilters);
  const showCategoryList = useMapStore((state) => state.showCategoryList);
  // Read selections directly from the store so AdvancedSearchModal stays in sync.
  // Using EMPTY_IDS (stable module-level ref) instead of inline ?? [] prevents the
  // Zustand selector from returning a new array reference on every render.
  const selectedCategoryIds = useMapStore((state) => state.filters.categoryIds ?? EMPTY_IDS);

  // Handle search request to backend
  const handleSearch = () => {
    if (searchValue.trim()) {
      // Update filters with the search name
      setFilters({ name: searchValue.trim() });
      // Call the optional onSearch callback if provided
      onSearch?.(searchValue.trim());
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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

  // Handle category selection for multi-select — write directly to the store
  const handleCategorySelect = (categoryId: string) => {
    const newIds = selectedCategoryIds.includes(categoryId)
      ? selectedCategoryIds.filter((id) => id !== categoryId)
      : [...selectedCategoryIds, categoryId];
    setFilters({ categoryIds: newIds.length > 0 ? newIds : undefined });
  };

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
          onKeyPress={handleKeyPress}
          placeholder="جستجو در نقشه..."
          dir="rtl"
          className="w-full py-4 pr-6 pl-14 rounded-full bg-black/10 backdrop-blur-2xl border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-0 focus:border-[#FF007A] focus:shadow-[0_0_15px_rgba(255,0,122,0.3)] relative search-filter-input"
        />
        <button
          onClick={handleSearch}
          className="absolute inset-y-0 left-0 flex items-center pl-5 cursor-pointer hover:scale-110 transition-transform"
          aria-label="جستجو"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-white/70 hover:text-[#FF007A]" />
        </button>
        {/* Neon scanner line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF007A] to-transparent opacity-50" />
      </motion.div>

      {/* Category Filters */}
      <AnimatePresence>
        {!isCategoriesLoading && categories.length > 0 && showCategoryList && (
          <motion.div
            key="category-list"
            initial={{ opacity: 0, y: -12, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -12, scaleY: 0.9 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
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
      </AnimatePresence>
    </div>
  );
};

export default SearchFilterHub;
