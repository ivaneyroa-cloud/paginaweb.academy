"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import { getProgress } from "@/lib/academy/progress";
import Navbar from "@/components/academy/Navbar";
import WhatsAppButton from "@/components/academy/WhatsAppButton";
import type { User } from "@supabase/supabase-js";

// Accent colors for courses (cycle through)
const ACCENT_COLORS = [
    "from-blue-500 to-cyan-400",
    "from-purple-500 to-pink-400",
    "from-amber-500 to-orange-400",
    "from-emerald-500 to-teal-400",
    "from-rose-500 to-red-400",
];

// Static "coming soon" courses that show after dynamic ones
const COMING_SOON = [
    {
        id: "coming-soon-1",
        title: "Cómo Vender lo que Importás",
        subtitle: "Marketplace & E-commerce",
        description: "Aprendé a armar tu tienda online, publicar en MercadoLibre, calcular márgenes reales y escalar tus ventas de productos importados.",
        level: "Intermedio",
        emoji: "🛒",
        accentColor: "from-purple-500 to-pink-400",
    },
    {
        id: "coming-soon-2",
        title: "Importación Formal: El Siguiente Nivel",
        subtitle: "Contenedores & Despacho",
        description: "Cuando el courier ya no alcanza. Aprendé a importar por contenedor, trabajar con despachantes y optimizar costos a gran escala.",
        level: "Avanzado",
        emoji: "🚢",
        accentColor: "from-amber-500 to-orange-400",
    },
];

interface DBCourse {
    id: string;
    title: string;
    description: string;
    subtitle: string;
    emoji: string;
    level: string;
    is_free: boolean;
    published: boolean;
    totalLessons: number;
    totalQuestions: number;
    modules: any[];
}

export default function CoursesPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState(false);
    const [dbCourses, setDbCourses] = useState<DBCourse[]>([]);
    const [courseProgress, setCourseProgress] = useState(0);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) { router.push("/academy/login"); return; }
            setUser(session.user);
            const p = getProgress();
            setCourseProgress(p.completedLessons.length);
            // Fetch published courses from DB
            fetch("/api/academy/courses")
                .then((r) => r.json())
                .then((data) => setDbCourses(data.courses || []))
                .catch(() => { })
                .finally(() => setLoading(false));
        });
        return () => subscription.unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    const allQuizzesPassed = getProgress().passedQuizzes.length >= 4;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <WhatsAppButton />

            <main className="max-w-5xl mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <div className="mb-10 relative">
                    <div className="absolute -top-10 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-[120px]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            📚 Nuestros <span className="gradient-text">Cursos</span>
                        </h1>
                        <p className="text-text-secondary text-lg">
                            Formación práctica para importar con confianza. Elegí tu curso y empezá.
                        </p>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Dynamic courses from DB */}
                    {dbCourses.map((course, idx) => {
                        const moduleCount = course.modules?.length || 0;
                        const lessonCount = course.totalLessons || 0;
                        const accentColor = ACCENT_COLORS[idx % ACCENT_COLORS.length];
                        // Calculate approximate duration
                        const totalDuration = course.modules?.reduce((sum: number, m: any) =>
                            sum + (m.lessons || []).reduce((ls: number, l: any) => {
                                const mins = parseInt(l.duration) || 3;
                                return ls + mins;
                            }, 0), 0) || 0;
                        const durationStr = totalDuration > 0 ? `${totalDuration} min` : "—";
                        const progressPercent = lessonCount > 0 ? (courseProgress / lessonCount) * 100 : 0;

                        return (
                            <div key={course.id}
                                className="glass-card overflow-hidden flex flex-col transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5">
                                <div className={`h-32 bg-gradient-to-br ${accentColor} relative flex items-center justify-center`}>
                                    <span className="text-5xl">{course.emoji}</span>
                                    {course.is_free && (
                                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider">
                                            Gratis
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="text-white font-bold text-base mb-1">{course.title}</h3>
                                    <p className="text-accent text-xs font-medium mb-2">{course.subtitle}</p>
                                    <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">{course.description}</p>
                                    <div className="flex items-center gap-3 text-text-muted text-xs mb-4">
                                        <span>📦 {moduleCount} módulos</span>
                                        <span>🎬 {lessonCount} lecciones</span>
                                        <span>⏱ {durationStr}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-muted">{course.level}</span>
                                    </div>

                                    {/* Progress */}
                                    {courseProgress > 0 && lessonCount > 0 && (
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                                                <span>Tu progreso</span>
                                                <span>{Math.min(Math.round(progressPercent), 100)}%</span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-border-dark overflow-hidden">
                                                <div className="h-full rounded-full gradient-bg transition-all"
                                                    style={{ width: `${Math.min(progressPercent, 100)}%` }} />
                                            </div>
                                        </div>
                                    )}

                                    <Link href={`/dashboard/course/${course.id}`}
                                        className="block w-full text-center py-3 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow">
                                        {allQuizzesPassed
                                            ? "🎓 Ver Certificado"
                                            : courseProgress > 0
                                                ? "▶️ Continuar Curso"
                                                : "🚀 Empezar Curso"}
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                    {/* Coming Soon static courses */}
                    {COMING_SOON.map((course) => (
                        <div key={course.id}
                            className="glass-card overflow-hidden flex flex-col transition-all opacity-60">
                            <div className={`h-32 bg-gradient-to-br ${course.accentColor} relative flex items-center justify-center`}>
                                <span className="text-5xl">{course.emoji}</span>
                                <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm text-white/80 text-[10px] font-medium uppercase tracking-wider">
                                    Próximamente
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-white font-bold text-base mb-1">{course.title}</h3>
                                <p className="text-accent text-xs font-medium mb-2">{course.subtitle}</p>
                                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">{course.description}</p>
                                <div className="flex items-center gap-3 text-text-muted text-xs mb-4">
                                    <span>⏱ Próximamente</span>
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-text-muted">{course.level}</span>
                                </div>
                                <div className="w-full text-center py-3 rounded-xl bg-white/5 border border-border-dark text-text-muted text-sm font-medium cursor-not-allowed">
                                    🔒 Próximamente
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Subscribe */}
                <div className="glass-card p-8 relative overflow-hidden text-center">
                    <div className="absolute -top-10 -right-10 w-60 h-60 bg-primary/10 rounded-full blur-[80px]" />
                    <div className="relative z-10">
                        <div className="text-4xl mb-3">🔔</div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            ¿Querés saber cuando lancemos nuevos cursos?
                        </h2>
                        <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                            Suscribite y te avisamos apenas publiquemos contenido nuevo.
                            No spam — solo actualizaciones de cursos.
                        </p>

                        {subscribed ? (
                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-success/10 border border-success/20 text-success text-sm font-medium">
                                ✅ ¡Suscripto! Te avisaremos a {user?.email}
                            </div>
                        ) : (
                            <button onClick={() => setSubscribed(true)}
                                className="px-8 py-3 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow">
                                Suscribirme con {user?.email}
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
