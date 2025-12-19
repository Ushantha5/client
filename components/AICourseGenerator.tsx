"use client";

import React, { useState } from 'react';
import apiClient from '@/lib/apiClient';
import { motion } from 'framer-motion';

// Define strict types for the response
interface CourseModule {
    title: string;
    lessons: string[];
}

interface GeneratedCourse {
    title: string;
    description: string;
    modules: CourseModule[];
}

const AICourseGenerator = () => {
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<GeneratedCourse | null>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setLoading(true);
        try {
            const res = await apiClient.post('/api/ai/generate-course', { topic });
            setCourse(res.data.data);
        } catch (err) {
            console.error("Failed to generate course", err);
            // Using browser alert as requested in prototype, but toast is recommended in production
            alert("Failed to generate course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
                ✨ AI Course Architect
            </h2>

            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    className="flex-1 p-4 rounded-xl border-2 border-primary/20 bg-background focus:border-primary outline-none transition-all shadow-sm text-foreground placeholder:text-muted-foreground"
                    placeholder="e.g., Advanced React Patterns"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Build Course'}
                </button>
            </div>

            {/* Render AI Result */}
            {course && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface p-6 rounded-2xl shadow-xl border border-white/10"
                >
                    <h3 className="text-2xl font-bold text-primary">{course.title}</h3>
                    <p className="text-muted-foreground mt-2">{course.description}</p>
                    <div className="mt-6 space-y-4">
                        {course.modules.map((mod, i) => (
                            <div key={i} className="p-4 bg-background/50 rounded-lg border border-white/5">
                                <h4 className="font-semibold text-lg text-foreground">Module {i + 1}: {mod.title}</h4>
                                <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
                                    {mod.lessons.map((lesson, j) => (
                                        <li key={j}>{lesson}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AICourseGenerator;
