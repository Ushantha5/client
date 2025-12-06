'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import {
    Send,
    Loader2,
    Calculator,
    BookOpen,
    Lightbulb,
    CheckCircle2,
    Copy,
    Download,
    Sparkles,
    Brain,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Solution {
    problem: string;
    subject: string;
    solution: string;
    steps: string[];
    timestamp: Date;
}

const subjects = [
    { id: 'math', name: 'Mathematics', icon: Calculator, color: 'from-blue-500 to-cyan-500' },
    { id: 'physics', name: 'Physics', icon: Zap, color: 'from-purple-500 to-pink-500' },
    { id: 'chemistry', name: 'Chemistry', icon: Brain, color: 'from-green-500 to-emerald-500' },
    { id: 'general', name: 'General', icon: BookOpen, color: 'from-orange-500 to-yellow-500' }
];

export default function SolverPage() {
    const [problem, setProblem] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('math');
    const [isLoading, setIsLoading] = useState(false);
    const [solution, setSolution] = useState<Solution | null>(null);
    const [history, setHistory] = useState<Solution[]>([]);

    const handleSolve = async () => {
        if (!problem.trim()) {
            toast.error('Please enter a problem to solve');
            return;
        }

        setIsLoading(true);

        // Simulate AI processing
        setTimeout(() => {
            const newSolution: Solution = {
                problem: problem,
                subject: subjects.find(s => s.id === selectedSubject)?.name || 'General',
                solution: generateSolution(problem, selectedSubject),
                steps: generateSteps(problem, selectedSubject),
                timestamp: new Date()
            };

            setSolution(newSolution);
            setHistory([newSolution, ...history]);
            setIsLoading(false);
            toast.success('Solution generated successfully!');
        }, 2000);
    };

    const generateSolution = (prob: string, subject: string): string => {
        // Mock solution generator - in production, this would call your AI service
        const solutions: Record<string, string> = {
            math: `For the problem "${prob}", we can solve this using fundamental mathematical principles. The solution involves breaking down the problem into manageable steps and applying the appropriate formulas and theorems.`,
            physics: `This physics problem "${prob}" can be solved by applying Newton's laws and conservation principles. We'll analyze the forces, energy, and motion involved.`,
            chemistry: `To solve "${prob}", we need to consider the chemical properties, reactions, and stoichiometry involved in this problem.`,
            general: `The answer to "${prob}" can be found by analyzing the problem systematically and applying logical reasoning.`
        };
        return solutions[subject] || solutions.general;
    };

    const generateSteps = (prob: string, subject: string): string[] => {
        // Mock step generator
        return [
            'Identify the given information and what needs to be found',
            'Choose the appropriate formula or method',
            'Substitute the known values into the formula',
            'Perform the necessary calculations',
            'Verify the answer and check units',
            'State the final answer clearly'
        ];
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
    };

    const downloadSolution = () => {
        if (!solution) return;

        const content = `
Problem: ${solution.problem}
Subject: ${solution.subject}
Date: ${solution.timestamp.toLocaleString()}

Solution:
${solution.solution}

Steps:
${solution.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
		`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `solution-${Date.now()}.txt`;
        link.click();
        toast.success('Solution downloaded!');
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />

            <main className="flex-1 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-4 py-12 relative z-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">AI-Powered Problem Solver</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-600 bg-clip-text text-transparent">
                            MMS Solver
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Get instant solutions to your Math, Physics, Chemistry, and other academic problems with step-by-step explanations.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Input Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2 space-y-6"
                        >
                            {/* Subject Selection */}
                            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-primary" />
                                    Select Subject
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {subjects.map((subject) => (
                                        <button
                                            key={subject.id}
                                            onClick={() => setSelectedSubject(subject.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all ${selectedSubject === subject.id
                                                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                                    : 'border-border/50 bg-card/30 hover:border-primary/50 hover:bg-card/50'
                                                }`}
                                        >
                                            <subject.icon className={`w-6 h-6 mx-auto mb-2 ${selectedSubject === subject.id ? 'text-primary' : 'text-muted-foreground'
                                                }`} />
                                            <p className={`text-sm font-medium ${selectedSubject === subject.id ? 'text-primary' : 'text-foreground'
                                                }`}>
                                                {subject.name}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Problem Input */}
                            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-primary" />
                                    Enter Your Problem
                                </h2>
                                <textarea
                                    value={problem}
                                    onChange={(e) => setProblem(e.target.value)}
                                    placeholder="Type your problem here... For example: 'Solve the equation 2x + 5 = 15'"
                                    className="w-full h-48 bg-background/50 border border-border/50 rounded-2xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                                />
                                <div className="flex items-center justify-between mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        {problem.length} characters
                                    </p>
                                    <Button
                                        onClick={handleSolve}
                                        disabled={isLoading || !problem.trim()}
                                        className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-primary-foreground rounded-full px-8 shadow-lg shadow-primary/25 transition-all hover:scale-105"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Solving...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Solve Problem
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Solution Display */}
                            <AnimatePresence>
                                {solution && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl"
                                    >
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                                Solution
                                            </h2>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => copyToClipboard(solution.solution)}
                                                    className="rounded-full"
                                                >
                                                    <Copy className="w-4 h-4 mr-2" />
                                                    Copy
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={downloadSolution}
                                                    className="rounded-full"
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="bg-background/50 rounded-2xl p-4 border border-border/30">
                                                <p className="text-sm text-muted-foreground mb-2">Problem:</p>
                                                <p className="text-foreground font-medium">{solution.problem}</p>
                                            </div>

                                            <div className="bg-background/50 rounded-2xl p-4 border border-border/30">
                                                <p className="text-sm text-muted-foreground mb-2">Answer:</p>
                                                <p className="text-foreground leading-relaxed">{solution.solution}</p>
                                            </div>

                                            <div className="bg-background/50 rounded-2xl p-4 border border-border/30">
                                                <p className="text-sm text-muted-foreground mb-4">Step-by-Step Solution:</p>
                                                <div className="space-y-3">
                                                    {solution.steps.map((step, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="flex gap-3"
                                                        >
                                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                                <span className="text-sm font-bold text-primary">{index + 1}</span>
                                                            </div>
                                                            <p className="text-foreground pt-1">{step}</p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Loading State */}
                            <AnimatePresence>
                                {isLoading && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-primary/30 rounded-3xl p-12 shadow-2xl"
                                    >
                                        <div className="flex flex-col items-center gap-6">
                                            <div className="relative">
                                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-purple-500 animate-spin w-24 h-24"></div>
                                                <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin w-20 h-20" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                                                <div className="w-24 h-24 flex items-center justify-center">
                                                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
                                                    AI is solving your problem...
                                                </h3>
                                                <p className="text-muted-foreground animate-pulse">
                                                    Analyzing and generating step-by-step solution
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* History Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-xl sticky top-24">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-primary" />
                                    Recent Solutions
                                </h2>
                                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                    {history.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm">No solutions yet</p>
                                            <p className="text-xs mt-1">Your solved problems will appear here</p>
                                        </div>
                                    ) : (
                                        history.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => setSolution(item)}
                                                className="bg-background/50 border border-border/30 rounded-2xl p-4 cursor-pointer hover:border-primary/50 hover:bg-background/70 transition-all group"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subjects.find(s => s.name === item.subject)?.color || 'from-gray-500 to-gray-600'
                                                        } flex items-center justify-center flex-shrink-0`}>
                                                        {(() => {
                                                            const Subject = subjects.find(s => s.name === item.subject);
                                                            const Icon = Subject?.icon || BookOpen;
                                                            return <Icon className="w-5 h-5 text-white" />;
                                                        })()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                                            {item.problem}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-muted-foreground">{item.subject}</span>
                                                            <span className="text-xs text-muted-foreground">•</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {item.timestamp.toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50 py-8 bg-card/50 backdrop-blur-xl">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground text-sm">
                        © 2025 MR5 School. Powered by AI Intelligence.
                    </p>
                </div>
            </footer>
        </div>
    );
}
