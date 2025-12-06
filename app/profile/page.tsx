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
import {
    Activity,
    BookOpen,
    Clock,
    Edit2,
    GraduationCap,
    Mail,
    MapPin,
    Shield,
    Star,
    Trophy,
} from "lucide-react";

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="container max-w-6xl mx-auto px-4 py-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Left Column - Profile Info */}
                    <motion.div variants={item} className="space-y-6">
                        <Card className="border-0 shadow-lg overflow-hidden relative">
                            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500"></div>
                            <CardContent className="pt-0 relative">
                                <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-950 absolute -top-12 left-6">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback className="text-xl bg-slate-100 dark:bg-slate-800">
                                        {user.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="mt-14 mb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold">{user.name}</h2>
                                            <p className="text-muted-foreground">{user.email}</p>
                                        </div>
                                        <Button size="icon" variant="ghost">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="capitalize">
                                            {user.role}
                                        </Badge>
                                        {user.isActive && (
                                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mt-6 pt-6 border-t">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4 mr-3" />
                                        {user.email}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Shield className="h-4 w-4 mr-3" />
                                        ID: {user._id?.slice(-8).toUpperCase()}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 mr-3" />
                                        Columbo, Sri Lanka
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Level / XP Card */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                                    Current Level
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-bold text-blue-600">12</span>
                                    <span className="text-sm text-muted-foreground mb-1">/ 50</span>
                                </div>
                                <Progress value={35} className="h-2 mb-2" />
                                <p className="text-xs text-muted-foreground">
                                    2,450 XP needed for Level 13
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column - Stats & Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Courses", value: "4", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { label: "Hours", value: "128", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
                                { label: "Score", value: "98%", icon: Star, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                                { label: "Awards", value: "7", icon: Trophy, color: "text-purple-500", bg: "bg-purple-500/10" },
                            ].map((stat, i) => (
                                <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                        <div className={`p-3 rounded-full mb-3 ${stat.bg}`}>
                                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                        </div>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <div className="text-xs text-muted-foreground uppercase font-medium mt-1">
                                            {stat.label}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div variants={item}>
                            <Card className="border-0 shadow-md h-full">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-blue-600" />
                                        Recent Activity
                                    </CardTitle>
                                    <CardDescription>Your latest actions and achievements</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                        {[
                                            { title: "Completed React Basics", time: "2 hours ago", type: "course" },
                                            { title: "Earned 'Fast Learner' Badge", time: "Yesterday", type: "award" },
                                            { title: "Joined 'Advanced AI' Course", time: "3 days ago", type: "course" },
                                        ].map((act, i) => (
                                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                    {act.type === "award" ? (
                                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                                    ) : (
                                                        <GraduationCap className="w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded bg-white border shadow-sm">
                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                        <div className="font-bold text-slate-900">{act.title}</div>
                                                        <time className="font-caveat font-medium text-indigo-500 text-xs">{act.time}</time>
                                                    </div>
                                                    <div className="text-slate-500 text-sm">
                                                        Continue your progress to unlock more achievements!
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
