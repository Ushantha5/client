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
  FileText,
  Download,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportData {
  id: string;
  title: string;
  description: string;
  generatedAt: string;
  type: string;
  status: string;
}

export default function ReportsManagement() {
  const { user } = useEnhancedUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [reportType, setReportType] = useState("all");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/");
    } else {
      fetchReports();
    }
  }, [user, router, reportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Simulate fetching reports
      // In a real implementation, you would call an API endpoint to get reports
      setReports([
        {
          id: "1",
          title: "User Activity Report",
          description: "Detailed analysis of user engagement and activity patterns",
          generatedAt: "2023-06-15T10:30:00Z",
          type: "activity",
          status: "generated",
        },
        {
          id: "2",
          title: "Financial Summary",
          description: "Comprehensive financial report including revenue and expenses",
          generatedAt: "2023-06-10T14:45:00Z",
          type: "financial",
          status: "generated",
        },
        {
          id: "3",
          title: "Course Performance",
          description: "Analysis of course completion rates and student feedback",
          generatedAt: "2023-06-05T09:15:00Z",
          type: "performance",
          status: "generated",
        },
        {
          id: "4",
          title: "System Usage",
          description: "Technical metrics and system resource utilization",
          generatedAt: "2023-05-28T16:20:00Z",
          type: "technical",
          status: "generated",
        },
        {
          id: "5",
          title: "Enrollment Trends",
          description: "Monthly enrollment statistics and forecasting",
          generatedAt: "2023-05-20T11:05:00Z",
          type: "enrollment",
          status: "generated",
        },
      ]);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    try {
      setLoading(true);
      // Simulate report generation
      // In a real implementation, you would call an API endpoint to generate a report
      toast.info(`Generating ${type} report...`);
      setTimeout(() => {
        toast.success(`${type} report generated successfully`);
        fetchReports(); // Refresh the reports list
      }, 2000);
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (id: string, title: string) => {
    // Simulate report download
    toast.info(`Downloading ${title}...`);
    setTimeout(() => {
      toast.success(`${title} downloaded successfully`);
    }, 1000);
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
        <DashboardHeader title="Reports Management" navigation={adminNavigation} />

        <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Reports Management</h2>
              <p className="text-muted-foreground">
                Generate, view, and download platform reports
              </p>
            </div>
            <div className="flex gap-2">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="activity">Activity Reports</SelectItem>
                  <SelectItem value="financial">Financial Reports</SelectItem>
                  <SelectItem value="performance">Performance Reports</SelectItem>
                  <SelectItem value="technical">Technical Reports</SelectItem>
                  <SelectItem value="enrollment">Enrollment Reports</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => generateReport(reportType)} disabled={loading}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Report Generation Quick Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5 cursor-pointer" onClick={() => generateReport("activity")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Activity Report</CardTitle>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Generate</div>
                <p className="text-xs text-muted-foreground">User engagement metrics</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5 cursor-pointer" onClick={() => generateReport("financial")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Financial Report</CardTitle>
                <LineChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Generate</div>
                <p className="text-xs text-muted-foreground">Revenue and expenses</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5 cursor-pointer" onClick={() => generateReport("performance")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Performance Report</CardTitle>
                <PieChart className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Generate</div>
                <p className="text-xs text-muted-foreground">Course and user performance</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5 cursor-pointer" onClick={() => generateReport("enrollment")}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Enrollment Report</CardTitle>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">Generate</div>
                <p className="text-xs text-muted-foreground">Student enrollment trends</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>
                Generated reports ready for download
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">Loading reports...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(report.generatedAt).toLocaleDateString()} • {report.type}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          {report.status}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadReport(report.id, report.title)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Report Templates */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>
                Predefined report templates for common use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-border/30 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Daily overview of platform activity and key metrics
                    </p>
                    <Button variant="outline" size="sm" onClick={() => generateReport("daily")}>
                      Generate
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/30 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Weekly breakdown of user engagement and course performance
                    </p>
                    <Button variant="outline" size="sm" onClick={() => generateReport("weekly")}>
                      Generate
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border/30 hover:border-primary/30 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">Monthly Financial</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Comprehensive monthly financial report with detailed analysis
                    </p>
                    <Button variant="outline" size="sm" onClick={() => generateReport("monthly")}>
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}