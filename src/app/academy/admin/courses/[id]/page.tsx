"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["ivaneyroa@shippar.net", "abaleani@shippar.net"];

interface Lesson {
    id: string;
    title: string;
    youtube_url: string;
    duration: string;
    xp_reward: number;
    order_index: number;
    notes: string[];
    guide: { title: string; content: string }[];
    action_links: { label: string; url: string; emoji: string }[];
}

interface QuizQuestion {
    id: string;
    type: string;
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
    xp: number;
    order_index: number;
}

interface Module {
    id: string;
    title: string;
    order_index: number;
    lessons: Lesson[];
    quiz_questions: QuizQuestion[];
}

interface Course {
    id: string;
    title: string;
    description: string;
    subtitle: string;
    emoji: string;
    level: string;
    is_free: boolean;
    published: boolean;
    modules: Module[];
}

type LessonFormData = {
    title: string; youtube_url: string; duration: string; xp_reward: number;
    notes: string[];
    guide: { title: string; content: string }[];
    action_links: { label: string; url: string; emoji: string }[];
};

const EMPTY_LESSON: LessonFormData = {
    title: "", youtube_url: "", duration: "3 min", xp_reward: 15,
    notes: ["", "", "", "", ""],
    guide: [{ title: "", content: "" }],
    action_links: [{ label: "", url: "", emoji: "🔗" }],
};

export default function CourseEditorPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState<Course | null>(null);
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // Module form
    const [addingModule, setAddingModule] = useState(false);
    const [newModuleTitle, setNewModuleTitle] = useState("");

    // Lesson form (add new)
    const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
    const [lessonStep, setLessonStep] = useState(1);
    const [newLesson, setNewLesson] = useState<LessonFormData>({ ...EMPTY_LESSON });

    // Lesson edit (existing)
    const [editingLesson, setEditingLesson] = useState<string | null>(null);
    const [editLessonStep, setEditLessonStep] = useState(1);
    const [editLessonData, setEditLessonData] = useState<LessonFormData>({ ...EMPTY_LESSON });

    // Quiz form
    const [addingQuizTo, setAddingQuizTo] = useState<string | null>(null);
    const [newQuestion, setNewQuestion] = useState({
        question: "", options: ["", "", "", ""], correct_index: 0, explanation: "", xp: 10,
    });

    // Expand lesson detail
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!session) { router.push("/academy/login"); return; }
                if (!ADMIN_EMAILS.includes(session.user.email?.toLowerCase() || "")) {
                    router.push("/academy/dashboard"); return;
                }
                setUser(session.user);
                setToken(session.access_token);
                await fetchCourse(session.access_token);
                setLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, [router, courseId]);

    const fetchCourse = async (t: string) => {
        try {
            const res = await fetch(`/api/academy/admin/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${t}` },
            });
            if (!res.ok) throw new Error("Course not found");
            const data = await res.json();
            setCourse(data.course);
        } catch (err: any) { setError(err.message); }
    };

    const showSuccess = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const resetLessonForm = () => { setNewLesson({ ...EMPTY_LESSON, notes: ["", "", "", "", ""], guide: [{ title: "", content: "" }], action_links: [{ label: "", url: "", emoji: "🔗" }] }); setLessonStep(1); };

    // ─── MODULE CRUD ───
    const addModule = async () => {
        if (!newModuleTitle.trim()) return;
        setSaving(true);
        await fetch("/api/academy/admin/modules", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ course_id: courseId, title: newModuleTitle.trim(), order_index: (course?.modules?.length || 0) }),
        });
        setNewModuleTitle(""); setAddingModule(false);
        await fetchCourse(token); setSaving(false);
    };

    const deleteModule = async (moduleId: string) => {
        if (!confirm("¿Eliminar este módulo y todo su contenido?")) return;
        await fetch(`/api/academy/admin/modules?id=${moduleId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        await fetchCourse(token);
    };

    // ─── LESSON CRUD ───
    const addLesson = async (moduleId: string) => {
        if (!newLesson.title.trim()) return;
        setSaving(true);
        const mod = course?.modules.find((m) => m.id === moduleId);
        const cleanNotes = newLesson.notes.filter((n) => n.trim());
        const cleanGuide = newLesson.guide.filter((g) => g.title.trim() || g.content.trim());
        const cleanLinks = newLesson.action_links.filter((l) => l.label.trim() && l.url.trim());
        const res = await fetch("/api/academy/admin/lessons", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                module_id: moduleId, title: newLesson.title, youtube_url: newLesson.youtube_url,
                duration: newLesson.duration, xp_reward: newLesson.xp_reward,
                notes: cleanNotes, guide: cleanGuide, action_links: cleanLinks,
                order_index: mod?.lessons?.length || 0,
            }),
        });
        if (res.ok) { resetLessonForm(); setAddingLessonTo(null); await fetchCourse(token); showSuccess("Lección creada ✅"); }
        setSaving(false);
    };

    const deleteLesson = async (lessonId: string) => {
        if (!confirm("¿Eliminar esta lección?")) return;
        await fetch(`/api/academy/admin/lessons?id=${lessonId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        await fetchCourse(token);
    };

    // ─── LESSON EDIT ───
    const startEditingLesson = (lesson: Lesson) => {
        setEditingLesson(lesson.id);
        setEditLessonStep(1);
        setEditLessonData({
            title: lesson.title,
            youtube_url: lesson.youtube_url || "",
            duration: lesson.duration || "3 min",
            xp_reward: lesson.xp_reward || 15,
            notes: lesson.notes?.length > 0 ? [...lesson.notes] : [""],
            guide: lesson.guide?.length > 0 ? lesson.guide.map(g => ({ ...g })) : [{ title: "", content: "" }],
            action_links: lesson.action_links?.length > 0 ? lesson.action_links.map(l => ({ ...l })) : [{ label: "", url: "", emoji: "🔗" }],
        });
        setExpandedLesson(null);
    };

    const saveEditedLesson = async (lessonId: string) => {
        setSaving(true);
        const cleanNotes = editLessonData.notes.filter((n) => n.trim());
        const cleanGuide = editLessonData.guide.filter((g) => g.title.trim() || g.content.trim());
        const cleanLinks = editLessonData.action_links.filter((l) => l.label.trim() && l.url.trim());
        const res = await fetch(`/api/academy/admin/lessons?id=${lessonId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                title: editLessonData.title, youtube_url: editLessonData.youtube_url,
                duration: editLessonData.duration, xp_reward: editLessonData.xp_reward,
                notes: cleanNotes, guide: cleanGuide, action_links: cleanLinks,
            }),
        });
        if (res.ok) { setEditingLesson(null); await fetchCourse(token); showSuccess("Lección actualizada ✅"); }
        else { setError("Error al guardar"); }
        setSaving(false);
    };

    // ─── QUIZ CRUD ───
    const addQuizQuestion = async (moduleId: string) => {
        if (!newQuestion.question.trim()) return;
        const cleanOptions = newQuestion.options.filter((o) => o.trim());
        if (cleanOptions.length < 2) { setError("Mínimo 2 opciones"); return; }
        setSaving(true);
        const mod = course?.modules.find((m) => m.id === moduleId);
        const res = await fetch("/api/academy/admin/quiz-questions", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                module_id: moduleId, type: "choice", question: newQuestion.question,
                options: cleanOptions, correct_index: newQuestion.correct_index,
                explanation: newQuestion.explanation, xp: newQuestion.xp,
                order_index: mod?.quiz_questions?.length || 0,
            }),
        });
        if (res.ok) {
            setNewQuestion({ question: "", options: ["", "", "", ""], correct_index: 0, explanation: "", xp: 10 });
            setAddingQuizTo(null); await fetchCourse(token);
        }
        setSaving(false);
    };

    const deleteQuestion = async (questionId: string) => {
        if (!confirm("¿Eliminar esta pregunta?")) return;
        await fetch(`/api/academy/admin/quiz-questions?id=${questionId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        await fetchCourse(token);
    };

    const togglePublish = async () => {
        if (!course) return;
        if (course.published) {
            if (!confirm("¿Despublicar este curso? Los alumnos ya no podrán verlo, pero NO se borra. Podés volver a publicarlo en cualquier momento.")) return;
        } else {
            if (!confirm("¿Publicar este curso? Los alumnos podrán verlo inmediatamente.")) return;
        }
        await fetch(`/api/academy/admin/courses/${courseId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ published: !course.published }),
        });
        await fetchCourse(token);
        showSuccess(course.published ? "Curso despublicado (sigue en admin)" : "Curso publicado ✅");
    };

    // ─── FORM HELPERS (for both new and edit) ───
    const updateFormNotes = (form: LessonFormData, setForm: (f: LessonFormData) => void) => ({
        add: () => setForm({ ...form, notes: [...form.notes, ""] }),
        remove: (i: number) => setForm({ ...form, notes: form.notes.filter((_, idx) => idx !== i) }),
        update: (i: number, v: string) => { const n = [...form.notes]; n[i] = v; setForm({ ...form, notes: n }); },
    });
    const updateFormGuide = (form: LessonFormData, setForm: (f: LessonFormData) => void) => ({
        add: () => setForm({ ...form, guide: [...form.guide, { title: "", content: "" }] }),
        remove: (i: number) => setForm({ ...form, guide: form.guide.filter((_, idx) => idx !== i) }),
        update: (i: number, field: "title" | "content", v: string) => { const g = [...form.guide]; g[i] = { ...g[i], [field]: v }; setForm({ ...form, guide: g }); },
    });
    const updateFormLinks = (form: LessonFormData, setForm: (f: LessonFormData) => void) => ({
        add: () => setForm({ ...form, action_links: [...form.action_links, { label: "", url: "", emoji: "🔗" }] }),
        remove: (i: number) => setForm({ ...form, action_links: form.action_links.filter((_, idx) => idx !== i) }),
        update: (i: number, field: "label" | "url" | "emoji", v: string) => { const l = [...form.action_links]; l[i] = { ...l[i], [field]: v }; setForm({ ...form, action_links: l }); },
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-muted text-sm mb-4">Curso no encontrado</p>
                    <Link href="/academy/admin/courses" className="text-accent hover:underline text-sm">← Volver</Link>
                </div>
            </div>
        );
    }

    const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const totalQuestions = course.modules.reduce((sum, m) => sum + m.quiz_questions.length, 0);
    const inputClass = "px-3 py-2 rounded-lg bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none w-full";
    const textareaClass = "px-3 py-2 rounded-lg bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none w-full resize-none";

    // Render the lesson form (shared between add + edit)
    const renderLessonForm = (
        form: LessonFormData,
        setForm: (f: LessonFormData) => void,
        step: number,
        setStep: (n: number) => void,
        onSave: () => void,
        onCancel: () => void,
        saveLabel: string
    ) => {
        const notes = updateFormNotes(form, setForm);
        const guide = updateFormGuide(form, setForm);
        const links = updateFormLinks(form, setForm);

        return (
            <div className="mt-3 p-4 rounded-xl bg-white/5 border border-border-dark space-y-4 animate-slide-up">
                {/* Step tabs */}
                <div className="flex items-center gap-2 mb-2">
                    {[{ n: 1, label: "Básico" }, { n: 2, label: "Puntos Clave" }, { n: 3, label: "Guía" }, { n: 4, label: "Links" }].map((s) => (
                        <button key={s.n} onClick={() => setStep(s.n)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${step === s.n ? "gradient-bg text-white" : "bg-white/5 text-text-muted hover:text-white"}`}>
                            {s.n}. {s.label}
                        </button>
                    ))}
                </div>

                {step === 1 && (
                    <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                            <input type="text" placeholder="Título de la lección *" value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
                            <input type="text" placeholder="URL de YouTube" value={form.youtube_url}
                                onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Duración (3 min)" value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })} className={inputClass} />
                            <input type="number" placeholder="XP" value={form.xp_reward}
                                onChange={(e) => setForm({ ...form, xp_reward: parseInt(e.target.value) || 15 })} className={inputClass} />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-2">
                        <p className="text-text-muted text-xs">📝 Aparecen en el sidebar derecho de la lección</p>
                        {form.notes.map((note, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-accent text-xs mt-2 w-5 text-center shrink-0">{i + 1}</span>
                                <input type="text" placeholder={`Punto clave ${i + 1}`} value={note}
                                    onChange={(e) => notes.update(i, e.target.value)} className={inputClass} />
                                <button onClick={() => notes.remove(i)} className="text-red-400/40 hover:text-red-400 text-xs shrink-0">×</button>
                            </div>
                        ))}
                        <button onClick={notes.add} className="text-accent text-xs hover:underline">+ Agregar punto clave</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-3">
                        <p className="text-text-muted text-xs">📖 Secciones expandibles. Cada una tiene título + contenido largo</p>
                        {form.guide.map((section, i) => (
                            <div key={i} className="p-3 rounded-lg bg-white/5 border border-border-dark/50 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-text-muted text-xs font-medium">Sección {i + 1}</span>
                                    <button onClick={() => guide.remove(i)} className="text-red-400/40 hover:text-red-400 text-xs">×</button>
                                </div>
                                <input type="text" placeholder={`Título de la sección`} value={section.title}
                                    onChange={(e) => guide.update(i, "title", e.target.value)} className={inputClass} />
                                <textarea placeholder="Contenido de la sección..." value={section.content} rows={4}
                                    onChange={(e) => guide.update(i, "content", e.target.value)} className={textareaClass} />
                            </div>
                        ))}
                        <button onClick={guide.add} className="text-accent text-xs hover:underline">+ Agregar sección</button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-2">
                        <p className="text-text-muted text-xs">🔗 Links que aparecen en el sidebar como "Links Útiles"</p>
                        {form.action_links.map((link, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input type="text" placeholder="Emoji" value={link.emoji} style={{ width: "50px" }}
                                    onChange={(e) => links.update(i, "emoji", e.target.value)} className={inputClass} />
                                <input type="text" placeholder="Label" value={link.label}
                                    onChange={(e) => links.update(i, "label", e.target.value)} className={inputClass} />
                                <input type="text" placeholder="URL (https://...)" value={link.url}
                                    onChange={(e) => links.update(i, "url", e.target.value)} className={inputClass} />
                                <button onClick={() => links.remove(i)} className="text-red-400/40 hover:text-red-400 text-xs shrink-0">×</button>
                            </div>
                        ))}
                        <button onClick={links.add} className="text-accent text-xs hover:underline">+ Agregar link</button>
                    </div>
                )}

                {/* Nav + Submit */}
                <div className="flex items-center justify-between pt-2 border-t border-border-dark/50">
                    <div>{step > 1 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 rounded-lg glass text-text-muted text-xs hover:text-white">← Anterior</button>}</div>
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-4 py-2 rounded-lg glass text-text-muted text-xs hover:text-white">Cancelar</button>
                        {step < 4 ? (
                            <button onClick={() => setStep(step + 1)} className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-semibold">Siguiente →</button>
                        ) : (
                            <button onClick={onSave} disabled={saving || !form.title.trim()}
                                className="px-5 py-2 rounded-lg gradient-bg text-white text-xs font-semibold disabled:opacity-60">
                                {saving ? "Guardando..." : saveLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                    <Link href="/academy/admin" className="hover:text-white transition-colors">Admin</Link>
                    <span>/</span>
                    <Link href="/academy/admin/courses" className="hover:text-white transition-colors">Cursos</Link>
                    <span>/</span>
                    <span className="text-white truncate max-w-[200px]">{course.title}</span>
                </div>

                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div className="flex items-start gap-4">
                        <span className="text-4xl">{course.emoji}</span>
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">{course.title}</h1>
                            {course.subtitle && <p className="text-accent text-sm">{course.subtitle}</p>}
                            <div className="flex items-center gap-3 mt-2 text-text-muted text-xs">
                                <span>📦 {course.modules.length} módulos</span>
                                <span>🎬 {totalLessons} lecciones</span>
                                <span>🧠 {totalQuestions} preguntas</span>
                                <span className={`px-2 py-0.5 rounded-full ${course.published ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-400"}`}>
                                    {course.published ? "Publicado" : "Borrador"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={togglePublish} className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${course.published ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25" : "bg-success/15 text-success hover:bg-success/25"}`}>
                        {course.published ? "⏸ Despublicar" : "📤 Publicar Curso"}
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div className="glass-card p-4 border-l-4 border-l-red-500 mb-6 flex items-center justify-between">
                        <p className="text-red-400 text-sm">{error}</p>
                        <button onClick={() => setError("")} className="text-text-muted text-xs hover:text-white">×</button>
                    </div>
                )}
                {successMsg && (
                    <div className="glass-card p-4 border-l-4 border-l-success mb-6">
                        <p className="text-success text-sm">{successMsg}</p>
                    </div>
                )}

                {/* ═══ MODULES ═══ */}
                <div className="space-y-6">
                    {course.modules.map((mod, mi) => (
                        <div key={mod.id} className="glass-card overflow-hidden">
                            {/* Module Header */}
                            <div className="p-5 border-b border-border-dark flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold">{mi + 1}</div>
                                    <h3 className="text-white font-bold">{mod.title}</h3>
                                    <span className="text-text-muted text-xs">{mod.lessons.length} lecciones · {mod.quiz_questions.length} preguntas</span>
                                </div>
                                <button onClick={() => deleteModule(mod.id)} className="text-red-400/60 hover:text-red-400 text-xs transition-colors">🗑 Eliminar</button>
                            </div>

                            {/* ─── LESSONS ─── */}
                            <div className="p-5 border-b border-border-dark/50">
                                <h4 className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">🎬 Lecciones</h4>
                                {mod.lessons.length === 0 ? (
                                    <p className="text-text-muted text-xs italic">Sin lecciones aún</p>
                                ) : (
                                    <div className="space-y-2">
                                        {mod.lessons.map((lesson, li) => (
                                            <div key={lesson.id}>
                                                {/* Lesson row */}
                                                {editingLesson !== lesson.id && (
                                                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 cursor-pointer hover:bg-white/8 transition-colors"
                                                        onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}>
                                                        <div className="flex items-center gap-3 flex-wrap">
                                                            <span className="text-text-muted text-xs w-6 text-center">{li + 1}</span>
                                                            <span className="text-white text-sm">{lesson.title}</span>
                                                            {lesson.youtube_url && <span className="text-red-400 text-[10px]">▶ YouTube</span>}
                                                            {(lesson.notes?.length > 0) && <span className="text-accent text-[10px]">📝 {lesson.notes.length}</span>}
                                                            {(lesson.guide?.length > 0) && <span className="text-primary text-[10px]">📖 {lesson.guide.length}</span>}
                                                            {(lesson.action_links?.length > 0) && <span className="text-emerald-400 text-[10px]">🔗 {lesson.action_links.length}</span>}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-text-muted text-xs">{lesson.duration}</span>
                                                            <span className="text-xp-gold text-xs">+{lesson.xp_reward} XP</span>
                                                            <button onClick={(e) => { e.stopPropagation(); startEditingLesson(lesson); }}
                                                                className="px-3 py-1.5 rounded-lg bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition-colors">✏️ Editar</button>
                                                            <button onClick={(e) => { e.stopPropagation(); deleteLesson(lesson.id); }}
                                                                className="px-2 py-1.5 rounded-lg bg-red-500/10 text-red-400/60 hover:text-red-400 text-xs transition-colors">🗑</button>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Expanded detail view */}
                                                {expandedLesson === lesson.id && editingLesson !== lesson.id && (
                                                    <div className="ml-9 mt-2 p-4 rounded-xl bg-white/3 border border-border-dark/50 space-y-4 animate-slide-up">
                                                        {/* Edit button at top */}
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-text-muted text-[10px] uppercase tracking-wider">Detalle de la lección</span>
                                                            <button onClick={() => startEditingLesson(lesson)}
                                                                className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-all">
                                                                ✏️ Modificar Lección
                                                            </button>
                                                        </div>
                                                        {lesson.youtube_url && (
                                                            <div>
                                                                <label className="text-text-muted text-[10px] uppercase tracking-wider">YouTube URL</label>
                                                                <p className="text-accent text-xs break-all">{lesson.youtube_url}</p>
                                                            </div>
                                                        )}
                                                        {lesson.notes?.length > 0 && (
                                                            <div>
                                                                <label className="text-text-muted text-[10px] uppercase tracking-wider">Puntos Clave ({lesson.notes.length})</label>
                                                                <ul className="mt-1 space-y-1">
                                                                    {lesson.notes.map((n: string, i: number) => (
                                                                        <li key={i} className="text-text-secondary text-xs flex gap-2">
                                                                            <span className="text-accent shrink-0">{i + 1}.</span> {n}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                        {lesson.guide?.length > 0 && (
                                                            <div>
                                                                <label className="text-text-muted text-[10px] uppercase tracking-wider">Guía ({lesson.guide.length} secciones)</label>
                                                                <div className="mt-1 space-y-2">
                                                                    {lesson.guide.map((g: any, i: number) => (
                                                                        <div key={i} className="p-2 rounded-lg bg-white/5">
                                                                            <p className="text-white text-xs font-medium">{g.title}</p>
                                                                            <p className="text-text-muted text-[10px] line-clamp-2 mt-1">{g.content?.slice(0, 120)}...</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {lesson.action_links?.length > 0 && (
                                                            <div>
                                                                <label className="text-text-muted text-[10px] uppercase tracking-wider">Links Útiles</label>
                                                                <div className="mt-1 space-y-1">
                                                                    {lesson.action_links.map((l: any, i: number) => (
                                                                        <div key={i} className="flex items-center gap-2 text-xs">
                                                                            <span>{l.emoji}</span>
                                                                            <span className="text-white">{l.label}</span>
                                                                            <span className="text-accent">→ {l.url}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        <button onClick={() => startEditingLesson(lesson)}
                                                            className="mt-2 px-4 py-2 rounded-lg bg-accent/15 text-accent text-xs font-medium hover:bg-accent/25 transition-colors">
                                                            ✏️ Editar esta lección
                                                        </button>
                                                    </div>
                                                )}

                                                {/* Edit form for existing lesson */}
                                                {editingLesson === lesson.id && (
                                                    renderLessonForm(
                                                        editLessonData,
                                                        setEditLessonData,
                                                        editLessonStep,
                                                        setEditLessonStep,
                                                        () => saveEditedLesson(lesson.id),
                                                        () => setEditingLesson(null),
                                                        "💾 Guardar Cambios"
                                                    )
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add new lesson form */}
                                {addingLessonTo === mod.id && editingLesson === null ? (
                                    renderLessonForm(
                                        newLesson,
                                        setNewLesson,
                                        lessonStep,
                                        setLessonStep,
                                        () => addLesson(mod.id),
                                        () => { resetLessonForm(); setAddingLessonTo(null); },
                                        "✅ Crear Lección"
                                    )
                                ) : addingLessonTo !== mod.id && editingLesson === null && (
                                    <button onClick={() => { setAddingLessonTo(mod.id); setAddingQuizTo(null); resetLessonForm(); }}
                                        className="mt-3 text-accent text-xs hover:underline">+ Agregar lección</button>
                                )}
                            </div>

                            {/* ─── QUIZ QUESTIONS ─── */}
                            <div className="p-5">
                                <h4 className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">🧠 Quiz del Módulo</h4>
                                {mod.quiz_questions.length === 0 ? (
                                    <p className="text-text-muted text-xs italic">Sin preguntas aún</p>
                                ) : (
                                    <div className="space-y-2">
                                        {mod.quiz_questions.map((q, qi) => (
                                            <div key={q.id} className="p-3 rounded-xl bg-white/5">
                                                <div className="flex items-start justify-between">
                                                    <div><span className="text-text-muted text-xs mr-2">P{qi + 1}.</span><span className="text-white text-sm">{q.question}</span></div>
                                                    <button onClick={() => deleteQuestion(q.id)} className="text-red-400/40 hover:text-red-400 text-xs shrink-0 ml-2">×</button>
                                                </div>
                                                {q.options && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {q.options.map((opt: string, oi: number) => (
                                                            <span key={oi} className={`px-2 py-1 rounded-lg text-xs ${oi === q.correct_index ? "bg-success/15 text-success border border-success/20" : "bg-white/5 text-text-muted"}`}>
                                                                {String.fromCharCode(65 + oi)}) {opt}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                {q.explanation && <p className="text-text-muted text-[10px] mt-2 italic">💡 {q.explanation}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {addingQuizTo === mod.id ? (
                                    <div className="mt-3 p-4 rounded-xl bg-white/5 border border-border-dark space-y-3 animate-slide-up">
                                        <input type="text" placeholder="Pregunta *" value={newQuestion.question}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })} className={inputClass} />
                                        <div className="grid sm:grid-cols-2 gap-2">
                                            {newQuestion.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <button type="button" onClick={() => setNewQuestion({ ...newQuestion, correct_index: i })}
                                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${newQuestion.correct_index === i ? "border-success text-success bg-success/10" : "border-border-dark text-text-muted hover:border-accent"}`}>
                                                        {String.fromCharCode(65 + i)}
                                                    </button>
                                                    <input type="text" placeholder={`Opción ${String.fromCharCode(65 + i)}`} value={opt}
                                                        onChange={(e) => { const opts = [...newQuestion.options]; opts[i] = e.target.value; setNewQuestion({ ...newQuestion, options: opts }); }}
                                                        className={inputClass} />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-text-muted text-[10px]">Click en la letra = respuesta correcta (verde)</p>
                                        <input type="text" placeholder="Explicación (al contestar)" value={newQuestion.explanation}
                                            onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })} className={inputClass} />
                                        <div className="flex gap-2">
                                            <button onClick={() => addQuizQuestion(mod.id)} disabled={saving}
                                                className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-semibold disabled:opacity-60">
                                                {saving ? "..." : "Agregar Pregunta"}
                                            </button>
                                            <button onClick={() => setAddingQuizTo(null)}
                                                className="px-3 py-2 rounded-lg glass text-text-muted text-xs hover:text-white">Cancelar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => { setAddingQuizTo(mod.id); setAddingLessonTo(null); }}
                                        className="mt-3 text-accent text-xs hover:underline">+ Agregar pregunta de quiz</button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Module */}
                    {addingModule ? (
                        <div className="glass-card p-5 animate-slide-up">
                            <div className="flex gap-3">
                                <input type="text" placeholder="Nombre del módulo *" value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addModule()}
                                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white text-sm focus:border-primary focus:outline-none" autoFocus />
                                <button onClick={addModule} disabled={saving}
                                    className="px-5 py-3 rounded-xl gradient-bg text-white text-sm font-semibold disabled:opacity-60">
                                    {saving ? "..." : "Crear Módulo"}
                                </button>
                                <button onClick={() => setAddingModule(false)}
                                    className="px-4 py-3 rounded-xl glass text-text-muted text-sm hover:text-white">×</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setAddingModule(true)}
                            className="w-full py-4 rounded-xl glass border-2 border-dashed border-border-dark text-text-secondary hover:text-white hover:border-primary/50 transition-all text-sm font-medium">
                            + Agregar Módulo
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
}
