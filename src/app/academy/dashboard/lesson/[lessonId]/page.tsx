"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import LessonGuide from "@/components/academy/LessonGuide";
import { completeLesson, isLessonCompleted, isQuizPassed } from "@/lib/academy/progress";

// ── Lesson data shape from API ──
interface LessonData {
    id: string;
    title: string;
    youtubeId: string;
    duration: string;
    xpReward: number;
    notes: string[];
    guide: { title: string; content: string }[];
    actionLinks: { label: string; url: string; emoji: string }[];
    moduleId: string;
    moduleTitle: string;
    moduleIndex: number;
    courseId: string;
    prevLessonId: string | null;
    nextLessonId: string | null;
}

export default function LessonPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const lessonId = params.lessonId as string;
    const courseIdParam = searchParams.get("course");

    const [loading, setLoading] = useState(true);
    const [lesson, setLesson] = useState<LessonData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);
    const [showXp, setShowXp] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session) {
                    try {
                        const res = await fetch(`/api/academy/lessons/${lessonId}`);
                        if (!res.ok) throw new Error("Lección no encontrada");
                        const data = await res.json();
                        setLesson(data.lesson);
                        const cId = courseIdParam || data.lesson.courseId;
                        setCompleted(isLessonCompleted(cId, lessonId));
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
    }, [router, lessonId, courseIdParam]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="glass-card p-10 text-center">
                    <div className="text-5xl mb-4">🤔</div>
                    <h2 className="text-white text-xl font-bold mb-2">Lección no encontrada</h2>
                    <p className="text-text-secondary text-sm mb-6">{error || "Esta lección no existe todavía."}</p>
                    <Link href="/academy/dashboard" className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold btn-glow">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const courseId = courseIdParam || lesson.courseId;

    const handleComplete = () => {
        if (completed) return;
        completeLesson(courseId, lessonId, lesson.xpReward);
        setCompleted(true);
        setShowXp(true);
        setTimeout(() => setShowXp(false), 2000);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* XP Toast */}
            {showXp && (
                <div className="fixed top-20 right-4 z-50 animate-slide-up">
                    <div className="glass-card px-4 py-3 flex items-center gap-2 border border-xp-gold/30">
                        <span className="text-xl">⭐</span>
                        <span className="text-xp-gold font-bold text-sm">+{lesson.xpReward} XP</span>
                    </div>
                </div>
            )}

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 pt-20 pb-2">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Link href="/academy/dashboard" className="hover:text-white transition-colors">
                        Dashboard
                    </Link>
                    <span>/</span>
                    <span className="text-text-secondary">Módulo {lesson.moduleIndex}</span>
                    <span>/</span>
                    <span className="text-white truncate max-w-[200px] sm:max-w-none">{lesson.title}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
                {/* Split Layout: Video + Notes */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
                    {/* Video (3/5 desktop, full mobile) */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="glass-card overflow-hidden">
                            <div className="aspect-video relative">
                                <iframe
                                    src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0`}
                                    title={lesson.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0 w-full h-full"
                                />
                            </div>
                        </div>

                        {/* Title & Meta under video */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-medium">
                                    Módulo {lesson.moduleIndex}
                                </span>
                                <span className="text-text-muted text-xs">⏱ {lesson.duration}</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">
                                {lesson.title}
                            </h1>
                            <p className="text-text-secondary text-sm mt-1">{lesson.moduleTitle}</p>
                        </div>

                        {/* Main Action Button — min 48px touch target */}
                        <div className="relative">
                            {completed && isQuizPassed(courseId, lesson.moduleId) ? (
                                <Link
                                    href="/academy/dashboard"
                                    className="w-full min-h-[48px] py-4 rounded-xl bg-success/20 border border-success/30 text-white font-semibold flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Módulo completado — Volver al Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={`/dashboard/quiz/${lesson.moduleId}?course=${courseId}`}
                                    onClick={() => {
                                        if (!completed) {
                                            completeLesson(courseId, lessonId, lesson.xpReward);
                                        }
                                    }}
                                    className="w-full min-h-[48px] py-4 rounded-xl gradient-bg btn-glow hover:opacity-90 transition-opacity text-white font-semibold flex items-center justify-center gap-2"
                                >
                                    🧠 Hacer Quiz del Módulo {lesson.moduleIndex}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            )}
                        </div>

                        {/* Navigation — min 44px touch targets */}
                        <div className="flex items-center justify-between pt-2">
                            {lesson.prevLessonId ? (
                                <Link
                                    href={`/dashboard/lesson/${lesson.prevLessonId}?course=${courseId}`}
                                    className="flex items-center gap-2 text-text-secondary hover:text-white text-sm transition-colors min-h-[44px] px-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Anterior
                                </Link>
                            ) : (
                                <div />
                            )}
                            <Link
                                href="/academy/dashboard"
                                className="text-text-muted hover:text-white text-xs transition-colors min-h-[44px] flex items-center px-2"
                            >
                                Volver al Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Notes Sidebar (2/5 desktop, full mobile) */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Lesson Guide with PDF — TOP */}
                        {lesson.guide && lesson.guide.length > 0 && (
                            <LessonGuide
                                moduleIndex={lesson.moduleIndex}
                                moduleTitle={lesson.moduleTitle}
                                lessonTitle={lesson.title}
                                guide={lesson.guide}
                            />
                        )}

                        {/* Key Notes */}
                        {lesson.notes && lesson.notes.length > 0 && (
                            <div className="glass-card p-4 sm:p-6">
                                <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                    📝 Puntos Clave
                                </h2>
                                <ul className="space-y-3">
                                    {lesson.notes.map((note, i) => (
                                        <li key={i} className="flex gap-3 text-sm">
                                            <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                                                <span className="text-accent text-xs font-bold">{i + 1}</span>
                                            </div>
                                            <span className="text-text-secondary leading-relaxed">{note}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Links — 44px touch targets */}
                        {lesson.actionLinks && lesson.actionLinks.length > 0 && (
                            <div className="glass-card p-4 sm:p-6">
                                <h2 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                    🔗 Links Útiles
                                </h2>
                                <div className="space-y-2">
                                    {lesson.actionLinks.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 min-h-[44px] rounded-xl hover:bg-white/5 transition-colors group"
                                        >
                                            <span className="text-lg">{link.emoji}</span>
                                            <span className="text-text-secondary text-sm group-hover:text-white transition-colors">
                                                {link.label}
                                            </span>
                                            <svg className="w-4 h-4 text-text-muted ml-auto group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* XP Reward Info */}
                        <div className="glass-card p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-xp-gold/15 flex items-center justify-center text-xl">
                                ⭐
                            </div>
                            <div>
                                <div className="text-white text-sm font-medium">+{lesson.xpReward} XP</div>
                                <div className="text-text-muted text-xs">Al completar esta lección</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
