"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from "react";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { Navbar } from "@/components/layout/navbar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  Calendar,
  Clock,
  Trophy,
  Target,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Star,
  Award,
  Zap,
  Users,
  MessageSquare,
  CheckCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { studentNavigation } from "@/data/navigation";
import { enrollmentService } from "@/services/enrollment.service";


// Types
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: "positive" | "negative";
  isLoading?: boolean;
}



interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  thumbnail?: string;
  instructor: string;
  nextLesson?: string;
  category?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  type: "class" | "assignment" | "exam" | "meeting";
  course?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
}


// Components
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, changeType, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-300 group"
      role="region"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {change && (
            <p className={`text-xs mt-1 flex items-center ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
              {changeType === "positive" ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-colors">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const CourseProgressCard: React.FC<CourseProgress> = ({
  title,
  progress,
  thumbnail,
  instructor,
  nextLesson,
  category
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5 }}
    className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
    role="article"
    aria-label={`Course: ${title}`}
  >
    <div className="relative h-32">
      {thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover"
          width={300}
          height={128}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-primary/50" aria-hidden="true" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-bold text-white truncate">{title}</h3>
        <p className="text-xs text-white/80 truncate">{instructor}</p>
        {category && (
          <Badge className="mt-1 text-xs" variant="secondary">
            {category}
          </Badge>
        )}
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-bold text-primary">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2 mb-3" aria-label={`Progress: ${progress}%`} />
      {nextLesson && (
        <div className="flex items-center text-xs text-muted-foreground">
          <span className="truncate">Next: {nextLesson}</span>
          <ChevronRight className="w-4 h-4 ml-auto" aria-hidden="true" />
        </div>
      )}
      <Button className="w-full mt-3" size="sm" asChild>
        <Link href={`/course/${title.toLowerCase().replace(/\s+/g, '-')}`}>Continue Learning</Link>
      </Button>
    </div>
  </motion.div>
);

const UpcomingEventCard: React.FC<UpcomingEvent> = ({ title, time, date, type, course }) => {
  const getIcon = () => {
    switch (type) {
      case "class": return <Users className="w-4 h-4" />;
      case "assignment": return <Target className="w-4 h-4" />;
      case "exam": return <Award className="w-4 h-4" />;
      case "meeting": return <MessageSquare className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "class": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "assignment": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "exam": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "meeting": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getTypeLabel = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors border border-border" role="listitem">
      <div className={`p-2 rounded-lg border ${getTypeColor()}`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm truncate">{title}</p>
          <Badge className="text-xs" variant="outline">
            {getTypeLabel()}
          </Badge>
        </div>
        {course && (
          <p className="text-xs text-muted-foreground truncate">{course}</p>
        )}
        <p className="text-xs text-muted-foreground">{date} at {time}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">View details</span>
      </Button>
    </div>
  );
};

const AchievementCard: React.FC<Achievement> = ({ title, description, icon, earned }) => (
  <div
    className={`p-4 rounded-xl border transition-all ${earned ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`}
    role="region"
    aria-label={`${title}: ${earned ? 'Earned' : 'Not earned'}`}
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm flex items-center gap-2">
          {title}
          {earned && (
            <CheckCircle className="w-4 h-4 text-green-500" aria-label="Achievement earned" />
          )}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  </div>
);



export default function StudentPortal() {
  const { user } = useEnhancedUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  const [stats, setStats] = useState([
    { title: "Active Courses", value: "0", icon: <BookOpen className="w-5 h-5" />, change: "", changeType: "positive" as const },
    { title: "Learning Hours", value: "0h", icon: <Clock className="w-5 h-5" />, change: "", changeType: "positive" as const },
    { title: "Completion Rate", value: "0%", icon: <Trophy className="w-5 h-5" />, change: "", changeType: "positive" as const },
    { title: "Current Streak", value: "0 days", icon: <Zap className="w-5 h-5" />, change: "", changeType: "positive" as const },
  ]);

  const [courses, setCourses] = useState<CourseProgress[]>([
    {
      id: "1",
      title: "Introduction to Web Development",
      progress: 25,
      thumbnail: "/images/course-web.jpg",
      instructor: "Alex Johnson",
      nextLesson: "HTML Basics",
      category: "Beginner"
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      progress: 65,
      thumbnail: "/images/course-react.jpg",
      instructor: "Sarah Chen",
      nextLesson: "Higher Order Components",
      category: "Intermediate"
    }
  ]);

  const [events] = useState<UpcomingEvent[]>([
    {
      id: "1",
      title: "Live Session: Advanced Hooks",
      time: "10:00 AM",
      date: "Tomorrow",
      type: "class",
      course: "Advanced React Patterns"
    },
    {
      id: "2",
      title: "Assignment Due: Redux Patterns",
      time: "11:59 PM",
      date: "Dec 22",
      type: "assignment",
      course: "Advanced React Patterns"
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "Quick Learner",
      description: "Complete 5 lessons in one day",
      icon: <Zap className="w-4 h-4" />,
      earned: true
    },
    {
      id: "2",
      title: "Perfect Score",
      description: "Score 100% on an assignment",
      icon: <Star className="w-4 h-4" />,
      earned: true
    },
    {
      id: "3",
      title: "Early Bird",
      description: "Join a class before it starts",
      icon: <Clock className="w-4 h-4" />,
      earned: false
    }
  ]);



  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await enrollmentService.getMyEnrollments({ limit: 10 });
        const fetchedEnrollments = response.data || [];

        // Map enrollments to CourseProgress format
        const mappedCourses: CourseProgress[] = fetchedEnrollments.map(enrollment => ({
          id: enrollment.course._id,
          title: enrollment.course.title,
          progress: enrollment.progress,
          thumbnail: enrollment.course.thumbnail,
          instructor: enrollment.course.teacher.name,
          nextLesson: "Continue Lesson",
          category: enrollment.course.level
        }));

        if (mappedCourses.length > 0) {
          setCourses(mappedCourses);
        }
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate fetching stats
    const fetchStats = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats([
        { title: "Active Courses", value: "4", icon: <BookOpen className="w-5 h-5" />, change: "+1 this month", changeType: "positive" as const },
        { title: "Learning Hours", value: "28.5h", icon: <Clock className="w-5 h-5" />, change: "+15%", changeType: "positive" as const },
        { title: "Completion Rate", value: "82%", icon: <Trophy className="w-5 h-5" />, change: "+4%", changeType: "positive" as const },
        { title: "Current Streak", value: "9 days", icon: <Zap className="w-5 h-5" />, change: "Keep it up!", changeType: "positive" as const },
      ]);
    };

    if (user) {
      fetchEnrollments();
      fetchStats();
    }
  }, [user]);

  // Handle keyboard navigation for sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-background flex flex-col" role="main">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-primary focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            role="button"
            aria-label="Close sidebar"
            tabIndex={0}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 flex flex-col`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">Learning Portal</h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <DashboardSidebar navigation={studentNavigation} />
        </div>
        <div className="p-4 border-t border-border text-xs text-muted-foreground">
          Welcome back, {user?.name?.split(' ')[0] || 'Student'}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-0">
        <Navbar />

        {/* Mobile menu button */}
        <div className="md:hidden p-4 border-b border-border sticky top-0 bg-background z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="mr-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold inline-block">Dashboard</h1>
        </div>

        <main id="main-content" className="flex-1 container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Student'}!</h1>
              <p className="text-muted-foreground mt-1">Ready to continue your learning journey?</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/courses">
                  <Search className="w-4 h-4 mr-2" />
                  <span>Browse Courses</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  <span>Notifications</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Dynamic Weather Dashboard
          <div className="mb-8">
            <DynamicWeatherDashboard />
          </div>
          */}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Courses and Progress */}
            <div className="lg:col-span-2 space-y-6">
              {/* Continue Learning */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Continue Learning
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/student/courses">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                          <Skeleton className="h-32 w-full" />
                          <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                            <Skeleton className="h-2 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {courses.map((course) => (
                        <CourseProgressCard key={course.id} {...course} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-1">No active courses</h3>
                      <p className="text-sm text-muted-foreground mb-4">Start learning by enrolling in a course</p>
                      <Button asChild>
                        <Link href="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Achievements
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/student/achievements">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <AchievementCard key={achievement.id} {...achievement} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Upcoming Events and Quick Actions */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Upcoming
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/student/schedule">
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.map((event) => (
                      <UpcomingEventCard key={event.id} {...event} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-16 flex flex-col gap-1" asChild>
                    <Link href="/student/courses">
                      <BookOpen className="w-5 h-5" />
                      <span className="text-xs">My Courses</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1" asChild>
                    <Link href="/student/assignments">
                      <Target className="w-5 h-5" />
                      <span className="text-xs">Assignments</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1" asChild>
                    <Link href="/student/grades">
                      <Trophy className="w-5 h-5" />
                      <span className="text-xs">Grades</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col gap-1 hover:border-primary/50 transition-colors" asChild>
                    <Link href="/apps/avatar-creator">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="text-xs">Avatar Studio</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Learning Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Learning Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Focus Areas</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">JavaScript & React</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Consistency</span>
                        <span className="font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">7-day streak maintained</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}