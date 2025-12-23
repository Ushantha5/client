"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { adminNavigation } from "@/data/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  LineChart,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";

interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
  courseSales: number;
}

interface RevenueSummary {
  totalRevenue: number;
  monthlyGrowth: number;
  subscriptions: number;
  avgRevenuePerUser: number;
}

export default function RevenueManagement() {
  const { user } = useEnhancedUser();
  const router = useRouter();

  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [revenueSummary, setRevenueSummary] = useState<RevenueSummary>({
    totalRevenue: 0,
    monthlyGrowth: 0,
    subscriptions: 0,
    avgRevenuePerUser: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchRevenueData();
    }
  }, [user, router]);

  const fetchRevenueData = async () => {
    try {
      // Simulate fetching revenue data
      // In a real implementation, you would call specific API endpoints for revenue data
      setRevenueData([
        { month: "Jan", revenue: 12500, subscriptions: 45, courseSales: 120 },
        { month: "Feb", revenue: 14200, subscriptions: 52, courseSales: 145 },
        { month: "Mar", revenue: 13800, subscriptions: 48, courseSales: 138 },
        { month: "Apr", revenue: 15600, subscriptions: 61, courseSales: 165 },
        { month: "May", revenue: 16800, subscriptions: 72, courseSales: 180 },
        { month: "Jun", revenue: 18200, subscriptions: 85, courseSales: 195 },
      ]);

      setRevenueSummary({
        totalRevenue: 91100,
        monthlyGrowth: 12.5,
        subscriptions: 363,
        avgRevenuePerUser: 251,
      });
    } catch (error: any) {
      console.error("Error fetching revenue data:", error);
      toast.error("Failed to load revenue data");
    }
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="hidden md:block border-r border-border/40">
        <DashboardSidebar navigation={adminNavigation} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Revenue Management" navigation={adminNavigation} />

        <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Revenue Management</h2>
            <p className="text-muted-foreground">
              Track and analyze platform financial performance
            </p>
          </div>

          {/* Revenue Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">${(revenueSummary.totalRevenue / 1000).toFixed(1)}k</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+{revenueSummary.monthlyGrowth}%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  New Subscriptions
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{revenueSummary.subscriptions}</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8.2%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Revenue/User
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-orange-500/10">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">${revenueSummary.avgRevenuePerUser}</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+3.7%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Growth
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{revenueSummary.monthlyGrowth}%</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+1.2%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly revenue performance over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">Revenue trend chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
                <CardDescription>
                  Breakdown of revenue by source
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">Revenue sources chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Data Table */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Revenue Data</CardTitle>
              <CardDescription>
                Detailed breakdown of monthly revenue performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Month</th>
                      <th className="text-left py-3 px-4 font-medium">Revenue</th>
                      <th className="text-left py-3 px-4 font-medium">Subscriptions</th>
                      <th className="text-left py-3 px-4 font-medium">Course Sales</th>
                      <th className="text-left py-3 px-4 font-medium">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((data, index) => (
                      <tr key={index} className="border-b hover:bg-accent/5">
                        <td className="py-3 px-4 font-medium">{data.month}</td>
                        <td className="py-3 px-4">${data.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{data.subscriptions}</td>
                        <td className="py-3 px-4">{data.courseSales}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-green-600">+{(Math.random() * 15).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}