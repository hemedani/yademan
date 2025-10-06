"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  address: string;
}

const SearchBar: React.FC = () => {
  const t = useTranslations("HomePage");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const mockResults = useMemo(
    () => [
      {
        id: "1",
        title: "تخت جمشید",
        category: "مکان تاریخی",
        address: "فارس، شیراز، مرودشت",
      },
      {
        id: "2",
        title: "میدان نقش جهان",
        category: "میراث جهانی",
        address: "اصفهان، میدان امام",
      },
      {
        id: "3",
        title: "برج آزادی",
        category: "بنای یادبود",
        address: "تهران، میدان آزادی",
      },
    ],
    [],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    const timer = setTimeout(() => {
      const filteredResults = mockResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.address.toLowerCase().includes(query.toLowerCase()) ||
          result.category.toLowerCase().includes(query.toLowerCase()),
      );
      setResults(filteredResults);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, mockResults]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectResult = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    // Handle navigation or selection logic here
    console.log("Selected:", result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Handle search submission
      console.log("Searching for:", query);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-full lg:max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400"
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
          </div>

          {/* Input Field - Mobile-first responsive */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t("searchPlaceholder")}
            className="block w-full pl-11 pr-12 sm:pl-12 sm:pr-14 py-3 sm:py-4 text-base sm:text-lg border border-gray-300 rounded-lg sm:rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />

          {/* Clear Button - Larger touch target */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center min-w-[44px] min-h-[44px] justify-center"
              aria-label="پاک کردن جستجو"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 hover:text-gray-600 transition-colors"
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
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown - Mobile responsive */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 max-h-64 sm:max-h-72 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-4 text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600 text-sm sm:text-base">
                  در حال جستجو...
                </span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-right px-4 py-4 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors min-h-[64px] touch-manipulation"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 616 0z"
                        />
                      </svg>
                    </div>
                    <div className="mr-3 flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">
                        {result.category} • {result.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-4 text-center text-gray-500 text-sm sm:text-base">
              نتیجه‌ای یافت نشد
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
