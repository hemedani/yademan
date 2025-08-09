'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MapComparisonState {
  isComparisonMode: boolean;
  selectedLocations: string[];
  maxComparisons: number;
}

interface MapComparisonContextType {
  state: MapComparisonState;
  toggleComparisonMode: () => void;
  addLocationToComparison: (locationId: string) => boolean;
  removeLocationFromComparison: (locationId: string) => void;
  clearComparisons: () => void;
  isLocationInComparison: (locationId: string) => boolean;
  canAddMoreLocations: () => boolean;
}

const MapComparisonContext = createContext<MapComparisonContextType | undefined>(undefined);

interface MapComparisonProviderProps {
  children: ReactNode;
}

export const MapComparisonProvider: React.FC<MapComparisonProviderProps> = ({ children }) => {
  const [state, setState] = useState<MapComparisonState>({
    isComparisonMode: false,
    selectedLocations: [],
    maxComparisons: 4
  });

  const toggleComparisonMode = () => {
    setState(prev => ({
      ...prev,
      isComparisonMode: !prev.isComparisonMode,
      selectedLocations: prev.isComparisonMode ? [] : prev.selectedLocations
    }));
  };

  const addLocationToComparison = (locationId: string): boolean => {
    if (state.selectedLocations.length >= state.maxComparisons ||
        state.selectedLocations.includes(locationId)) {
      return false;
    }

    setState(prev => ({
      ...prev,
      selectedLocations: [...prev.selectedLocations, locationId]
    }));
    return true;
  };

  const removeLocationFromComparison = (locationId: string) => {
    setState(prev => ({
      ...prev,
      selectedLocations: prev.selectedLocations.filter(id => id !== locationId)
    }));
  };

  const clearComparisons = () => {
    setState(prev => ({
      ...prev,
      selectedLocations: []
    }));
  };

  const isLocationInComparison = (locationId: string): boolean => {
    return state.selectedLocations.includes(locationId);
  };

  const canAddMoreLocations = (): boolean => {
    return state.selectedLocations.length < state.maxComparisons;
  };

  const value: MapComparisonContextType = {
    state,
    toggleComparisonMode,
    addLocationToComparison,
    removeLocationFromComparison,
    clearComparisons,
    isLocationInComparison,
    canAddMoreLocations
  };

  return (
    <MapComparisonContext.Provider value={value}>
      {children}
    </MapComparisonContext.Provider>
  );
};

export const useMapComparison = (): MapComparisonContextType => {
  const context = useContext(MapComparisonContext);
  if (context === undefined) {
    throw new Error('useMapComparison must be used within a MapComparisonProvider');
  }
  return context;
};
