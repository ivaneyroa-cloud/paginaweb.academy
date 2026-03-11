"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import { getUserRank, RANKS } from "@/lib/academy/types";
import { getCourseProgress, getModuleStatus, isQuizPassed, isCourseComplete, type CourseProgress, type ModuleInfo } from "@/lib/academy/progress";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import Navbar from "@/components/academy/Navbar";

const BADGES = [
    { id: "b1", emoji: "🐣", name: "Primer Paso", description: "Completaste tu primera lección", unlocked: false },
    { id: "b2", emoji: "🧠", name: "Quiz Master", description: "100% en un quiz", unlocked: false },
    { id: "b3", emoji: "📦", name: "Módulo Completo", description: "Terminaste un módulo entero", unlocked: false },
    { id: "b4", emoji: "🏆", name: "Importador S1", description: "Completaste todo el curso", unlocked: false },
    { id: "b5", emoji: "⚡", name: "Rayo Veloz", description: "Quiz perfecto en menos de 30s", unlocked: false },
];

interface CourseData {
    id: string;
    title: string;
    description: string;
    subtitle: string;
    emoji: string;
    level: string;
    is_free: boolean;
    modules: {
        id: string;
        title: string;
        order_index: number;
        lessons: { id: string; title: string; duration: string; order_index: number }[];
        quiz_questions: { id: string }[];
    }[];
}

export default function DynamicCoursePage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [user, setUser] = useState<SupabaseAuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<CourseData | null>(null);
    const [progress, setProgress] = useState<CourseProgress>({ completedLessons: [], passedQuizzes: [], xp: 0 });

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!session) { router.push("/academy/login"); return; }
                setUser(session.user);
                setProgress(getCourseProgress(courseId));

                // Fetch course from DB
                try {
                    const res = await fetch(`/api/academy/courses/${courseId}`);
                    if (!res.ok) throw new Error("Not found");
                    const data = await res.json();
                    setCourse(data.course);
                } catch {
                    // Course not found
                }
                setLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, [router, courseId]);

    // Refresh progress on focus
    useEffect(() => {
        const handleFocus = () => setProgress(getCourseProgress(courseId));
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
                    <p className="text-text-muted text-sm">Cargando curso...</p>
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="glass-card p-10 text-center">
                    <div className="text-5xl mb-4">🤔</div>
                    <h2 className="text-white text-xl font-bold mb-2">Curso no encontrado</h2>
                    <Link href="/academy/dashboard/courses" className="text-accent hover:underline text-sm">← Volver a cursos</Link>
                </div>
            </div>
        );
    }

    // Calculate totals
    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalDuration = course.modules.reduce((sum, m) =>
        sum + m.lessons.reduce((ls, l) => ls + (parseInt(l.duration) || 3), 0), 0);

    const moduleQuizIds = course.modules.map((m) => m.id);

    const xp = progress.xp;
    const completedLessons = progress.completedLessons.length;
    const rank = getUserRank(xp);
    const nextRank = RANKS.find((r) => r.minXp > xp);
    const progressToNext = nextRank ? ((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100 : 100;
    const courseProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Estudiante";
    const allQuizzesPassed = isCourseComplete(courseId, moduleQuizIds);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                    <Link href="/academy/dashboard" className="hover:text-white transition-colors">Panel</Link>
                    <span>/</span>
                    <Link href="/academy/dashboard/courses" className="hover:text-white transition-colors">Cursos</Link>
                    <span>/</span>
                    <span className="text-white">{course.title}</span>
                </div>

                {/* Welcome Header */}
                <div className="mb-10 relative">
                    <div className="absolute -top-10 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-[120px]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            ¡Hola, <span className="gradient-text">{userName}</span>! 👋
                        </h1>
                        <p className="text-text-secondary text-lg">
                            Continuá aprendiendo y sumá XP para subir de rango.
                        </p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="glass-card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-xp-gold/10 rounded-full blur-[40px]" />
                        <div className="relative z-10">
                            <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Experiencia</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-xp-gold">{xp}</span>
                                <span className="text-text-muted text-sm">XP</span>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-[40px]" />
                        <div className="relative z-10">
                            <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Rango Actual</div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{rank.emoji}</span>
                                <span className="text-lg font-bold text-white">{rank.name}</span>
                            </div>
                            {nextRank && (
                                <div className="mt-3">
                                    <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                                        <span>Progreso al siguiente</span>
                                        <span>{nextRank.emoji} {nextRank.name}</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden">
                                        <div className="h-full rounded-full gradient-bg progress-glow animate-progress-fill" style={{ width: `${progressToNext}%` }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="glass-card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-success/10 rounded-full blur-[40px]" />
                        <div className="relative z-10">
                            <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Lecciones</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-success">{completedLessons}</span>
                                <span className="text-text-muted text-sm">/ {totalLessons} completadas</span>
                            </div>
                            <div className="mt-3">
                                <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden">
                                    <div className="h-full rounded-full bg-success progress-glow animate-progress-fill" style={{ width: `${courseProgress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {course.emoji} {course.title}
                        </h2>

                        <div className="glass-card overflow-hidden">
                            <div className="p-6 border-b border-border-dark">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">{course.title}</h3>
                                        <p className="text-text-secondary text-sm leading-relaxed max-w-xl">{course.description}</p>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium whitespace-nowrap ml-4">
                                        {course.level}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-4 text-text-muted text-xs">
                                    <span>📦 {course.modules.length} módulos</span>
                                    <span>🎬 {totalLessons} lecciones</span>
                                    <span>⏱ {totalDuration} min</span>
                                    {course.is_free && (
                                        <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-xs font-medium">GRATIS</span>
                                    )}
                                </div>
                            </div>

                            {/* Modules List */}
                            <div className="divide-y divide-border-dark">
                                {course.modules.map((mod, mi) => {
                                    const orderedModules: ModuleInfo[] = course.modules.map(m => ({
                                        id: m.id,
                                        lessonIds: m.lessons.map(l => l.id),
                                    }));
                                    const status = getModuleStatus(courseId, mi, mod.id, mod.lessons.map(l => l.id), orderedModules);
                                    const isLocked = status === "locked";
                                    const quizDone = isQuizPassed(courseId, mod.id);

                                    return (
                                        <div key={mod.id} className={`p-5 relative ${isLocked ? "opacity-50" : ""} ${!isLocked && !quizDone ? "border-l-2 border-l-accent/60" : ""}`}>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${quizDone ? "bg-success" : isLocked ? "bg-border-dark" : "gradient-bg"}`}>
                                                    {quizDone ? "✓" : mi + 1}
                                                </div>
                                                <h4 className="text-white font-semibold text-sm">{mod.title}</h4>
                                                {quizDone && (
                                                    <span className="px-2 py-0.5 rounded-full bg-success/15 text-success text-[10px] font-medium">COMPLETADO</span>
                                                )}
                                            </div>
                                            <div className={`ml-11 space-y-2 ${isLocked ? "pointer-events-none" : ""}`}>
                                                {mod.lessons.map((lesson) => {
                                                    const done = progress.completedLessons.includes(lesson.id);
                                                    return (
                                                        <Link key={lesson.id}
                                                            href={isLocked ? "#" : `/dashboard/lesson/${lesson.id}?course=${courseId}`}
                                                            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${done ? "border-success bg-success/20" : "border-border-dark group-hover:border-accent"}`}>
                                                                    {done ? (
                                                                        <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg className="w-3 h-3 text-text-muted group-hover:text-accent transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M8 5v14l11-7z" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <span className={`text-sm transition-colors ${done ? "text-success" : "text-text-secondary group-hover:text-white"}`}>
                                                                    {lesson.title}
                                                                </span>
                                                            </div>
                                                            <span className="text-text-muted text-xs">{done ? "✓" : lesson.duration}</span>
                                                        </Link>
                                                    );
                                                })}
                                                {/* Quiz Button */}
                                                <Link href={isLocked ? "#" : `/dashboard/quiz/${mod.id}?course=${courseId}`}
                                                    className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${quizDone ? "bg-success/5 border-success/20" : "bg-primary/5 border-primary/10 hover:bg-primary/10 hover:border-primary/20"}`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${quizDone ? "bg-success/20" : "bg-primary/20"}`}>
                                                            <span className="text-xs">{quizDone ? "✅" : "🧠"}</span>
                                                        </div>
                                                        <span className={`text-sm font-medium transition-colors ${quizDone ? "text-success" : "text-primary group-hover:text-white"}`}>
                                                            {quizDone ? "Quiz aprobado" : `Quiz del Módulo ${mi + 1}`}
                                                        </span>
                                                    </div>
                                                    <span className={`text-xs font-medium ${quizDone ? "text-success/60" : "text-primary/60"}`}>
                                                        {quizDone ? "✓" : "+XP"}
                                                    </span>
                                                </Link>
                                            </div>
                                            {isLocked && (
                                                <div className="ml-11 mt-2 px-3 py-1.5 rounded-lg bg-white/5 text-text-muted text-xs flex items-center gap-1.5">
                                                    🔒 Completá el módulo anterior y su quiz para desbloquear
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* CTA */}
                            <div className="p-6 border-t border-border-dark">
                                {allQuizzesPassed ? (
                                    <Link href="/academy/dashboard/certificate"
                                        className="block w-full text-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold hover:opacity-90 transition-opacity">
                                        🎓 Ver Certificado
                                    </Link>
                                ) : (
                                    <Link href={`/dashboard/lesson/${course.modules[0]?.lessons[0]?.id || ""}?course=${courseId}`}
                                        className="block w-full text-center px-6 py-3.5 min-h-[48px] rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity">
                                        {completedLessons === 0 ? "🚀 Empezar Curso" : "▶️ Continuar"}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">🏆 Tus Badges</h2>
                        <div className="glass-card p-6">
                            <div className="grid grid-cols-3 gap-4">
                                {BADGES.map((badge) => (
                                    <div key={badge.id}
                                        className={`flex flex-col items-center text-center p-3 rounded-xl transition-all ${badge.unlocked ? "bg-accent/10 border border-accent/20" : "opacity-40 grayscale"}`}
                                        title={badge.description}>
                                        <div className="text-2xl mb-1">{badge.emoji}</div>
                                        <div className="text-white text-[10px] font-medium leading-tight">{badge.name}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-text-muted text-xs mt-4 text-center">
                                Completá lecciones y quizzes para desbloquear badges
                            </p>
                        </div>

                        <h2 className="text-xl font-bold text-white flex items-center gap-2">⚡ Acciones Rápidas</h2>
                        <div className="space-y-3">
                            <a href="https://shippar.net" target="_blank" rel="noopener noreferrer"
                                className="glass-card p-4 flex items-center gap-3 card-hover block">
                                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-lg">📦</div>
                                <div>
                                    <div className="text-white text-sm font-medium">Importar con Shippar</div>
                                    <div className="text-text-muted text-xs">Empezá tu primera importación</div>
                                </div>
                            </a>
                            <a href="https://api.whatsapp.com/send/?phone=5491139243790&text=Hola%2C+te+escribo+desde+Shippar+Academy.&type=phone_number&app_absent=0"
                                target="_blank" rel="noopener noreferrer"
                                className="glass-card p-4 flex items-center gap-3 card-hover block">
                                <div className="w-10 h-10 rounded-lg bg-success/15 flex items-center justify-center text-lg">💬</div>
                                <div>
                                    <div className="text-white text-sm font-medium">Contactar Soporte</div>
                                    <div className="text-text-muted text-xs">Te ayudamos por WhatsApp</div>
                                </div>
                            </a>
                        </div>

                        {/* Certificate Teaser */}
                        <div className="glass-card p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-xp-gold/10 rounded-full blur-[50px]" />
                            <div className="relative z-10 text-center">
                                <div className="text-4xl mb-3">{allQuizzesPassed ? "🎓" : "📜"}</div>
                                <h3 className="text-white font-bold text-sm mb-1">Certificado de Importador S1</h3>
                                {allQuizzesPassed ? (
                                    <>
                                        <p className="text-success text-xs mb-4 leading-relaxed">¡Curso completado! Tu certificado está listo.</p>
                                        <Link href="/academy/dashboard/certificate"
                                            className="inline-block w-full py-3 rounded-xl gradient-bg text-white font-semibold text-sm btn-glow hover:opacity-90 transition-opacity">
                                            🎓 Descargar Certificado
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-text-muted text-xs mb-4 leading-relaxed">
                                            Completá el 100% del curso para desbloquear tu certificado descargable
                                        </p>
                                        <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden">
                                            <div className="h-full rounded-full bg-xp-gold progress-glow animate-progress-fill" style={{ width: `${courseProgress}%` }} />
                                        </div>
                                        <p className="text-text-muted text-xs mt-2">{completedLessons}/{totalLessons} lecciones completadas</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
