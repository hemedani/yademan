"use client";

import { useState, useCallback } from "react";

interface UseFilterPanelReturn {
  isFilterOpen: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
}

export function useFilterPanel(): UseFilterPanelReturn {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const openFilter = useCallback(() => {
    setIsFilterOpen(true);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterOpen(false);
  }, []);

  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  return {
    isFilterOpen,
    openFilter,
    closeFilter,
    toggleFilter,
  };
}
