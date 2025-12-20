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

const reportHandler = (_metric: Metric) => {
  // In development, we can optionally log to console or silence it
  if (process.env.NODE_ENV === "development") {
    // console.log("[Web Vitals]", metric);
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === "production") {
    // Example: Send to your analytics service
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