"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { enrollmentService, Enrollment } from "@/services/enrollment.service";
import { CourseCard } from "@/components/dashboard/course-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentCoursesPage() {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await enrollmentService.getMyEnrollments({ limit: 50 });
                setEnrollments(response.data || []);
            } catch (error) {
                console.error("Failed to fetch enrollments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter(enrollment => {
        const matchesSearch = enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const activeCount = enrollments.filter(e => e.status === 'active').length;
    const completedCount = enrollments.filter(e => e.status === 'completed').length;

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">
                        My Learning
                    </h1>
                    <p className="text-muted-foreground">
                        Track your progress and continue your education journey.
                    </p>
                </div>

                {/* Stats and Filter Bar */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Active</p>
                                <p className="text-xl font-bold">{activeCount}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Completed</p>
                                <p className="text-xl font-bold">{completedCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex-1 flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Search my courses..."
                                className="pl-10 bg-white/5 border-white/10 focus:border-primary/50"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                            <Button
                                variant={filterStatus === 'all' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilterStatus('all')}
                                className="h-8"
                            >
                                All
                            </Button>
                            <Button
                                variant={filterStatus === 'active' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilterStatus('active')}
                                className="h-8"
                            >
                                Active
                            </Button>
                            <Button
                                variant={filterStatus === 'completed' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setFilterStatus('completed')}
                                className="h-8"
                            >
                                Completed
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-muted-foreground">Loading your courses...</p>
                        </div>
                    </div>
                ) : filteredEnrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredEnrollments.map((enrollment, index) => (
                            <motion.div
                                key={enrollment._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <CourseCard
                                    title={enrollment.course.title}
                                    progress={enrollment.progress}
                                    iconPath={enrollment.course.thumbnail}
                                    className="h-full"
                                />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/5 border-dashed">
                        <div className="max-w-md mx-auto">
                            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No courses found</h3>
                            <p className="text-muted-foreground mb-6">
                                {searchQuery
                                    ? "Try adjusting your search terms."
                                    : "You haven't enrolled in any courses yet."}
                            </p>
                            {!searchQuery && (
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                    Browse Library
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
