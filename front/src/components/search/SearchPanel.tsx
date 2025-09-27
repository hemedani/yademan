"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMapStore } from "@/stores/mapStore";

interface SearchPanelProps {
  onClose: () => void;
  onSearch: (query: string) => void;
}

interface SearchSuggestion {
  id: string;
  name: string;
  type: "place" | "category" | "tag" | "region";
  icon?: string;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onClose, onSearch }) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { setSearchQuery: setMapSearchQuery, setFilters } = useMapStore();

  // Categories for quick filtering
  const categories = [
    { id: "historical", name: "تاریخی", icon: "🏛️", color: "purple" },
    { id: "nature", name: "طبیعی", icon: "🏔️", color: "green" },
    { id: "cultural", name: "فرهنگی", icon: "🎭", color: "blue" },
    { id: "religious", name: "مذهبی", icon: "🕌", color: "teal" },
    { id: "recreation", name: "تفریحی", icon: "🎢", color: "pink" },
    { id: "food", name: "غذا و نوشیدنی", icon: "🍽️", color: "orange" },
  ];

  // Popular searches
  const popularSearches = [
    "برج آزادی",
    "پل خواجو",
    "آرامگاه حافظ",
    "میدان نقش جهان",
    "تخت جمشید",
    "برج میلاد",
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle search input change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 1) {
        fetchSuggestions(searchQuery);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async (query: string) => {
    setIsSearching(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/search/suggestions?q=${query}`);
      // const data = await response.json();

      // Mock suggestions for demonstration
      const mockSuggestions: SearchSuggestion[] = [
        {
          id: "1",
          name: query + " - مکان تاریخی",
          type: "place",
          icon: "📍",
        },
        {
          id: "2",
          name: "دسته‌بندی: " + query,
          type: "category",
          icon: "📁",
        },
        {
          id: "3",
          name: "برچسب: " + query,
          type: "tag",
          icon: "🏷️",
        },
      ];
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;

    // Save to recent searches
    const newRecentSearches = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    // Apply search
    onSearch(query);
    setMapSearchQuery(query);

    // Apply category filter if selected
    if (selectedCategory) {
      setFilters({ categories: [selectedCategory] });
    }

    onClose();
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">جستجوی پیشرفته</h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            aria-label="Close search"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
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

        {/* Search Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="جستجو برای مکان، رویداد یا منطقه..."
            className="w-full px-5 py-4 pr-12 bg-white/95 backdrop-blur text-gray-900 rounded-2xl text-lg placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/50 transition-all"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            دسته‌بندی‌ها
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(category.id)}
                className={`p-3 rounded-xl transition-all ${
                  selectedCategory === category.id
                    ? `bg-${category.color}-100 border-2 border-${category.color}-500 text-${category.color}-700`
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Search Suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              پیشنهادات
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.id}
                  whileHover={{ x: 5 }}
                  onClick={() => handleSearch(suggestion.name)}
                  className="w-full text-right p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-3"
                >
                  <span className="text-lg">{suggestion.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {suggestion.name}
                    </p>
                    <p className="text-xs text-gray-500">{suggestion.type}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-600">
                جستجوهای اخیر
              </h3>
              <button
                onClick={clearRecentSearches}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                پاک کردن
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSearch(search)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {search}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        {!searchQuery && (
          <div>
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              جستجوهای محبوب
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {popularSearches.map((search, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSearch(search)}
                  className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl text-sm text-gray-700 text-right transition-all"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    {search}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer with keyboard hint */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>برای بستن ESC را فشار دهید</span>
          <span className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-white rounded border border-gray-300">
              Enter
            </kbd>
            برای جستجو
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
