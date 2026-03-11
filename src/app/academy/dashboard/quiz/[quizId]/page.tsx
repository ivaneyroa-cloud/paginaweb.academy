"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import QuizPlayer from "@/components/academy/QuizPlayer";
import type { Question } from "@/components/academy/quiz/types";
import { passQuiz } from "@/lib/academy/progress";

interface QuizData {
    module: {
        id: string;
        title: string;
        moduleIndex: number;
        courseId: string;
    };
    questions: Question[];
}

export default function QuizPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const quizId = params.quizId as string; // This is the module UUID
    const courseIdParam = searchParams.get("course");

    const [loading, setLoading] = useState(true);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showXpFloat, setShowXpFloat] = useState(false);
    const [earnedXp, setEarnedXp] = useState(0);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    try {
                        const res = await fetch(`/api/academy/modules/${quizId}/quiz`);
                        if (!res.ok) throw new Error("Quiz no encontrado");
                        const data = await res.json();
                        if (!data.questions || data.questions.length === 0) {
                            throw new Error("Este módulo no tiene preguntas de quiz");
                        }
                        setQuizData(data);
                    } catch (err: any) {
                        setError(err.message);
                    }
                    setLoading(false);
                } else if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
                    router.push("/academy/login");
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [router, quizId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !quizData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="glass-card p-10 text-center">
                    <div className="text-5xl mb-4">🤔</div>
                    <h2 className="text-white text-xl font-bold mb-2">Quiz no encontrado</h2>
                    <p className="text-text-secondary text-sm mb-6">{error || "Este quiz no existe todavía."}</p>
                    <Link href="/academy/dashboard" className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold btn-glow">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const courseId = courseIdParam || quizData.module.courseId;

    const handleComplete = (score: number, totalXp: number, total: number) => {
        const percentage = Math.round((score / total) * 100);
        const passed = percentage >= 70;

        if (passed) {
            passQuiz(courseId, quizId, totalXp);
        }

        setEarnedXp(totalXp);
        if (totalXp > 0) {
            setShowXpFloat(true);
            setTimeout(() => setShowXpFloat(false), 2500);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-2">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Link href="/academy/dashboard" className="hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <span>/</span>
                    <span className="text-text-secondary">Módulo {quizData.module.moduleIndex}</span>
                    <span>/</span>
                    <span className="text-white">Quiz</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6 relative">
                {/* Background glows */}
                <div className="absolute top-10 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

                {/* XP Float */}
                {showXpFloat && (
                    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 text-xp-gold font-bold text-2xl animate-xp-float pointer-events-none">
                        +{earnedXp} XP ⭐
                    </div>
                )}

                <div className="relative z-10">
                    <QuizPlayer
                        title={`Quiz — Módulo ${quizData.module.moduleIndex}: ${quizData.module.title}`}
                        questions={quizData.questions}
                        moduleIndex={quizData.module.moduleIndex}
                        totalModules={4}
                        onComplete={handleComplete}
                    />
                </div>
            </main>
        </div>
    );
}
