"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { lessonService, Lesson } from "@/services/lesson.service";
import { courseService, Course } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    ChevronLeft,
    ChevronRight,
    PlayCircle,
    Menu,
    Bot,
    Video,
    BookOpen,
    Clock
} from "lucide-react";
import { TeachingAIModal } from "@/components/ai/TeachingAIModal";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LessonPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const lessonId = params.lessonId as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // AI Tutor State
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const voiceInteraction = useVoiceInteraction();

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Fetch course details
                const courseRes = await courseService.getCourseById(courseId);
                setCourse(courseRes.data);

                // Fetch all lessons for syllabus
                const lessonsRes = await lessonService.getLessons({ course: courseId, limit: 100 });
                // Sort by order
                const sortedLessons = (lessonsRes.data || []).sort((a, b) => a.order - b.order);
                setLessons(sortedLessons);

                // Fetch current lesson
                if (lessonId === 'start' && sortedLessons.length > 0) {
                    router.replace(`/course/${courseId}/lesson/${sortedLessons[0]._id}`);
                    return;
                }

                if (lessonId && lessonId !== 'start') {
                    const lessonRes = await lessonService.getLessonById(lessonId);
                    setCurrentLesson(lessonRes.data);
                } else if (sortedLessons.length > 0) {
                    // Fallback if somehow we got here without a valid ID (though route param is required)
                    router.replace(`/course/${courseId}/lesson/${sortedLessons[0]._id}`);
                }

            } catch (error) {
                console.error("Failed to load lesson data", error);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            loadData();
        }
    }, [courseId, lessonId, router]);

    const handleLessonChange = (newLessonId: string) => {
        router.push(`/course/${courseId}/lesson/${newLessonId}`);
    };

    const currentLessonIndex = lessons.findIndex(l => l._id === lessonId);
    const prevLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
    const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading lesson content...</p>
                </div>
            </div>
        );
    }

    if (!course || !currentLesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                    <p className="text-xl font-bold mb-4">Lesson not found</p>
                    <Link href={`/courses`}>
                        <Button>Back to Courses</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="h-16 border-b border-white/5 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/student/courses" className="text-muted-foreground hover:text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <Separator orientation="vertical" className="h-6 bg-white/10" />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            CR
                        </div>
                        <div>
                            <h1 className="text-sm font-bold leading-none mb-1 max-w-[200px] truncate">{course.title}</h1>
                            <p className="text-xs text-muted-foreground">Lesson {currentLessonIndex + 1} of {lessons.length}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="hidden md:flex text-muted-foreground hover:text-white"
                    >
                        <Menu className="w-4 h-4 mr-2" />
                        {sidebarOpen ? "Hide Syllabus" : "Show Syllabus"}
                    </Button>
                    <Button
                        className="bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                        onClick={() => setAiModalOpen(true)}
                    >
                        <Bot className="w-4 h-4 mr-2" />
                        AI Tutor
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        {/* Video Player Placeholder */}
                        <div className="aspect-video bg-black rounded-xl border border-white/10 shadow-2xl mb-8 relative group overflow-hidden">
                            {currentLesson.videoUrl ? (
                                <iframe
                                    src={currentLesson.videoUrl.replace("watch?v=", "embed/")}
                                    className="w-full h-full"
                                    allowFullScreen
                                    title={currentLesson.title}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors cursor-pointer">
                                            <PlayCircle className="w-8 h-8 text-primary" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">Video content placeholder</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Lesson Title & Navigation */}
                        <div className="flex items-start justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent mb-2">
                                    {currentLesson.title}
                                </h2>
                                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                                    <Clock className="w-4 h-4" />
                                    {currentLesson.duration || 15} mins
                                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                                    Last updated {new Date(currentLesson.updatedAt).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <Button
                                    variant="outline"
                                    disabled={!prevLesson}
                                    onClick={() => prevLesson && handleLessonChange(prevLesson._id)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" />
                                    Prev
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-white"
                                    disabled={!nextLesson}
                                    onClick={() => nextLesson && handleLessonChange(nextLesson._id)}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <Separator className="bg-white/5 mb-8" />

                        {/* Text Content */}
                        <div className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10">
                            {/* Simulate markdown content rendering */}
                            {currentLesson.content ? (
                                <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                            ) : (
                                <div className="space-y-4 text-gray-400">
                                    <p>
                                        Welcome to this lesson on <strong>{currentLesson.title}</strong>. In this module, we will explore the fundamental concepts and practical applications relevant to this topic.
                                    </p>
                                    <h3>Learning Objectives</h3>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Understand the core principles of {course.title}</li>
                                        <li>Apply theoretical knowledge to real-world scenarios</li>
                                        <li>Complete the practical exercises attached to this lesson</li>
                                    </ul>
                                    <p>
                                        Please ensure you watch the entire video and read through the supplementary materials provided below before attempting the quiz.
                                    </p>
                                    <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 my-6">
                                        <p className="text-blue-200 font-medium m-0">Pro Tip:</p>
                                        <p className="text-blue-300 text-sm m-0 mt-1">
                                            Use the AI Tutor button in the top right if you get stuck or need clarification on any specific concept!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Sidebar (Syllabus) */}
                <AnimatePresence initial={false}>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-surface border-l border-white/5 flex flex-col shrink-0"
                        >
                            <div className="p-4 border-b border-white/5">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    Course Content
                                </h3>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-4 space-y-2">
                                    {lessons.map((lesson, index) => {
                                        const isActive = lesson._id === currentLesson._id;
                                        return (
                                            <div
                                                key={lesson._id}
                                                onClick={() => handleLessonChange(lesson._id)}
                                                className={cn(
                                                    "p-3 rounded-lg cursor-pointer transition-all duration-200 border",
                                                    isActive
                                                        ? "bg-primary/10 border-primary/20"
                                                        : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                                                )}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={cn(
                                                        "mt-1 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px]",
                                                        isActive
                                                            ? "bg-primary border-primary text-white"
                                                            : "border-white/20 text-muted-foreground"
                                                    )}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className={cn(
                                                            "text-sm font-medium mb-1 line-clamp-2",
                                                            isActive ? "text-primary" : "text-gray-300"
                                                        )}>
                                                            {lesson.title}
                                                        </h4>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Video className="w-3 h-3" />
                                                                {lesson.duration || 15}m
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            {/* AI Tutor Modal */}
            <TeachingAIModal
                isOpen={aiModalOpen}
                onClose={() => setAiModalOpen(false)}
                voiceInteraction={voiceInteraction}
            />
        </div>
    );
}
