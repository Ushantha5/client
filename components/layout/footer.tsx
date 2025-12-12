"use client";

import Image from "next/image";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function Footer({ year = 2025 }: { year?: number }) {
    const [isDark, setIsDark] = useState(true);

    return (
        <footer role="contentinfo" className="w-full py-8 px-6 relative z-50 mt-20">
            {/* Floating Glass Container */}
            <div className="mx-auto max-w-7xl rounded-[18px] bg-white/5 border border-white/10 backdrop-blur-[10px] shadow-[0_10px_24px_rgba(2,6,23,0.6),inset_0_6px_16px_rgba(255,255,255,0.02)] p-6 transition-all duration-300 hover:shadow-[0_15px_30px_rgba(0,184,255,0.15),inset_0_6px_16px_rgba(255,255,255,0.05)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left: Logo & Tagline */}
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/assets/mr5-logo-neon.png"
                                alt="Mr5_LMS logo"
                                fill
                                className="object-contain drop-shadow-[0_0_10px_rgba(0,184,255,0.5)]"
                            />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white tracking-wide">Mr5_LMS</div>
                            <div className="text-xs text-blue-200/70 font-medium">Teach smarter, not harder.</div>
                        </div>
                    </div>

                    {/* Center: Navigation */}
                    <nav aria-label="Footer links" className="hidden md:flex gap-8 text-sm font-medium text-blue-100/80">
                        {['Courses', 'Pricing', 'Instructors', 'Support'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="hover:text-[#00b8ff] hover:drop-shadow-[0_0_8px_rgba(0,184,255,0.6)] transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    {/* Right: CTA Group */}
                    <div className="flex items-center gap-4">
                        <button
                            aria-label="Request demo"
                            className="px-5 py-2.5 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{
                                background: 'linear-gradient(90deg, rgba(0,184,255,0.12), rgba(0,184,255,0.06))',
                                border: '1px solid rgba(0,184,255,0.22)',
                                boxShadow: '0 6px 28px rgba(0,184,255,0.12), 0 2px 6px rgba(2,6,23,0.5)'
                            }}
                        >
                            Get a demo
                        </button>

                        <div className="h-8 w-[1px] bg-white/10 mx-1" />

                        <select aria-label="Language" className="bg-transparent text-sm text-blue-200 border-none outline-none cursor-pointer hover:text-white">
                            <option className="bg-slate-900">EN</option>
                            <option className="bg-slate-900">TA</option>
                        </select>

                        <button
                            aria-label="Toggle theme"
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-blue-200"
                        >
                            {isDark ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <div className="relative w-8 h-8 ml-2 rounded-full ring-2 ring-white/10 p-0.5">
                            <Image
                                src="/assets/dashboard/footer-avatar.png"
                                alt="AI Assistant"
                                fill
                                className="object-contain rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Legal Row */}
            <div className="mx-auto max-w-7xl mt-4 px-4 text-[10px] text-blue-200/40 flex flex-col md:flex-row justify-between items-center gap-2">
                <div>© {year} Mr5_LMS. All rights reserved.</div>
                <div className="flex gap-6">
                    <Link href="/terms" className="hover:text-blue-200 transition-colors">Terms</Link>
                    <Link href="/privacy" className="hover:text-blue-200 transition-colors">Privacy</Link>
                    <Link href="/accessibility" className="hover:text-blue-200 transition-colors">Accessibility</Link>
                </div>
            </div>
        </footer>
    );
}
