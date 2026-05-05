// src/contexts/NavigationContext.tsx
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type NavigationState = {
  currentVenture: 'novizio' | 'hourbour';
  currentViewId?: string; // e.g., 'command', 'analytics', 'campaign-studio' - venture-specific
};

interface NavigationContextType {
  state: NavigationState;
  setVenture: (venture: 'novizio' | 'hourbour') => void;
  navigateTo: (viewId: string) => void;
  getCurrentVentureName: () => string;
}

// Initial default state and context creation
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
};

// Provider component to wrap the application and manage state
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NavigationState>({
    currentVenture: 'novizio', // Default venture on load - can be changed via URL params later
  });

  // Function to handle venture switching
  const setVenture = useCallback((venture: 'novizio' | 'hourbour') => {
    console.log(`[YVON Nav]: Switching venture to ${venture}`);
    setState({ currentVenture: venture, currentViewId: undefined });
  }, []);

  // Function to handle navigation within current venture
  const navigateTo = useCallback((viewId: string) => {
    console.log(`[YVON Nav]: Navigating to view ${viewId} in venture ${state.currentVenture}`);
    setState({ ...state, currentViewId: viewId });
  }, [state.currentVenture]);

  const getCurrentVentureName = useCallback(() => {
    return state.currentVenture;
  }, [state.currentVenture]);

  const contextValue = {
    state,
    setVenture,
    navigateTo,
    getCurrentVentureName,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};