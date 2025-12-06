"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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
	Users,
	GraduationCap,
	BookOpen,
	BarChart,
	TrendingUp,
	DollarSign,
	UserPlus,
	Award,
} from "lucide-react";
import AdminApprovalsTable from "@/components/admin/approvals-table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user || user.role !== "admin") {
			router.push("/");
		}
	}, [user, router]);

	if (!user || user.role !== "admin") {
		return null;
	}

	const stats = [
		{
			title: "Total Students",
			value: "1,234",
			change: "+12.5%",
			trend: "up",
			icon: Users,
			color: "text-blue-600",
			bgColor: "bg-blue-50 dark:bg-blue-950",
		},
		{
			title: "Total Teachers",
			value: "56",
			change: "+4.2%",
			trend: "up",
			icon: GraduationCap,
			color: "text-green-600",
			bgColor: "bg-green-50 dark:bg-green-950",
		},
		{
			title: "Active Courses",
			value: "89",
			change: "+8.1%",
			trend: "up",
			icon: BookOpen,
			color: "text-purple-600",
			bgColor: "bg-purple-50 dark:bg-purple-950",
		},
		{
			title: "Revenue",
			value: "$45,678",
			change: "+23.5%",
			trend: "up",
			icon: DollarSign,
			color: "text-yellow-600",
			bgColor: "bg-yellow-50 dark:bg-yellow-950",
		},
	];

	const recentActivity = [
		{
			action: "New student registered",
			user: "John Doe",
			time: "2 minutes ago",
			icon: UserPlus,
		},
		{
			action: "Course published",
			user: "Jane Smith",
			time: "1 hour ago",
			icon: BookOpen,
		},
		{
			action: "Teacher approved",
			user: "Mike Johnson",
			time: "3 hours ago",
			icon: Award,
		},
	];

	const courseStats = [
		{ name: "Web Development", enrolled: 450, progress: 85 },
		{ name: "Data Science", enrolled: 320, progress: 72 },
		{ name: "Mobile Development", enrolled: 280, progress: 68 },
		{ name: "AI & Machine Learning", enrolled: 184, progress: 45 },
	];

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
			{/* Sidebar */}
			<aside className="hidden md:block">
				<DashboardSidebar navigation={adminNavigation} />
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				<DashboardHeader title="Admin Dashboard" navigation={adminNavigation} />

				<main className="flex-1 p-6 space-y-6">
					{/* Stats Grid */}
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{stats.map((stat, index) => (
							<Card key={index} className="hover:shadow-lg transition-shadow">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										{stat.title}
									</CardTitle>
									<div className={`p-2 rounded-lg ${stat.bgColor}`}>
										<stat.icon className={`h-5 w-5 ${stat.color}`} />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold">{stat.value}</div>
									<div className="flex items-center text-sm mt-1">
										<TrendingUp className="h-4 w-4 text-green-600 mr-1" />
										<span className="text-green-600 font-medium">
											{stat.change}
										</span>
										<span className="text-muted-foreground ml-1">
											from last month
										</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Admin Approvals */}
					<Card>
						<CardHeader>
							<CardTitle>Pending Approvals</CardTitle>
							<CardDescription>
								Review and approve teacher and Avathor AI registrations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminApprovalsTable />
						</CardContent>
					</Card>

					{/* Tabs Section */}
					<Tabs defaultValue="overview" className="space-y-4">
						<TabsList>
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="courses">Courses</TabsTrigger>
							<TabsTrigger value="activity">Recent Activity</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-4">
							<div className="grid gap-4 md:grid-cols-2">
								<Card>
									<CardHeader>
										<CardTitle>Enrollment Trends</CardTitle>
										<CardDescription>
											Student enrollment over the last 6 months
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[200px] flex items-center justify-center text-muted-foreground">
											<BarChart className="h-16 w-16 opacity-20" />
											<span className="ml-2">Chart placeholder</span>
										</div>
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle>Revenue Growth</CardTitle>
										<CardDescription>
											Monthly revenue comparison
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[200px] flex items-center justify-center text-muted-foreground">
											<TrendingUp className="h-16 w-16 opacity-20" />
											<span className="ml-2">Chart placeholder</span>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="courses" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Top Courses</CardTitle>
									<CardDescription>
										Most popular courses by enrollment
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{courseStats.map((course, index) => (
										<div key={index} className="space-y-2">
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<p className="text-sm font-medium">{course.name}</p>
													<p className="text-xs text-muted-foreground">
														{course.enrolled} students enrolled
													</p>
												</div>
												<span className="text-sm font-medium">
													{course.progress}%
												</span>
											</div>
											<Progress value={course.progress} className="h-2" />
										</div>
									))}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="activity" className="space-y-4">
							<Card>
								<CardHeader>
									<CardTitle>Recent Activity</CardTitle>
									<CardDescription>
										Latest updates from your platform
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{recentActivity.map((activity, index) => (
											<div
												key={index}
												className="flex items-center gap-4 border-b pb-3 last:border-0"
											>
												<div className="p-2 rounded-lg bg-muted">
													<activity.icon className="h-5 w-5 text-muted-foreground" />
												</div>
												<div className="flex-1">
													<p className="font-medium text-sm">{activity.action}</p>
													<p className="text-sm text-muted-foreground">
														{activity.user}
													</p>
												</div>
												<span className="text-sm text-muted-foreground">
													{activity.time}
												</span>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</div>
	);
}
