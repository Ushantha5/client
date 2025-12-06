"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookOpen,
    Clock,
    Edit2,
    GraduationCap,
    Mail,
    MapPin,
    Shield,
    Star,
    Trophy,
    Calendar,
    Users,
    TrendingUp,
    Share2,
    Settings,
    MoreHorizontal,
    Server,
    Activity,
    DollarSign,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-16 w-16 bg-muted rounded-full animate-bounce"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    const isAdmin = user.role === "admin";

    const handleEditProfile = () => {
        toast.info("Edit Profile feature coming soon!", {
            description: "We are currently updating the profile editor."
        });
    };

    const handleShareProfile = () => {
        toast.success("Profile link copied!", {
            description: "You can now share your profile with others."
        });
        // Navigator clipboard mockup
        // navigator.clipboard.writeText(window.location.href);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15
            }
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Navbar />

            {/* Hero Section */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${isAdmin ? "from-slate-900 via-amber-600/80 to-yellow-600/80" : "from-primary/80 via-purple-600/80 to-blue-600/80"} animate-gradient-x blur-md scale-110`}></div>
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
            </div>

            <main className="container max-w-7xl mx-auto px-4 sm:px-6 relative -mt-32 pb-12">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Left Column: Profile Card */}
                    <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
                        <Card className="border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
                            <CardContent className="pt-8 px-6 pb-8 flex flex-col items-center text-center relative">
                                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => toast("Settings opened")}>
                                    <Settings className="h-5 w-5" />
                                </Button>

                                <div className="relative mb-6">
                                    <Avatar className={`h-32 w-32 border-4 border-background shadow-xl ring-4 ${isAdmin ? "ring-amber-500/30" : "ring-primary/20"}`}>
                                        <AvatarImage src={user.avatarUrl} className="object-cover" />
                                        <AvatarFallback className={`text-3xl font-bold ${isAdmin ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"}`}>
                                            {user.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 bg-green-500 h-5 w-5 rounded-full border-4 border-background" title="Online"></div>
                                </div>

                                <h1 className="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    {user.name}
                                </h1>
                                <p className="text-muted-foreground font-medium mb-4 flex items-center gap-2">
                                    {isAdmin ? "System Administrator" : user.role === "teacher" ? "Senior Instructor" : "Enthusiastic Learner"}
                                    {isAdmin && <Shield className="h-4 w-4 text-amber-500 fill-amber-500/20" />}
                                </p>

                                <div className="grid grid-cols-2 gap-3 w-full mb-6">
                                    <Button
                                        className={`w-full ${isAdmin ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20" : "bg-primary hover:bg-primary/90 shadow-primary/20"} shadow-lg`}
                                        onClick={handleEditProfile}
                                    >
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={`w-full ${isAdmin ? "border-amber-500/20 hover:bg-amber-500/5" : "border-primary/20 hover:bg-primary/5"}`}
                                        onClick={handleShareProfile}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                </div>

                                <div className="w-full space-y-4 pt-6 border-t border-border/50">
                                    <div className="flex items-center justify-between text-sm group">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Mail className={`h-4 w-4 ${isAdmin ? "text-amber-500/70 group-hover:text-amber-500" : "text-primary/70 group-hover:text-primary"} transition-colors`} />
                                            Email
                                        </span>
                                        <span className="font-medium truncate max-w-[180px]">{user.email}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm group">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <MapPin className={`h-4 w-4 ${isAdmin ? "text-amber-500/70 group-hover:text-amber-500" : "text-primary/70 group-hover:text-primary"} transition-colors`} />
                                            Location
                                        </span>
                                        <span className="font-medium">San Francisco, CA</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm group">
                                        <span className="text-muted-foreground flex items-center gap-2">
                                            <Calendar className={`h-4 w-4 ${isAdmin ? "text-amber-500/70 group-hover:text-amber-500" : "text-primary/70 group-hover:text-primary"} transition-colors`} />
                                            Joined
                                        </span>
                                        <span className="font-medium">Nov 2023</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Achievements / Status Mini Card */}
                        <Card className="border-border/50 shadow-lg bg-card/60 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    {isAdmin ? <Server className="h-4 w-4 text-emerald-500" /> : <Trophy className="h-4 w-4 text-yellow-500" />}
                                    {isAdmin ? "System Status" : "Top Achievements"}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isAdmin ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Server Load</span>
                                            <span className="text-emerald-500 font-medium">12%</span>
                                        </div>
                                        <Progress value={12} className="h-1.5 bg-emerald-500/10" />
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Database</span>
                                            <span className="text-emerald-500 font-medium">Healthy</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline" className="py-1 px-3 bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20 transition-colors cursor-default">
                                            Early Adopter
                                        </Badge>
                                        <Badge variant="outline" className="py-1 px-3 bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 transition-colors cursor-default">
                                            Top Rated
                                        </Badge>
                                        <Badge variant="outline" className="py-1 px-3 bg-purple-500/10 text-purple-600 border-purple-500/20 hover:bg-purple-500/20 transition-colors cursor-default">
                                            Mentor
                                        </Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Content */}
                    <motion.div variants={itemVariants} className="lg:col-span-8 space-y-6">

                        {/* Stats Overview */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {isAdmin ? [
                                { label: "Total Users", value: "24.5k", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { label: "Revenue", value: "$1.2M", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { label: "Active Now", value: "342", icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" },
                                { label: "Issues", value: "3", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                        <div className={`p-3 rounded-2xl mb-3 ${stat.bg}`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground font-medium mt-1">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : [
                                { label: "Students", value: "1,204", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { label: "Courses", value: "12", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
                                { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                                { label: "Reviews", value: "850+", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                        <div className={`p-3 rounded-2xl mb-3 ${stat.bg}`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground font-medium mt-1">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Main Tabs */}
                        <Tabs defaultValue={isAdmin ? "system" : "overview"} className="w-full">
                            <div className="flex items-center justify-between mb-6">
                                <TabsList className="bg-muted/50 p-1 border border-border/50 backdrop-blur-sm">
                                    {isAdmin ? (
                                        <>
                                            <TabsTrigger value="system" className="px-6">System</TabsTrigger>
                                            <TabsTrigger value="users" className="px-6">Users</TabsTrigger>
                                            <TabsTrigger value="audit" className="px-6">Audit Log</TabsTrigger>
                                        </>
                                    ) : (
                                        <>
                                            <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
                                            <TabsTrigger value="courses" className="px-6">Courses</TabsTrigger>
                                            <TabsTrigger value="reviews" className="px-6">Reviews</TabsTrigger>
                                        </>
                                    )}
                                </TabsList>
                                <Button variant="ghost" size="sm" className="hidden sm:flex text-muted-foreground">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>

                            {isAdmin ? (
                                /* ADMIN TABS */
                                <>
                                    <TabsContent value="system" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <Card className="border-border/50 shadow-sm">
                                            <CardHeader>
                                                <CardTitle>System Health</CardTitle>
                                                <CardDescription>Real-time performance metrics</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>CPU Usage</span>
                                                        <span className="text-muted-foreground">45%</span>
                                                    </div>
                                                    <Progress value={45} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Memory Usage</span>
                                                        <span className="text-muted-foreground">62%</span>
                                                    </div>
                                                    <Progress value={62} className="h-2" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Storage</span>
                                                        <span className="text-muted-foreground">28%</span>
                                                    </div>
                                                    <Progress value={28} className="h-2" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                    <TabsContent value="users" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <Card className="border-border/50 shadow-sm">
                                            <CardHeader>
                                                <CardTitle>Recent Registrations</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-9 w-9">
                                                                    <AvatarFallback>U{i}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="text-sm font-medium">New User {i}</p>
                                                                    <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs">Student</Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </>
                            ) : (
                                /* TEACHER/STUDENT TABS */
                                <>
                                    <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <Card className="border-border/50 shadow-sm">
                                            <CardHeader>
                                                <CardTitle>Biography</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <p className="text-muted-foreground leading-relaxed">
                                                    Passionate educator and technologist with over 10 years of experience in Full Stack Development.
                                                    Dedicated to empowering the next generation of developers through interactive learning and real-world projects.
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-border/50 shadow-sm">
                                            <CardHeader>
                                                <CardTitle>Skills</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {["React", "Next.js", "TypeScript", "Node.js"].map((skill) => (
                                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="courses" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <Card key={i} className="group border-border/50 overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                                                    <div className="h-32 bg-secondary/30 relative overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                        <div className="absolute bottom-3 left-4 text-white font-bold text-lg">
                                                            Course {i}
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                            <span>1.2k Students</span>
                                                            <span className="flex items-center gap-1 text-yellow-500"><Star className="h-3 w-3 fill-current" /> 4.9</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="reviews" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                                        <div className="space-y-4">
                                            {[1, 2].map((i) => (
                                                <Card key={i} className="border-border/50">
                                                    <CardContent className="p-5">
                                                        <p className="text-sm text-muted-foreground">"Great course!"</p>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </TabsContent>
                                </>
                            )}
                        </Tabs>
                    </motion.div>
                </motion.div>
            </main>
        </div>
    );
}
