"use client";

// import Image from "next/image";
import { Footer } from "@/components/layout/footer";
import { LiquidProgressBar } from "@/components/dashboard/progress-bar";
import { Trophy, Star, Zap, Clock, BookOpen, Activity } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="min-h-screen w-full bg-[#0b1226] overflow-x-hidden relative font-sans selection:bg-purple-500/30">
            {/* Cosmic Background */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#0b1226] via-[#1a1f3c] to-[#0f172a] z-0" />
            <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse z-0" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700 z-0" />

            <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">

                {/* Header / Hero Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-16 animate-[float_6s_ease-in-out_infinite]">
                    {/* Avatar Section */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        {/* Holographic Ring */}
                        <div className="absolute -inset-4 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute -inset-4 border border-purple-500/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

                        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                            {/* Placeholder for Avatar since generation failed */}
                            <div className="text-6xl text-white/20 font-bold">
                                AI
                            </div>
                            {/* If we had the image:
							<Image src="/assets/profile/avatar-3d.png" alt="Student" fill className="object-cover" />
							*/}
                        </div>

                        <div className="absolute bottom-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg transform translate-x-2 translate-y-2">
                            Lvl 12
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="text-center md:text-left space-y-2">
                        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-cyan-200">
                            Alex Chen
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium backdrop-blur-sm">
                                Cadet Rank
                            </span>
                            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium backdrop-blur-sm">
                                Science Track
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Col: Stats & Badges */}
                    <div className="space-y-8 lg:col-span-1">
                        {/* Summary Panel */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-white/10 transition-colors duration-300">
                            <h3 className="text-white/80 font-bold mb-4 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-cyan-400" />
                                Current Activity
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-blue-200/60">Learning Streak</span>
                                    <span className="text-white font-bold flex items-center gap-1">
                                        <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                        14 Days
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-blue-200/60">Hours Learned</span>
                                    <span className="text-white font-bold flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-cyan-400" />
                                        32.5 hrs
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-blue-200/60">Modules Completed</span>
                                    <span className="text-white font-bold flex items-center gap-1">
                                        <BookOpen className="h-4 w-4 text-purple-400" />
                                        8/12
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Badges Panel */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[30px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                            <h3 className="text-white/80 font-bold mb-4 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-400" />
                                Achievements
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Star className={`h-8 w-8 ${i <= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'} drop-shadow-lg transform group-hover:scale-110 transition-transform`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Progress & Courses */}
                    <div className="space-y-8 lg:col-span-2">

                        {/* Liquid Progress Card */}
                        <div className="bg-gradient-to-br from-blue-900/40 to-[#0b1226]/80 backdrop-blur-xl border border-cyan-500/20 p-8 rounded-[40px] relative overflow-hidden group">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-1">Weekly Goal</h2>
                                        <p className="text-blue-200/60 text-sm">Keep up the great momentum!</p>
                                    </div>
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                        78%
                                    </span>
                                </div>

                                <LiquidProgressBar progress={78} className="h-8" />

                                <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {['Physics', 'Math', 'Coding', 'History'].map((subject) => (
                                        <div key={subject} className="bg-black/20 rounded-xl p-3 border border-white/5 text-center">
                                            <div className="text-xs text-blue-300/60 mb-1">{subject}</div>
                                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-cyan-500 w-3/4 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Course Strip */}
                        <div className="space-y-4">
                            <h3 className="text-white/80 font-bold px-2">Continue Learning</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Course Card 1 */}
                                <div className="group relative h-48 rounded-[30px] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    {/* Placeholder for course image */}
                                    <div className="absolute inset-0 bg-blue-900/30 group-hover:bg-blue-800/40 transition-colors" />

                                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-black uppercase tracking-wider">
                                                In Progress
                                            </span>
                                            <span className="text-white/80 text-xs">2h left</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                                            Advanced Quantum Mechanics
                                        </h4>
                                    </div>
                                </div>

                                {/* Course Card 2 */}
                                <div className="group relative h-48 rounded-[30px] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-purple-900/30 group-hover:bg-purple-800/40 transition-colors" />

                                    <div className="absolute bottom-0 left-0 w-full p-6 z-20">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500 text-white uppercase tracking-wider">
                                                New
                                            </span>
                                            <span className="text-white/80 text-xs">Video</span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                                            Astro-Biology Basics
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>

            <Footer />
        </div>
    );
}
