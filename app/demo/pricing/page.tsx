"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState } from "react";
import { LocationBasedPrice } from "@/components/pricing/location-based-price";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PricingDemoPage() {
  const [basePrice, setBasePrice] = useState<number>(99.99);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Location-Based Pricing Demo</CardTitle>
          <CardDescription>
            See how prices are automatically calculated based on your location
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="basePrice" className="text-lg font-semibold">
                  Base Price (${basePrice.toFixed(2)})
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="basePrice"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-32"
                    step="0.01"
                    min="10"
                    max="500"
                  />
                  <span className="text-muted-foreground">USD</span>
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">How It Works</h3>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Automatically detects your location using browser geolocation</li>
                  <li>• Falls back to IP-based detection if geolocation is denied</li>
                  <li>• Applies location-specific tax rates and currency conversion</li>
                  <li>• Adds delivery/service charges based on your region</li>
                  <li>• Displays final price in your local currency</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <LocationBasedPrice basePrice={basePrice} className="w-full max-w-md" />
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Technical Implementation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Frontend Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Uses Browser Geolocation API as primary method with IP-based fallback
                </p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Backend Calculation</h4>
                <p className="text-sm text-muted-foreground">
                  Matches location to pricing rules with cascading specificity (City → State → Country)
                </p>
              </div>
              <div className="bg-primary/5 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Dynamic Pricing</h4>
                <p className="text-sm text-muted-foreground">
                  Applies tax rates, currency conversion, and location-specific fees
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}