'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  address: string;
}

const SearchBar: React.FC = () => {
  const t = useTranslations('HomePage');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'تخت جمشید',
      category: 'مکان تاریخی',
      address: 'فارس، شیراز، مرودشت'
    },
    {
      id: '2',
      title: 'میدان نقش جهان',
      category: 'میراث جهانی',
      address: 'اصفهان، میدان امام'
    },
    {
      id: '3',
      title: 'برج آزادی',
      category: 'بنای یادبود',
      address: 'تهران، میدان آزادی'
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.address.toLowerCase().includes(query.toLowerCase()) ||
          result.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setIsOpen(true);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectResult = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    // Handle navigation or selection logic here
    console.log('Selected:', result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Handle search submission
      console.log('Searching for:', query);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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

          {/* Input Field */}
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={t('searchPlaceholder')}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
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

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {isLoading ? (
            <div className="px-4 py-3 text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-gray-600 text-sm">در حال جستجو...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {result.category} • {result.address}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-3 text-center text-gray-500 text-sm">
              نتیجه‌ای یافت نشد
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
