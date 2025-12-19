"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

interface Metric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
  entries: PerformanceEntry[];
}

const reportHandler = (metric: Metric) => {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log("[Web Vitals]", metric);
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

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== "undefined" && "performance" in window) {
      // Measure Core Web Vitals
      onCLS(reportHandler); // Cumulative Layout Shift
      onFCP(reportHandler); // First Contentful Paint
      onINP(reportHandler); // Interaction to Next Paint
      onLCP(reportHandler); // Largest Contentful Paint
      onTTFB(reportHandler); // Time to First Byte
    }
  }, []);

  return null; // This component doesn't render anything
}