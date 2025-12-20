"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Trash2,
    Globe,
    Percent,
    DollarSign,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = '/api';

export default function PricingAdmin() {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // New rule form
    const [newRule, setNewRule] = useState({
        location: { country: '', state: '', city: '' },
        taxPercentage: 0,
        currency: 'USD',
        currencyMultiplier: 1,
        deliveryCharge: 0,
        serviceCharge: 0
    });

    const fetchRules = async () => {
        try {
            const res = await axios.get(`${API_URL}/pricing/rules`, { withCredentials: true });
            setRules(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch rules");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${API_URL}/pricing/rules`, newRule, { withCredentials: true });
            toast.success("Rule created successfully");
            setNewRule({
                location: { country: '', state: '', city: '' },
                taxPercentage: 0,
                currency: 'USD',
                currencyMultiplier: 1,
                deliveryCharge: 0,
                serviceCharge: 0
            });
            fetchRules();
        } catch (err) {
            toast.error("Failed to create rule");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Location-based Pricing Management</h1>
                <p className="text-muted-foreground">Manage taxes and currency multipliers per region</p>
            </div>

            {/* Create New Rule Section */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" /> Create New Pricing Rule
                </h2>
                <form onSubmit={handleCreateRule} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label>Country *</Label>
                        <Input
                            placeholder="e.g. India"
                            required
                            value={newRule.location.country}
                            onChange={e => setNewRule({ ...newRule, location: { ...newRule.location, country: e.target.value } })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>State (Optional)</Label>
                        <Input
                            placeholder="e.g. Tamil Nadu"
                            value={newRule.location.state}
                            onChange={e => setNewRule({ ...newRule, location: { ...newRule.location, state: e.target.value } })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>City (Optional)</Label>
                        <Input
                            placeholder="e.g. Chennai"
                            value={newRule.location.city}
                            onChange={e => setNewRule({ ...newRule, location: { ...newRule.location, city: e.target.value } })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Tax %</Label>
                        <div className="relative">
                            <Percent className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="number"
                                className="pl-9"
                                value={newRule.taxPercentage}
                                onChange={e => setNewRule({ ...newRule, taxPercentage: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Currency Code</Label>
                        <Input
                            placeholder="e.g. INR"
                            value={newRule.currency}
                            onChange={e => setNewRule({ ...newRule, currency: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Currency Multiplier (v USD)</Label>
                        <Input
                            type="number"
                            step="0.0001"
                            value={newRule.currencyMultiplier}
                            onChange={e => setNewRule({ ...newRule, currencyMultiplier: Number(e.target.value) })}
                        />
                    </div>
                    <div className="md:col-span-3">
                        <Button type="submit" className="w-full h-11 font-bold" disabled={saving}>
                            {saving ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2 w-4 h-4" />}
                            Save Pricing Rule
                        </Button>
                    </div>
                </form>
            </div>

            {/* List Existing Rules */}
            <div className="grid gap-4">
                {rules.map((rule: any) => (
                    <div key={rule._id} className="bg-background border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold flex items-center gap-1 text-lg">
                                    {rule.location.country}
                                    {rule.location.state && <span className="text-muted-foreground font-normal text-sm">/ {rule.location.state}</span>}
                                    {rule.location.city && <span className="text-muted-foreground font-normal text-sm">/ {rule.location.city}</span>}
                                </h3>
                                <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> {rule.taxPercentage}% Tax</span>
                                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {rule.currency} (x{rule.currencyMultiplier})</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
