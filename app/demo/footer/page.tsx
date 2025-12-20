"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { Footer } from "@/components/layout/footer";

export default function FooterDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Footer Demo</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Showcasing the comprehensive footer component with all navigation links and features
          </p>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Main Content Area</h2>
          <p className="text-muted-foreground mb-4">
            This is a demo page to showcase the footer component. The footer below demonstrates 
            all the navigation links, social media icons, newsletter signup, and other features.
          </p>
          <p className="text-muted-foreground">
            Scroll down to see the footer in action.
          </p>
        </div>
        
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center mb-8">
          <p className="text-muted-foreground">Additional content area</p>
        </div>
        
        <div className="h-96 bg-muted rounded-lg flex items-center justify-center mb-8">
          <p className="text-muted-foreground">More content for scrolling</p>
        </div>
      </div>
      
      {/* Footer will appear at the bottom */}
      <Footer />
    </div>
  );
}