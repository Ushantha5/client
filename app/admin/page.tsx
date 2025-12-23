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
	Users,
	GraduationCap,
	BookOpen,
	BarChart3,
	TrendingUp,
	DollarSign,
	Plus,
	Search,
	Filter,
	Download,
	RefreshCw,
} from "lucide-react";
import AdminApprovalsTable from "@/components/admin/approvals-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCourseModal } from "@/components/admin/create-course-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { adminService } from "@/services/admin.service";


export default function AdminDashboard() {
	const { user } = useEnhancedUser();
	const router = useRouter();
	const [showCreateCourse, setShowCreateCourse] = useState(false);
	const [stats, setStats] = useState({
		totalStudents: 0,
		totalAITeachers: 0,
		activeCourses: 0,
		revenue: 0,
	});
	const [loading, setLoading] = useState(true);
	const [users, setUsers] = useState<any[]>([]);
	const [courses, setCourses] = useState<any[]>([]);
	const [payments, setPayments] = useState<any[]>([]);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			router.push("/");
		} else {
			fetchDashboardData();
		}
	}, [user, router]);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);

			// Fetch stats
			const statsData = await adminService.getPlatformStats();

			setStats({
				totalStudents: statsData.totalStudents,
				totalAITeachers: statsData.totalAITeachers || 0,
				activeCourses: statsData.totalCourses,
				revenue: statsData.revenue || 0,
			});

			// Fetch users
			const usersData = await adminService.getUsers({ limit: 5 });
			setUsers(Array.isArray(usersData.data) ? usersData.data : []);

			// Fetch courses
			const coursesData = await adminService.getCourses({ limit: 5 });
			setCourses(Array.isArray(coursesData.data) ? coursesData.data : []);

			// Fetch payments
			const paymentsData = await adminService.getPayments({ limit: 5 });
			setPayments(Array.isArray(paymentsData.data) ? paymentsData.data : []);

		} catch (error: any) {
			console.error("Error fetching dashboard data:", error);
			toast.error("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	if (!user || user.role !== "admin") {
		return null;
	}

	const handleCourseCreated = () => {
		// Optionally refresh course data or show success message
		// For now, the modal handles the success toast
		fetchDashboardData(); // Refresh stats after creating a course
	};

	const statCards = [
		{
			title: "Total Students",
			value: stats.totalStudents.toString(),
			change: "+12.5%",
			trend: "up",
			icon: Users,
			color: "text-primary",
			bgColor: "bg-primary/10",
		},
		{
			title: "Total AI-TEACHERs",
			value: stats.totalAITeachers.toString(),
			change: "+4.2%",
			trend: "up",
			icon: GraduationCap,
			color: "text-green-600",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Active Courses",
			value: stats.activeCourses.toString(),
			change: "+8.1%",
			trend: "up",
			icon: BookOpen,
			color: "text-purple-600",
			bgColor: "bg-purple-500/10",
		},
		{
			title: "Revenue",
			value: `$${stats.revenue.toLocaleString()}`,
			change: "+23.5%",
			trend: "up",
			icon: DollarSign,
			color: "text-orange-600",
			bgColor: "bg-orange-500/10",
		},
	];

	return (
		<div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
			{/* Sidebar */}
			<aside className="hidden md:block border-r border-border/40">
				<DashboardSidebar navigation={adminNavigation} />
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				<DashboardHeader title="Admin Dashboard" navigation={adminNavigation} />

				<main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
					{/* Header with Create Course Button */}
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
							<p className="text-muted-foreground">
								Manage your platform and monitor key metrics
							</p>
						</div>
						<Button
							onClick={() => setShowCreateCourse(true)}
							className="gap-2"
							size="lg"
						>
							<Plus className="h-5 w-5" />
							Create Course
						</Button>
					</div>

					{/* Stats Grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{statCards.map((stat, index) => (
							<Card key={index} className="border-border/50 shadow-sm hover:shadow-md transition-all hover:bg-accent/5">
								<CardHeader className="flex flex-row items-center justify-between pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										{stat.title}
									</CardTitle>
									<div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
										<stat.icon className={`h-5 w-5 ${stat.color}`} />
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-3xl font-bold tracking-tight">{stat.value}</div>
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
					<Card className="border-border/50 shadow-sm">
						<CardHeader>
							<CardTitle className="text-xl font-semibold">Pending Approvals</CardTitle>
							<CardDescription>
								Review and approve AI-TEACHER and Avatar AI registrations
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminApprovalsTable />
						</CardContent>
					</Card>

					{/* Tabs Section */}
					<Tabs defaultValue="overview" className="space-y-6">
						<TabsList className="bg-muted/50 p-1 border border-border/40">
							<TabsTrigger value="overview">Overview</TabsTrigger>
							<TabsTrigger value="users">Users</TabsTrigger>
							<TabsTrigger value="courses">Courses</TabsTrigger>
							<TabsTrigger value="payments">Payments</TabsTrigger>
						</TabsList>

						<TabsContent value="overview" className="space-y-6">
							<div className="grid gap-6 md:grid-cols-2">
								<Card className="border-border/50 shadow-sm">
									<CardHeader>
										<CardTitle>Enrollment Trends</CardTitle>
										<CardDescription>
											Student enrollment over the last 6 months
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[250px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
											<div className="text-center">
												<BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-20" />
												<span className="text-sm">Chart placeholder</span>
											</div>
										</div>
									</CardContent>
								</Card>

								<Card className="border-border/50 shadow-sm">
									<CardHeader>
										<CardTitle>Revenue Growth</CardTitle>
										<CardDescription>
											Monthly revenue comparison
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="h-[250px] flex items-center justify-center text-muted-foreground bg-accent/5 rounded-lg border border-border/20 border-dashed">
											<div className="text-center">
												<TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-20" />
												<span className="text-sm">Chart placeholder</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</TabsContent>

						<TabsContent value="users" className="space-y-6">
							<Card className="border-border/50 shadow-sm">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>User Management</CardTitle>
											<CardDescription>
												View and manage all platform users
											</CardDescription>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												<Search className="h-4 w-4 mr-2" />
												Search
											</Button>
											<Button variant="outline" size="sm">
												<Filter className="h-4 w-4 mr-2" />
												Filter
											</Button>
											<Button variant="outline" size="sm">
												<Download className="h-4 w-4 mr-2" />
												Export
											</Button>
											<Button variant="outline" size="sm" onClick={fetchDashboardData}>
												<RefreshCw className="h-4 w-4 mr-2" />
												Refresh
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									{loading ? (
										<div className="flex items-center justify-center py-8">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
											<span className="ml-2">Loading users...</span>
										</div>
									) : (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Email</TableHead>
													<TableHead>Role</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Joined</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{Array.isArray(users) && users.map((user: any) => (
													<TableRow key={user.id}>
														<TableCell className="font-medium">{user.name}</TableCell>
														<TableCell>{user.email}</TableCell>
														<TableCell>
															<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
																{user.role}
															</span>
														</TableCell>
														<TableCell>
															<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "approved"
																? "bg-green-100 text-green-800"
																: user.status === "pending"
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-red-100 text-red-800"
																}`}>
																{user.status}
															</span>
														</TableCell>
														<TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
														<TableCell>
															<Button variant="ghost" size="sm">Edit</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="courses" className="space-y-6">
							<Card className="border-border/50 shadow-sm">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Course Management</CardTitle>
											<CardDescription>
												View and manage all courses on the platform
											</CardDescription>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												<Search className="h-4 w-4 mr-2" />
												Search
											</Button>
											<Button variant="outline" size="sm">
												<Filter className="h-4 w-4 mr-2" />
												Filter
											</Button>
											<Button variant="outline" size="sm">
												<Download className="h-4 w-4 mr-2" />
												Export
											</Button>
											<Button variant="outline" size="sm" onClick={fetchDashboardData}>
												<RefreshCw className="h-4 w-4 mr-2" />
												Refresh
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									{loading ? (
										<div className="flex items-center justify-center py-8">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
											<span className="ml-2">Loading courses...</span>
										</div>
									) : (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Title</TableHead>
													<TableHead>Instructor</TableHead>
													<TableHead>Students</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{Array.isArray(courses) && courses.map((course: any) => (
													<TableRow key={course.id}>
														<TableCell className="font-medium">{course.title}</TableCell>
														<TableCell>{course.instructorName || "Unknown"}</TableCell>
														<TableCell>{course.enrollmentCount || 0}</TableCell>
														<TableCell>
															<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.isApproved
																? "bg-green-100 text-green-800"
																: "bg-yellow-100 text-yellow-800"
																}`}>
																{course.isApproved ? "Published" : "Draft"}
															</span>
														</TableCell>
														<TableCell>
															<Button variant="ghost" size="sm">Edit</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									)}
								</CardContent>
							</Card>
						</TabsContent>

						<TabsContent value="payments" className="space-y-6">
							<Card className="border-border/50 shadow-sm">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div>
											<CardTitle>Payment Records</CardTitle>
											<CardDescription>
												View recent payment transactions
											</CardDescription>
										</div>
										<div className="flex gap-2">
											<Button variant="outline" size="sm">
												<Search className="h-4 w-4 mr-2" />
												Search
											</Button>
											<Button variant="outline" size="sm">
												<Filter className="h-4 w-4 mr-2" />
												Filter
											</Button>
											<Button variant="outline" size="sm">
												<Download className="h-4 w-4 mr-2" />
												Export
											</Button>
											<Button variant="outline" size="sm" onClick={fetchDashboardData}>
												<RefreshCw className="h-4 w-4 mr-2" />
												Refresh
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									{loading ? (
										<div className="flex items-center justify-center py-8">
											<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
											<span className="ml-2">Loading payments...</span>
										</div>
									) : (
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>User</TableHead>
													<TableHead>Amount</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{Array.isArray(payments) && payments.map((payment: any) => (
													<TableRow key={payment.id}>
														<TableCell className="font-medium">{payment.userName || "Unknown User"}</TableCell>
														<TableCell>${payment.amount.toFixed(2)}</TableCell>
														<TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
														<TableCell>
															<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${payment.status === "completed"
																? "bg-green-100 text-green-800"
																: "bg-yellow-100 text-yellow-800"
																}`}>
																{payment.status}
															</span>
														</TableCell>
														<TableCell>
															<Button variant="ghost" size="sm">View</Button>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									)}
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>

			{/* Create Course Modal */}
			<CreateCourseModal
				open={showCreateCourse}
				onOpenChange={setShowCreateCourse}
				onSuccess={handleCourseCreated}
			/>
		</div>
	);
}