"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { DynamicWeatherDashboard } from "@/components/dashboard/dynamic-weather-dashboard";
import { AICoach } from "@/components/dashboard/ai-coach";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { studentNavigation } from "@/data/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BookOpen,
	FileText,
	Award,
	Calendar,
	TrendingUp,
	Clock,
	CheckCircle2,
	PlayCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { enrollmentService } from "@/services/enrollment.service";
import { toast } from "sonner";

export default function StudentDashboard() {
	const { user } = useEnhancedUser();
	const router = useRouter();
	const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user && user.role !== "student") {
			router.push("/");
		} else if (user) {
			fetchStudentData();
		}
	}, [user, router]);

	const fetchStudentData = async () => {
		try {
			// Fetch student enrollments
			const enrollmentResponse = await enrollmentService.getMyEnrollments();

			// Transform enrollment data to match the existing structure
			const transformedEnrollments = enrollmentResponse.data.map((enrollment: any) => ({
				name: enrollment.course.title,
				instructor: enrollment.course.teacher.name,
				progress: enrollment.progress,
				nextLesson: "Continue Learning", // This would need to be fetched from lessons API
				status: enrollment.status,
				id: enrollment._id,
				courseId: enrollment.course._id
			}));

			setEnrolledCourses(transformedEnrollments);
		} catch (error) {
			console.error("Failed to fetch student data:", error);
			toast.error("Failed to load dashboard data");
		} finally {
			setLoading(false);
		}
	};

	if (!user) {
		return null; // Or a loading spinner
	}

	// Calculate stats based on real data
	const stats = [
		{
			title: "Enrolled Courses",
			value: enrolledCourses.length.toString(),
			icon: BookOpen,
			color: "text-blue-600",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Completed Assignments",
			value: "0", // This would need to be fetched from assignments API
			icon: CheckCircle2,
			color: "text-green-600",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Average Grade",
			value: "0%", // This would need to be calculated from grades API
			icon: Award,
			color: "text-purple-600",
			bgColor: "bg-purple-500/10",
		},
		{
			title: "Upcoming Classes",
			value: "0", // This would need to be fetched from schedule API
			icon: Calendar,
			color: "text-orange-600",
			bgColor: "bg-orange-500/10",
		},
	];

	const upcomingAssignments = [
		{
			title: "Complete your profile",
			course: "Getting Started",
			dueDate: "Whenever you're ready",
			status: "pending",
			priority: "low",
		},
	];

	const recentGrades = [
		{
			assignment: "Welcome to MR5 School",
			course: "Getting Started",
			grade: "100%",
			status: "excellent",
		},
	];

	const upcomingClasses = [
		{
			course: "Getting Started",
			time: "Anytime",
			instructor: "MR5 Team",
			duration: "Self-paced",
		},
	];

	return (
		<div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
			{/* Sidebar */}
			<aside className="hidden md:block border-r border-border/40">
				<DashboardSidebar navigation={studentNavigation} />
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				<DashboardHeader
					title="Student Dashboard"
					navigation={studentNavigation}
				/>

				<main className="flex-1 p-4 md:p-6 space-y-8 max-w-7xl mx-auto w-full relative">
					{/* Weather Dashboard - Added as per request */}
					<div className="w-full">
						<DynamicWeatherDashboard />
					</div>

					{/* Stats Grid */}
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
						{stats.map((stat, index) => (
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
								</CardContent>
							</Card>
						))}
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Enrolled Courses */}
						<Card className="border-border/50 shadow-sm">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">My Courses</CardTitle>
								<CardDescription>
									Continue learning from where you left off
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{loading ? (
									<div className="flex items-center justify-center h-32">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
									</div>
								) : enrolledCourses.length > 0 ? (
									enrolledCourses.map((course, index) => (
										<div key={index} className="space-y-2">
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<p className="text-sm font-medium">{course.name}</p>
													<p className="text-xs text-muted-foreground">
														{course.instructor}
													</p>
												</div>
												<Badge variant="secondary" className="font-normal">{course.status}</Badge>
											</div>
											<Progress value={course.progress} className="h-2" />
											<div className="flex items-center justify-between text-xs">
												<span className="text-muted-foreground">
													Next: {course.nextLesson}
												</span>
												<span className="font-medium">{course.progress}%</span>
											</div>
											<Button size="sm" className="w-full gap-2 mt-2" variant="outline" asChild>
												<Link href={`/course/${course.courseId}`}>
													<PlayCircle className="h-4 w-4" />
													Continue Learning
												</Link>
											</Button>
										</div>
									))
								) : (
									<div className="text-center py-8">
										<BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
										<h3 className="mt-4 text-lg font-medium">No enrolled courses</h3>
										<p className="mt-2 text-sm text-muted-foreground">
											You haven&apos;t enrolled in any courses yet.
										</p>
										<Button className="mt-4" asChild>
											<Link href="/courses">Browse Courses</Link>
										</Button>
									</div>
								)}
								<Button className="w-full mt-2" variant="outline" asChild>
									<Link href="/student/courses">View All Courses</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Upcoming Assignments */}
						<Card className="border-border/50 shadow-sm">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">Upcoming Assignments</CardTitle>
								<CardDescription>
									Stay on track with your deadlines
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{upcomingAssignments.map((assignment, index) => (
									<div
										key={index}
										className="flex items-start gap-4 border-b border-border/40 pb-4 last:border-0 last:pb-0"
									>
										<div className="p-2.5 rounded-lg bg-primary/10">
											<FileText className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="font-medium text-sm">{assignment.title}</p>
											<p className="text-xs text-muted-foreground">
												{assignment.course}
											</p>
											<div className="flex items-center gap-2">
												<Badge
													variant={
														assignment.priority === "high"
															? "destructive"
															: "secondary"
													}
													className="text-xs font-normal"
												>
													{assignment.priority}
												</Badge>
												<span className="text-xs text-muted-foreground">
													Due {assignment.dueDate}
												</span>
											</div>
										</div>
									</div>
								))}
								<Button className="w-full mt-2" variant="outline" asChild>
									<Link href="/student/assignments">View All Assignments</Link>
								</Button>
							</CardContent>
						</Card>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Recent Grades */}
						<Card className="border-border/50 shadow-sm">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">Recent Grades</CardTitle>
								<CardDescription>
									Your latest assignment results
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{recentGrades.map((grade, index) => (
									<div
										key={index}
										className="flex items-center justify-between border-b border-border/40 pb-4 last:border-0 last:pb-0"
									>
										<div className="space-y-1">
											<p className="font-medium text-sm">{grade.assignment}</p>
											<p className="text-xs text-muted-foreground">
												{grade.course}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<span className="text-2xl font-bold text-green-600">
												{grade.grade}
											</span>
											<TrendingUp className="h-4 w-4 text-green-600" />
										</div>
									</div>
								))}
								<Button className="w-full mt-2" variant="outline" asChild>
									<Link href="/student/grades">View All Grades</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Upcoming Classes */}
						<Card className="border-border/50 shadow-sm">
							<CardHeader>
								<CardTitle className="text-xl font-semibold">Upcoming Classes</CardTitle>
								<CardDescription>
									Your scheduled classes for today and tomorrow
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								{upcomingClasses.map((classItem, index) => (
									<div
										key={index}
										className="flex items-start gap-4 border-b border-border/40 pb-4 last:border-0 last:pb-0"
									>
										<div className="p-2.5 rounded-lg bg-primary/10">
											<Calendar className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="font-medium text-sm">{classItem.course}</p>
											<p className="text-xs text-muted-foreground">
												{classItem.instructor}
											</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{classItem.time}
												</span>
												<span>{classItem.duration}</span>
											</div>
										</div>
									</div>
								))}
								<Button className="w-full mt-2" variant="outline" asChild>
									<Link href="/student/schedule">View Full Schedule</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</main>
			</div>
			{/* AI Coach - Fixed Position for persistent access */}
			<AICoach />
		</div>
	);
}