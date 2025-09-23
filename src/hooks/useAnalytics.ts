import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsSession {
  sessionId: string;
  startTime: number;
  lastPageView: number;
}

interface PageViewData {
  path: string;
  title: string;
  section?: string;
  devotionalId?: string;
  startTime: number;
}

export function useAnalytics() {
  const location = useLocation();
  const sessionRef = useRef<AnalyticsSession | null>(null);
  const currentPageRef = useRef<PageViewData | null>(null);
  const scrollDepthRef = useRef(0);

  // Initialize session
  useEffect(() => {
    initializeSession();
    setupScrollTracking();
    setupUnloadTracking();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView();
  }, [location]);

  const initializeSession = async () => {
    try {
      let sessionId = sessionStorage.getItem('analytics_session_id');
      let isFirstVisit = false;

      if (!sessionId) {
        sessionId = uuidv4();
        sessionStorage.setItem('analytics_session_id', sessionId);
        isFirstVisit = !localStorage.getItem('analytics_visited');
        localStorage.setItem('analytics_visited', 'true');
      }

      const sessionData = {
        sessionId,
        startTime: Date.now(),
        lastPageView: Date.now(),
      };

      sessionRef.current = sessionData;

      // Get user agent and device info
      const userAgent = navigator.userAgent;
      const deviceInfo = getDeviceInfo(userAgent);
      const urlParams = new URLSearchParams(window.location.search);

      // Track session start
      await supabase.from('analytics_sessions').insert({
        session_id: sessionId,
        user_agent: userAgent,
        device_type: deviceInfo.deviceType,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        referrer: document.referrer || null,
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        first_visit: isFirstVisit,
      });
    } catch (error) {
      console.error('Error initializing analytics session:', error);
    }
  };

  const trackPageView = async () => {
    if (!sessionRef.current) return;

    try {
      // End previous page view
      if (currentPageRef.current) {
        const timeOnPage = Math.round((Date.now() - currentPageRef.current.startTime) / 1000);
        
        await supabase
          .from('analytics_page_views')
          .insert({
            session_id: sessionRef.current.sessionId,
            page_path: currentPageRef.current.path,
            page_title: currentPageRef.current.title,
            section: currentPageRef.current.section,
            devotional_id: currentPageRef.current.devotionalId,
            time_on_page: timeOnPage,
            scroll_depth: scrollDepthRef.current,
          });
      }

      // Start new page view
      const section = getSectionFromPath(location.pathname);
      const devotionalId = getDevotionalIdFromPath(location.pathname);

      currentPageRef.current = {
        path: location.pathname,
        title: document.title,
        section,
        devotionalId,
        startTime: Date.now(),
      };

      scrollDepthRef.current = 0;
      sessionRef.current.lastPageView = Date.now();
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const trackEvent = useCallback(async (
    eventType: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    devotionalId?: string
  ) => {
    if (!sessionRef.current) return;

    try {
      await supabase.from('analytics_events').insert({
        session_id: sessionRef.current.sessionId,
        event_type: eventType,
        event_category: category,
        event_action: action,
        event_label: label,
        event_value: value,
        page_path: location.pathname,
        devotional_id: devotionalId,
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, [location.pathname]);

  const setupScrollTracking = () => {
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollPercent = Math.round((scrollTop + windowHeight) / documentHeight * 100);
      maxScroll = Math.max(maxScroll, scrollPercent);
      scrollDepthRef.current = Math.min(maxScroll, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  };

  const setupUnloadTracking = () => {
    const handleUnload = () => {
      if (currentPageRef.current && sessionRef.current) {
        const timeOnPage = Math.round((Date.now() - currentPageRef.current.startTime) / 1000);
        
        // Use sendBeacon for reliable tracking on page unload
        const data = {
          session_id: sessionRef.current.sessionId,
          page_path: currentPageRef.current.path,
          page_title: currentPageRef.current.title,
          section: currentPageRef.current.section,
          devotional_id: currentPageRef.current.devotionalId,
          time_on_page: timeOnPage,
          scroll_depth: scrollDepthRef.current,
        };

        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/analytics/page-view', JSON.stringify(data));
        }
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  };

  const getDeviceInfo = (userAgent: string) => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
    
    let deviceType = 'desktop';
    if (isTablet) deviceType = 'tablet';
    else if (isMobile) deviceType = 'mobile';

    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let os = 'unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return { deviceType, browser, os };
  };

  const getSectionFromPath = (path: string): string | undefined => {
    if (path.includes('/children')) return 'children';
    if (path.includes('/teenagers')) return 'teenagers';
    if (path.includes('/admin')) return 'admin';
    if (path.includes('/writer')) return 'writer';
    return undefined;
  };

  const getDevotionalIdFromPath = (path: string): string | undefined => {
    const match = path.match(/\/devotional\/(.+)/);
    return match ? match[1] : undefined;
  };

  return {
    trackEvent,
    trackPageView,
  };
}

// Convenience functions for common events
export const useAnalyticsEvents = () => {
  const { trackEvent } = useAnalytics();

  return {
    trackClick: (element: string, location?: string) => 
      trackEvent('click', 'engagement', 'click', `${element}${location ? ` - ${location}` : ''}`),
    
    trackDownload: (fileName: string, devotionalId?: string) => 
      trackEvent('download', 'conversion', 'download', fileName, undefined, devotionalId),
    
    trackShare: (method: string, devotionalId?: string) => 
      trackEvent('share', 'engagement', 'share', method, undefined, devotionalId),
    
    trackGamePlay: (gameName: string, score?: number, devotionalId?: string) => 
      trackEvent('game', 'engagement', 'play', gameName, score, devotionalId),
    
    trackGameComplete: (gameName: string, score?: number, devotionalId?: string) => 
      trackEvent('game', 'engagement', 'complete', gameName, score, devotionalId),
    
    trackFavorite: (action: 'add' | 'remove', devotionalId?: string) => 
      trackEvent('favorite', 'engagement', action, 'devotional', undefined, devotionalId),
    
    trackReadAloud: (action: 'start' | 'pause' | 'complete', devotionalId?: string) => 
      trackEvent('audio', 'engagement', action, 'read-aloud', undefined, devotionalId),
    
    trackFormSubmit: (formType: string, success: boolean = true) => 
      trackEvent('form', 'conversion', 'submit', formType, success ? 1 : 0),
    
    trackSearch: (query: string, results: number) => 
      trackEvent('search', 'engagement', 'search', query, results),
  };
};