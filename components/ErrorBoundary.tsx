"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    
    // Log to analytics
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      console.log("[Error Boundary]", {
        error: error.toString(),
        componentStack: errorInfo.componentStack
      });
    }
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to your error reporting service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   : JSON.stringify({
      //     error: error.toString(),
      //     componentStack: errorInfo.componentStack,
      //     url: window.location.href,
      //     timestamp: new Date().toISOString()
      //   }),
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      // If a fallback UI is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card rounded-lg border border-border p-6 shadow-lg">
            <div className="text-center space-y-4">
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-16 h-16 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
                <p className="text-muted-foreground">
                  We&#39;re sorry, but something unexpected happened. Our team has been notified.
                </p>
              </div>
              
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="text-left bg-muted/50 rounded-lg p-4 max-h-40 overflow-y-auto">
                  <p className="text-sm font-mono text-destructive">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <pre className="text-xs text-muted-foreground mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={() => window.location.reload()} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button variant="outline" onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>
              
              <div className="pt-4 text-xs text-muted-foreground">
                <p>If the problem persists, please contact support.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;