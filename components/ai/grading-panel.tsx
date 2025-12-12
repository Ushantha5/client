"use client";

import { useState } from "react";
import { aiService } from "@/services/ai.service";
import { GradeResponse } from "@/types/ai";
import { Loader2, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export function GradingPanel({ rubric }: { rubric: string }) {
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState<GradeResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGrade = async () => {
        if (!answer.trim()) return;
        setLoading(true);
        try {
            const data = await aiService.gradeAssignment({ answer, rubric });
            setResult(data);
        } catch (error) {
            console.error("Grading failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[30px] shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">AI Auto-Grader</h2>

            <div className="space-y-4 mb-8">
                <label className="block text-sm font-medium text-blue-200">Your Answer</label>
                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    placeholder="Type your response here..."
                />
                <button
                    onClick={handleGrade}
                    disabled={loading || !answer.trim()}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" /> Analyzing...
                        </div>
                    ) : (
                        "Submit for Grading"
                    )}
                </button>
            </div>

            {/* Results Section */}
            {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-lg font-medium text-blue-200">Score</span>
                        <span className={`text-4xl font-black ${result.score >= 70 ? 'text-green-400' : 'text-orange-400'}`}>
                            {result.score}/100
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                            <h3 className="flex items-center gap-2 font-bold text-green-400 mb-2">
                                <CheckCircle2 size={18} /> Strengths
                            </h3>
                            <ul className="space-y-1 list-disc list-inside text-sm text-green-100/80">
                                {result.strengths.map((str, i) => <li key={i}>{str}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                            <h3 className="flex items-center gap-2 font-bold text-orange-400 mb-2">
                                <AlertTriangle size={18} /> Improvements
                            </h3>
                            <ul className="space-y-1 list-disc list-inside text-sm text-orange-100/80">
                                {result.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                        <h3 className="flex items-center gap-2 font-bold text-blue-400 mb-2">
                            <Lightbulb size={18} /> Action Plan
                        </h3>
                        <p className="text-sm text-blue-100/80">{result.improvementAction}</p>
                    </div>

                    {result.requiresManualReview && (
                        <div className="text-center text-xs text-yellow-500/60 font-mono mt-4">
                            * Flagged for manual instructor review due to ambiguity.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
