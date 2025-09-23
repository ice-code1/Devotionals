import React, { createContext, useContext, useEffect } from 'react';
import { useAnalytics, useAnalyticsEvents } from '../hooks/useAnalytics';

interface AnalyticsContextType {
  trackEvent: (
    eventType: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    devotionalId?: string
  ) => void;
  trackClick: (element: string, location?: string) => void;
  trackDownload: (fileName: string, devotionalId?: string) => void;
  trackShare: (method: string, devotionalId?: string) => void;
  trackGamePlay: (gameName: string, score?: number, devotionalId?: string) => void;
  trackGameComplete: (gameName: string, score?: number, devotionalId?: string) => void;
  trackFavorite: (action: 'add' | 'remove', devotionalId?: string) => void;
  trackReadAloud: (action: 'start' | 'pause' | 'complete', devotionalId?: string) => void;
  trackFormSubmit: (formType: string, success?: boolean) => void;
  trackSearch: (query: string, results: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { trackEvent } = useAnalytics();
  const analyticsEvents = useAnalyticsEvents();

  return (
    <AnalyticsContext.Provider value={{ trackEvent, ...analyticsEvents }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}