"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["ivaneyroa@shippar.net", "abaleani@shippar.net"];

interface CourseRow {
    id: string;
    title: string;
    description: string;
    subtitle: string;
    emoji: string;
    level: string;
    is_free: boolean;
    published: boolean;
    order_index: number;
    created_at: string;
    modules?: any[];
}

export default function AdminCoursesPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<CourseRow[]>([]);
    const [error, setError] = useState("");
    const [dbReady, setDbReady] = useState<boolean | null>(null);

    // New course form
    const [showForm, setShowForm] = useState(false);
    const [newCourse, setNewCourse] = useState({
        title: "",
        description: "",
        subtitle: "",
        emoji: "📦",
        level: "Principiante",
        is_free: false,
    });
    const [creating, setCreating] = useState(false);
    const [seeding, setSeeding] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: any, session: any) => {
                if (!session) { router.push("/academy/login"); return; }
                if (!ADMIN_EMAILS.includes(session.user.email?.toLowerCase() || "")) {
                    router.push("/academy/dashboard"); return;
                }
                setUser(session.user);
                setToken(session.access_token);
                await fetchCourses(session.access_token);
                setLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    const fetchCourses = async (t: string) => {
        try {
            const res = await fetch("/api/academy/admin/courses", {
                headers: { Authorization: `Bearer ${t}` },
            });
            if (!res.ok) {
                const d = await res.json();
                if (d.error?.includes("does not exist") || d.error?.includes("relation")) {
                    setDbReady(false);
                } else {
                    setError(d.error || "Error loading courses");
                }
                return;
            }
            const data = await res.json();
            setCourses(data.courses || []);
            setDbReady(true);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourse.title.trim()) return;
        setCreating(true);
        try {
            const res = await fetch("/api/academy/admin/courses", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCourse),
            });
            if (!res.ok) throw new Error("Failed to create course");
            setNewCourse({ title: "", description: "", subtitle: "", emoji: "📦", level: "Principiante", is_free: false });
            setShowForm(false);
            await fetchCourses(token);
        } catch (err: any) {
            setError(err.message);
        }
        setCreating(false);
    };

    const seedOriginalCourse = async () => {
        if (!confirm("¿Migrar el curso original 'Cómo Importar desde China 2026' a la base de datos? Esto creará el curso con todos sus módulos, lecciones y quizzes.")) return;
        setSeeding(true);
        try {
            const res = await fetch("/api/academy/admin/seed-course", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error seeding");
            await fetchCourses(token);
        } catch (err: any) {
            setError(err.message);
        }
        setSeeding(false);
    };

    const togglePublish = async (course: CourseRow) => {
        if (course.published) {
            if (!confirm("¿Despublicar este curso? Los alumnos no podrán verlo, pero NO se borra. Podés volver a publicarlo cuando quieras.")) return;
        } else {
            if (!confirm("¿Publicar este curso? Los alumnos lo verán inmediatamente.")) return;
        }
        await fetch(`/api/academy/admin/courses/${course.id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ published: !course.published }),
        });
        await fetchCourses(token);
    };

    const deleteCourse = async (id: string) => {
        if (!confirm("¿Eliminar este curso? Se borrarán todos sus módulos, lecciones y quizzes.")) return;
        await fetch(`/api/academy/admin/courses/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        await fetchCourses(token);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                    <Link href="/academy/admin" className="hover:text-white transition-colors">Admin</Link>
                    <span>/</span>
                    <span className="text-white">Cursos</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">📚 Gestión de Cursos</h1>
                        <p className="text-text-secondary text-sm">Creá, editá y publicá cursos para la plataforma</p>
                    </div>
                    <div className="flex gap-2">
                        {courses.length === 0 && (
                            <button
                                onClick={seedOriginalCourse}
                                disabled={seeding}
                                className="px-4 py-2.5 rounded-xl bg-amber-500/15 text-amber-400 font-semibold text-sm hover:bg-amber-500/25 transition-colors disabled:opacity-60"
                            >
                                {seeding ? "Migrando..." : "📥 Migrar Curso Original"}
                            </button>
                        )}
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-5 py-2.5 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity btn-glow"
                        >
                            + Nuevo Curso
                        </button>
                    </div>
                </div>

                {/* DB Status */}
                {dbReady === false && (
                    <div className="glass-card p-6 border-l-4 border-l-amber-500 mb-6">
                        <h3 className="text-amber-400 font-bold text-sm mb-2">⚠️ Base de datos no configurada</h3>
                        <p className="text-text-secondary text-sm mb-3">
                            Las tablas necesarias no existen todavía. Ejecutá el SQL en tu panel de Supabase:
                        </p>
                        <Link href="/academy/admin" className="text-accent text-sm hover:underline">
                            Ir al panel admin → Setup DB
                        </Link>
                    </div>
                )}

                {error && (
                    <div className="glass-card p-4 border-l-4 border-l-red-500 mb-6">
                        <p className="text-red-400 text-sm">Error: {error}</p>
                        <button onClick={() => setError("")} className="text-text-muted text-xs mt-1 hover:text-white">Cerrar</button>
                    </div>
                )}

                {/* New Course Form */}
                {showForm && (
                    <form onSubmit={handleCreate} className="glass-card p-6 mb-8 animate-slide-up space-y-4">
                        <h3 className="text-white font-bold mb-2">Nuevo curso</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Título del curso *"
                                value={newCourse.title}
                                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Subtítulo"
                                value={newCourse.subtitle}
                                onChange={(e) => setNewCourse({ ...newCourse, subtitle: e.target.value })}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                        <textarea
                            placeholder="Descripción del curso"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none resize-none"
                        />
                        <div className="grid sm:grid-cols-3 gap-4">
                            <input
                                type="text"
                                placeholder="Emoji (📦)"
                                value={newCourse.emoji}
                                onChange={(e) => setNewCourse({ ...newCourse, emoji: e.target.value })}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none"
                            />
                            <select
                                value={newCourse.level}
                                onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none appearance-none"
                            >
                                <option value="Principiante" className="bg-gray-900">Principiante</option>
                                <option value="Intermedio" className="bg-gray-900">Intermedio</option>
                                <option value="Avanzado" className="bg-gray-900">Avanzado</option>
                            </select>
                            <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newCourse.is_free}
                                    onChange={(e) => setNewCourse({ ...newCourse, is_free: e.target.checked })}
                                    className="w-4 h-4 rounded accent-primary"
                                />
                                Curso gratuito
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={creating}
                                className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                            >
                                {creating ? "Creando..." : "Crear Curso"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 rounded-xl glass text-text-secondary text-sm hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* Courses List */}
                <div className="space-y-4">
                    {courses.length === 0 && !error && (
                        <div className="glass-card p-12 text-center">
                            <div className="text-4xl mb-4">📚</div>
                            <p className="text-text-secondary text-sm">
                                No hay cursos creados. Creá el primero con el botón de arriba.
                            </p>
                        </div>
                    )}

                    {courses.map((course) => {
                        const moduleCount = course.modules?.length || 0;
                        const lessonCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;
                        const quizCount = course.modules?.reduce((sum: number, m: any) => sum + (m.quiz_questions?.length || 0), 0) || 0;

                        return (
                            <div key={course.id} className="glass-card overflow-hidden">
                                <div className="p-6 flex items-start gap-4">
                                    <div className="text-3xl">{course.emoji}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-white font-bold text-lg truncate">{course.title}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${course.published
                                                ? "bg-success/15 text-success"
                                                : "bg-amber-500/15 text-amber-400"
                                                }`}>
                                                {course.published ? "Publicado" : "Borrador"}
                                            </span>
                                            {course.is_free && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-medium">
                                                    Gratis
                                                </span>
                                            )}
                                        </div>
                                        {course.subtitle && (
                                            <p className="text-accent text-xs mb-1">{course.subtitle}</p>
                                        )}
                                        <p className="text-text-muted text-sm truncate">{course.description}</p>
                                        <div className="flex items-center gap-4 mt-3 text-text-muted text-xs">
                                            <span>📦 {moduleCount} módulos</span>
                                            <span>🎬 {lessonCount} lecciones</span>
                                            <span>🧠 {quizCount} preguntas</span>
                                            <span>📊 {course.level}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={`/academy/admin/courses/${course.id}`}
                                            className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                                        >
                                            ✏️ Editar
                                        </Link>
                                        <button
                                            onClick={() => togglePublish(course)}
                                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${course.published
                                                ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                                                : "bg-success/15 text-success hover:bg-success/25"
                                                }`}
                                        >
                                            {course.published ? "Despublicar" : "Publicar"}
                                        </button>
                                        <button
                                            onClick={() => deleteCourse(course.id)}
                                            className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 text-xs font-semibold hover:bg-red-500/25 transition-colors"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}
