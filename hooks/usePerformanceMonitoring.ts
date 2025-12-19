"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

// Types for web vitals
interface Metric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
  entries: PerformanceEntry[];
}

// Report handler function
const reportHandler = (metric: Metric) => {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to your analytics service
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
  }
};

// Hook to monitor performance
export function usePerformanceMonitoring() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined" && "performance" in window) {
      // Measure Core Web Vitals
      onCLS(reportHandler); // Cumulative Layout Shift
      onFCP(reportHandler); // First Contentful Paint
      onINP(reportHandler); // Interaction to Next Paint
      onLCP(reportHandler); // Largest Contentful Paint
      onTTFB(reportHandler); // Time to First Byte
      
      // Log performance marks
      if (process.env.NODE_ENV === "development") {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            console.log("Performance Entry:", entry.name, entry.duration);
          });
        });
        
        observer.observe({ entryTypes: ["measure", "navigation", "paint"] });
        
        return () => {
          observer.disconnect();
        };
      }
    }
  }, []);
}