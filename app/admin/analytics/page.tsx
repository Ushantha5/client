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
  LineChart,
  PieChart,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

// Define types for our data
interface UserGrowthData {
  month: string;
  users: number;
}

interface CourseEnrollmentData {
  course: string;
  enrollments: number;
}

interface RevenueTrendData {
  month: string;
  revenue: number;
}

interface PopularCourseData {
  title: string;
  students: number;
  rating: number;
}

interface AnalyticsData {
  userGrowth: UserGrowthData[];
  courseEnrollments: CourseEnrollmentData[];
  revenueTrends: RevenueTrendData[];
  popularCourses: PopularCourseData[];
}

export default function AnalyticsDashboard() {
  const { user } = useEnhancedUser();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    userGrowth: [],
    courseEnrollments: [],
    revenueTrends: [],
    popularCourses: [],
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchAnalyticsData();
    }
  }, [user, router]);

  const fetchAnalyticsData = async () => {
    try {
      // In a real implementation, you would fetch actual analytics data
      // For now, we'll use mock data to demonstrate the UI
      setAnalyticsData({
        userGrowth: [
          { month: "Jan", users: 45 },
          { month: "Feb", users: 52 },
          { month: "Mar", users: 48 },
          { month: "Apr", users: 61 },
          { month: "May", users: 72 },
          { month: "Jun", users: 85 },
        ],
        courseEnrollments: [
          { course: "Mathematics", enrollments: 120 },
          { course: "Physics", enrollments: 95 },
          { course: "Chemistry", enrollments: 87 },
          { course: "Biology", enrollments: 78 },
          { course: "Computer Science", enrollments: 110 },
        ],
        revenueTrends: [
          { month: "Jan", revenue: 12500 },
          { month: "Feb", revenue: 14200 },
          { month: "Mar", revenue: 13800 },
          { month: "Apr", revenue: 15600 },
          { month: "May", revenue: 16800 },
          { month: "Jun", revenue: 18200 },
        ],
        popularCourses: [
          { title: "Advanced Mathematics", students: 120, rating: 4.8 },
          { title: "Quantum Physics", students: 95, rating: 4.7 },
          { title: "Organic Chemistry", students: 87, rating: 4.6 },
          { title: "Genetics", students: 78, rating: 4.5 },
          { title: "Machine Learning", students: 110, rating: 4.9 },
        ],
      });
    } catch (error: any) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data");
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
        <DashboardHeader title="Analytics Dashboard" navigation={adminNavigation} />

        <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics Overview</h2>
            <p className="text-muted-foreground">
              Detailed insights and metrics for your platform
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">1,248</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12.5%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Courses
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">42</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8.1%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Revenue
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-orange-500/10">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">$24,560</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+23.5%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Engagement Rate
                </CardTitle>
                <div className="p-2.5 rounded-xl bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">78.2%</div>
                <div className="flex items-center text-sm mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+4.2%</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  Monthly user registration trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">User growth chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly revenue performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">Revenue trends chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Course Enrollments</CardTitle>
                <CardDescription>
                  Top courses by enrollment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mx-auto mb-2 opacity-20" />
                    <span className="text-sm">Course enrollment chart</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Popular Courses</CardTitle>
                <CardDescription>
                  Highest rated courses on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.popularCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-muted-foreground">{course.students} students</p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{course.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}