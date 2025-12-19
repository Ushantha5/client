"use client";

import React, { useState, useEffect } from 'react';
import LocationService from '@/services/location.service';
import PricingService from '@/services/pricing.service';
import { MapPin, RefreshCcw, AlertTriangle } from 'lucide-react';

interface PricingData {
    basePrice: number;
    originalBasePrice: number;
    location: {
        country: string;
        state?: string;
        city?: string;
    };
    taxPercentage: number;
    taxAmount: number;
    deliveryCharge: number;
    serviceCharge: number;
    totalPrice: number;
    currency: string;
    message?: string;
}

interface LocationBasedPriceProps {
    basePrice: number;
    className?: string;
}

export const LocationBasedPrice: React.FC<LocationBasedPriceProps> = ({ basePrice, className = "" }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [pricingData, setPricingData] = useState<PricingData | null>(null);

    const fetchPricing = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const location = await LocationService.getLocation();
            if (location) {
                const result = await PricingService.calculatePrice(basePrice, location);
                if (result.success) {
                    setPricingData(result.data);
                } else {
                    throw new Error(result.message || "Failed to calculate price");
                }
            } else {
                throw new Error("Could not detect location automatically");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }, [basePrice]);

    useEffect(() => {
        fetchPricing();
    }, [fetchPricing]);

    if (loading) {
        return (
            <div className={`p-4 rounded-xl bg-muted/50 animate-pulse flex flex-col gap-2 ${className}`}>
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-8 w-32 bg-muted rounded"></div>
            </div>
        );
    }

    if (error || !pricingData) {
        return (
            <div className={`p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex flex-col gap-2 ${className}`}>
                <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Pricing Error</span>
                </div>
                <p className="text-sm opacity-80">{error}</p>
                <button
                    onClick={fetchPricing}
                    className="mt-2 text-xs flex items-center gap-1 hover:underline font-semibold"
                >
                    <RefreshCcw className="h-3 w-3" /> Retry
                </button>
            </div>
        );
    }

    const {
        totalPrice,
        currency,
        taxAmount,
        deliveryCharge,
        serviceCharge,
        location,
        basePrice: convertedBase
    } = pricingData;

    return (
        <div className={`p-6 rounded-2xl bg-gradient-to-br from-background to-muted border border-border/50 shadow-xl ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{location.city ? `${location.city}, ` : ''}{location.state ? `${location.state}, ` : ''}{location.country}</span>
                </div>
                <button
                    onClick={fetchPricing}
                    className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                    title="Refresh Location & Price"
                >
                    <RefreshCcw className="h-3.5 w-3.5" />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span>{currency} {convertedBase.toLocaleString()}</span>
                </div>

                {taxAmount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Regional Tax</span>
                        <span className="text-success text-green-500">+{currency} {taxAmount.toLocaleString()}</span>
                    </div>
                )}

                {(deliveryCharge > 0 || serviceCharge > 0) && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Other Charges</span>
                        <span>{currency} {(deliveryCharge + serviceCharge).toLocaleString()}</span>
                    </div>
                )}

                <div className="pt-3 border-t border-border/50">
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-lg">Total Price</span>
                        <div className="text-right">
                            <span className="text-3xl font-black text-primary">
                                {currency} {totalPrice.toLocaleString()}
                            </span>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Inc. all taxes</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
