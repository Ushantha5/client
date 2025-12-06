"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
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

export default function StudentDashboard() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!user || user.role !== "student") {
			router.push("/");
		}
	}, [user, router]);

	if (!user || user.role !== "student") {
		return null;
	}

	const stats = [
		{
			title: "Enrolled Courses",
			value: "6",
			icon: BookOpen,
			color: "text-blue-600",
			bgColor: "bg-blue-500/10",
		},
		{
			title: "Completed Assignments",
			value: "24",
			icon: CheckCircle2,
			color: "text-green-600",
			bgColor: "bg-green-500/10",
		},
		{
			title: "Average Grade",
			value: "87%",
			icon: Award,
			color: "text-purple-600",
			bgColor: "bg-purple-500/10",
		},
		{
			title: "Upcoming Classes",
			value: "5",
			icon: Calendar,
			color: "text-orange-600",
			bgColor: "bg-orange-500/10",
		},
	];

	const enrolledCourses = [
		{
			name: "Web Development Fundamentals",
			instructor: "Dr. Sarah Johnson",
			progress: 75,
			nextLesson: "JavaScript Arrays",
			status: "in-progress",
		},
		{
			name: "Data Science with Python",
			instructor: "Prof. Michael Chen",
			progress: 45,
			nextLesson: "Pandas DataFrames",
			status: "in-progress",
		},
		{
			name: "Mobile App Development",
			instructor: "Dr. Emily Brown",
			progress: 30,
			nextLesson: "React Native Basics",
			status: "in-progress",
		},
	];

	const upcomingAssignments = [
		{
			title: "JavaScript Functions Assignment",
			course: "Web Development",
			dueDate: "Tomorrow",
			status: "pending",
			priority: "high",
		},
		{
			title: "Data Analysis Project",
			course: "Data Science",
			dueDate: "In 3 days",
			status: "in-progress",
			priority: "medium",
		},
		{
			title: "UI Design Mockup",
			course: "Mobile Development",
			dueDate: "In 5 days",
			status: "not-started",
			priority: "low",
		},
	];

	const recentGrades = [
		{
			assignment: "HTML & CSS Quiz",
			course: "Web Development",
			grade: "95%",
			status: "excellent",
		},
		{
			assignment: "Python Basics Test",
			course: "Data Science",
			grade: "88%",
			status: "good",
		},
		{
			assignment: "React Components",
			course: "Mobile Development",
			grade: "82%",
			status: "good",
		},
	];

	const upcomingClasses = [
		{
			course: "Web Development Fundamentals",
			time: "Today, 2:00 PM",
			instructor: "Dr. Sarah Johnson",
			duration: "2 hours",
		},
		{
			course: "Data Science with Python",
			time: "Tomorrow, 10:00 AM",
			instructor: "Prof. Michael Chen",
			duration: "1.5 hours",
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

				<main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
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
								{enrolledCourses.map((course, index) => (
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
										<Button size="sm" className="w-full gap-2 mt-2" variant="outline">
											<PlayCircle className="h-4 w-4" />
											Continue Learning
										</Button>
									</div>
								))}
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
		</div>
	);
}
