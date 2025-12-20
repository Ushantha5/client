"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

interface EventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}

interface PageViewData {
  path: string;
  title?: string;
  referrer?: string;
  customData?: Record<string, any>;
}

export function useAnalytics() {
  const pathname = usePathname();



  // Track custom events
  const trackEvent = useCallback((_data: EventData) => {
    if (typeof window === "undefined") return;

    /*
    const eventData = {
      ...data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    */

    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      // console.log("[Analytics Event]", eventData);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to your analytics service
      // fetch('/api/analytics/events', {
      //   method: 'POST',
      //   body: JSON.stringify(eventData),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
    }
  }, []);

  // Track page views (function definition)
  const trackPageView = useCallback((_data: PageViewData) => {
    if (typeof window === "undefined") return;

    /*
    const pageViewData = {
      ...data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight
    };
    */

    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      // console.log("[Analytics PageView]", pageViewData);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to your analytics service
      // fetch('/api/analytics/pageviews', {
      //   method: 'POST',
      //   body: JSON.stringify(pageViewData),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
    }
  }, []);

  // Track page views (effect)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pageData: PageViewData = {
        path: pathname,
        title: document.title,
        referrer: document.referrer,
        customData: {}
      };

      trackPageView(pageData);
    }
  }, [pathname, trackPageView]);

  // Track user timing
  const trackTiming = useCallback((_category: string, _variable: string, _value: number, _label?: string) => {
    if (typeof window === "undefined") return;

    /*
    const timingData = {
      category,
      variable,
      value,
      label,
      timestamp: new Date().toISOString()
    };
    */

    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      // console.log("[Analytics Timing]", timingData);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to your analytics service
      // fetch('/api/analytics/timing', {
      //   method: 'POST',
      //   body: JSON.stringify(timingData),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
    }
  }, []);

  // Track exceptions
  const trackException = useCallback((description: string, fatal = false) => {
    if (typeof window === "undefined") return;

    const exceptionData = {
      description,
      fatal,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    // In development, log to console
    if (process.env.NODE_ENV === "development") {
      console.error("[Analytics Exception]", exceptionData);
    }

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to your analytics service
      // fetch('/api/analytics/exceptions', {
      //   method: 'POST',
      //   body: JSON.stringify(exceptionData),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
    }
  }, []);

  // Track user engagement (scroll depth, time on page, etc.)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const startTime = Date.now();
    let maxScrollDepth = 0;

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
      }
    };

    const handleBeforeUnload = () => {
      const timeOnPage = Date.now() - startTime;

      trackEvent({
        category: "Engagement",
        action: "Time on Page",
        value: Math.round(timeOnPage / 1000), // seconds
        label: pathname
      });

      if (maxScrollDepth > 0) {
        trackEvent({
          category: "Engagement",
          action: "Scroll Depth",
          value: maxScrollDepth,
          label: pathname
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname, trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackTiming,
    trackException
  };
}

// Predefined tracking functions for common events
export function useCommonTracking() {
  const { trackEvent } = useAnalytics();

  const trackButtonClick = useCallback((buttonName: string, location: string) => {
    trackEvent({
      category: "UI",
      action: "Button Click",
      label: `${location} - ${buttonName}`
    });
  }, [trackEvent]);

  const trackFormSubmission = useCallback((formName: string, success: boolean) => {
    trackEvent({
      category: "Forms",
      action: success ? "Form Submit Success" : "Form Submit Error",
      label: formName
    });
  }, [trackEvent]);

  const trackNavigation = useCallback((from: string, to: string) => {
    trackEvent({
      category: "Navigation",
      action: "Page Navigation",
      label: `${from} -> ${to}`
    });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent({
      category: "Search",
      action: "Search Performed",
      label: query,
      value: resultsCount
    });
  }, [trackEvent]);

  const trackVideoPlay = useCallback((videoTitle: string, duration: number) => {
    trackEvent({
      category: "Media",
      action: "Video Play",
      label: videoTitle,
      value: Math.round(duration)
    });
  }, [trackEvent]);

  const trackCourseProgress = useCallback((courseId: string, lessonId: string, progress: number) => {
    trackEvent({
      category: "Learning",
      action: "Lesson Progress",
      label: `${courseId}/${lessonId}`,
      value: Math.round(progress)
    });
  }, [trackEvent]);

  return {
    trackButtonClick,
    trackFormSubmission,
    trackNavigation,
    trackSearch,
    trackVideoPlay,
    trackCourseProgress
  };
}