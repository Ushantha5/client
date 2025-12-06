"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { teacherNavigation } from "@/data/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	BookOpen,
	Users,
	FileText,
	Calendar,
	TrendingUp,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TeacherDashboard() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user || user.role !== "teacher") {
			router.push("/");
		}
	}, [user, router]);

	if (!user || user.role !== "teacher") {
		return null;
	}

	const stats = [
		{
			title: "Active Courses",
			value: "5",
			icon: BookOpen,
			color: "text-blue-600",
			bgColor: "bg-blue-50 dark:bg-blue-950",
		},
		{
			title: "Total Students",
			value: "234",
			icon: Users,
			color: "text-green-600",
			bgColor: "bg-green-50 dark:bg-green-950",
		},
		{
			title: "Pending Assignments",
			value: "12",
			icon: FileText,
			color: "text-orange-600",
			bgColor: "bg-orange-50 dark:bg-orange-950",
		},
		{
			title: "Upcoming Classes",
			value: "8",
			icon: Calendar,
			color: "text-purple-600",
			bgColor: "bg-purple-50 dark:bg-purple-950",
		},
	];

	const myCourses = [
		{
			name: "Web Development Fundamentals",
			students: 45,
			progress: 75,
			status: "active",
		},
		{
			name: "Advanced JavaScript",
			students: 38,
			progress: 60,
			status: "active",
		},
		{
			name: "React & Next.js",
			students: 52,
			progress: 45,
			status: "active",
		},
	];

	const upcomingClasses = [
		{
			course: "Web Development Fundamentals",
			time: "Today, 2:00 PM",
			students: 45,
			duration: "2 hours",
		},
		{
			course: "Advanced JavaScript",
			time: "Tomorrow, 10:00 AM",
			students: 38,
			duration: "1.5 hours",
		},
		{
			course: "React & Next.js",
			time: "Tomorrow, 3:00 PM",
			students: 52,
			duration: "2 hours",
		},
	];

	const recentSubmissions = [
		{
			student: "Alice Johnson",
			assignment: "JavaScript Arrays & Objects",
			submitted: "2 hours ago",
			status: "pending",
		},
		{
			student: "Bob Smith",
			assignment: "React Components",
			submitted: "5 hours ago",
			status: "pending",
		},
		{
			student: "Carol Williams",
			assignment: "CSS Flexbox Layout",
			submitted: "1 day ago",
			status: "graded",
		},
	];

	return (
		<div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
			{/* Sidebar */}
			<aside className="hidden md:block">
				<DashboardSidebar navigation={teacherNavigation} />
			</aside>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				<DashboardHeader
					title="Teacher Dashboard"
					navigation={teacherNavigation}
				/>

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
								</CardContent>
							</Card>
						))}
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* My Courses */}
						<Card>
							<CardHeader>
								<CardTitle>My Courses</CardTitle>
								<CardDescription>
									Track your course progress and student engagement
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{myCourses.map((course, index) => (
									<div key={index} className="space-y-2">
										<div className="flex items-center justify-between">
											<div className="space-y-1">
												<p className="text-sm font-medium">{course.name}</p>
												<p className="text-xs text-muted-foreground">
													{course.students} students
												</p>
											</div>
											<Badge variant="secondary">{course.status}</Badge>
										</div>
										<Progress value={course.progress} className="h-2" />
										<p className="text-xs text-muted-foreground text-right">
											{course.progress}% complete
										</p>
									</div>
								))}
								<Button className="w-full" variant="outline" asChild>
									<Link href="/teacher/courses">View All Courses</Link>
								</Button>
							</CardContent>
						</Card>

						{/* Upcoming Classes */}
						<Card>
							<CardHeader>
								<CardTitle>Upcoming Classes</CardTitle>
								<CardDescription>
									Your scheduled classes for this week
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								{upcomingClasses.map((classItem, index) => (
									<div
										key={index}
										className="flex items-start gap-4 border-b pb-3 last:border-0"
									>
										<div className="p-2 rounded-lg bg-primary/10">
											<Calendar className="h-5 w-5 text-primary" />
										</div>
										<div className="flex-1 space-y-1">
											<p className="font-medium text-sm">{classItem.course}</p>
											<div className="flex items-center gap-4 text-xs text-muted-foreground">
												<span className="flex items-center gap-1">
													<Clock className="h-3 w-3" />
													{classItem.time}
												</span>
												<span className="flex items-center gap-1">
													<Users className="h-3 w-3" />
													{classItem.students} students
												</span>
											</div>
										</div>
									</div>
								))}
								<Button className="w-full" variant="outline" asChild>
									<Link href="/teacher/schedule">View Full Schedule</Link>
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Recent Submissions */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Submissions</CardTitle>
							<CardDescription>
								Latest assignment submissions requiring review
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentSubmissions.map((submission, index) => (
									<div
										key={index}
										className="flex items-center justify-between border-b pb-3 last:border-0"
									>
										<div className="space-y-1">
											<p className="font-medium text-sm">{submission.student}</p>
											<p className="text-sm text-muted-foreground">
												{submission.assignment}
											</p>
										</div>
										<div className="flex items-center gap-3">
											<span className="text-sm text-muted-foreground">
												{submission.submitted}
											</span>
											{submission.status === "pending" ? (
												<Badge variant="outline" className="gap-1">
													<AlertCircle className="h-3 w-3" />
													Pending
												</Badge>
											) : (
												<Badge variant="secondary" className="gap-1">
													<CheckCircle2 className="h-3 w-3" />
													Graded
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
							<Button className="w-full mt-4" variant="outline" asChild>
								<Link href="/teacher/assignments">View All Submissions</Link>
							</Button>
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	);
}
