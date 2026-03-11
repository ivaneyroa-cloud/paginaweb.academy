"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";

const ADMIN_EMAILS = ["ivaneyroa@shippar.net", "abaleani@shippar.net"];

interface UserRow {
    id: string; email: string; name: string; created_at: string; last_sign_in: string;
    provider: string; completedLessons: number; passedQuizzes: number; xp: number;
    lastActivity: string | null; courseComplete: boolean; progressPercent: number;
}

interface CourseStats {
    id: string; title: string; published: boolean; modules: number; lessons: number;
    quizzes: number; moduleNames: string[];
}

interface AnalyticsData {
    totalUsers: number; todaySignups: number; weekSignups: number; monthSignups: number;
    activeUsers: number; usersStarted: number; usersCompleted: number;
    avgProgress: number; totalXPEarned: number;
    signupTrend: { date: string; count: number }[];
    courseStats: CourseStats[];
    userList: UserRow[];
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name" | "xp" | "progress">("newest");
    const [filterBy, setFilterBy] = useState<"all" | "started" | "completed" | "inactive">("all");
    const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses">("overview");

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: any, session: any) => {
                if (!session) { router.push("/academy/login"); return; }
                if (!ADMIN_EMAILS.includes(session.user.email?.toLowerCase() || "")) {
                    router.push("/academy/dashboard"); return;
                }
                setToken(session.access_token);
                await fetchAnalytics(session.access_token);
                setLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    const fetchAnalytics = async (t: string) => {
        try {
            const res = await fetch("/api/academy/admin/analytics", { headers: { Authorization: `Bearer ${t}` } });
            if (!res.ok) throw new Error("Failed to load analytics");
            setData(await res.json());
        } catch (err: any) { setError(err.message); }
    };

    if (loading) {
        return (<div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>);
    }

    const timeAgo = (d: string) => {
        if (!d) return "—";
        const diff = Date.now() - new Date(d).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `hace ${mins}m`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `hace ${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `hace ${days}d`;
        return `hace ${Math.floor(days / 30)}mes`;
    };

    const formatDate = (d: string) => {
        if (!d) return "—";
        return new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
    };

    // Filter & sort users
    const filteredUsers = (data?.userList || [])
        .filter((u) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!u.email.toLowerCase().includes(q) && !u.name.toLowerCase().includes(q)) return false;
            }
            if (filterBy === "started") return u.completedLessons > 0 && !u.courseComplete;
            if (filterBy === "completed") return u.courseComplete;
            if (filterBy === "inactive") return u.completedLessons === 0;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            if (sortBy === "name") return a.name.localeCompare(b.name);
            if (sortBy === "xp") return b.xp - a.xp;
            if (sortBy === "progress") return b.progressPercent - a.progressPercent;
            return 0;
        });

    // Signup chart data
    const maxSignup = Math.max(...(data?.signupTrend || []).map((d) => d.count), 1);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 pt-24 pb-16">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-text-muted mb-6">
                    <Link href="/academy/admin" className="hover:text-white transition-colors">Admin</Link>
                    <span>/</span>
                    <span className="text-white">Analytics</span>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">📊 Analytics</h1>
                        <p className="text-text-secondary text-sm">Seguimiento completo de usuarios y progreso</p>
                    </div>
                    <button onClick={() => fetchAnalytics(token)}
                        className="px-4 py-2 rounded-xl glass text-text-secondary text-sm hover:text-white transition-colors">
                        🔄 Actualizar
                    </button>
                </div>

                {error && (
                    <div className="glass-card p-4 border-l-4 border-l-red-500 mb-6">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {data && (
                    <>
                        {/* ═══ TOP STATS ═══ */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                            {[
                                { label: "Total Usuarios", value: data.totalUsers, color: "text-white", bg: "bg-accent/10" },
                                { label: "Activos (7d)", value: data.activeUsers, color: "text-accent", bg: "bg-accent/10" },
                                { label: "Empezaron Curso", value: data.usersStarted, color: "text-primary", bg: "bg-primary/10" },
                                { label: "Completaron", value: data.usersCompleted, color: "text-success", bg: "bg-success/10" },
                                { label: "Registros Hoy", value: data.todaySignups, color: "text-amber-400", bg: "bg-amber-500/10" },
                                { label: "Esta Semana", value: data.weekSignups, color: "text-cyan-400", bg: "bg-cyan-500/10" },
                            ].map((stat) => (
                                <div key={stat.label} className="glass-card p-4 relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 w-16 h-16 ${stat.bg} rounded-full blur-[25px]`} />
                                    <div className="relative z-10">
                                        <div className="text-text-muted text-[10px] font-medium uppercase tracking-wider mb-1">{stat.label}</div>
                                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ═══ KEY METRICS ═══ */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            {/* Completion Funnel */}
                            <div className="glass-card p-5">
                                <h3 className="text-white font-bold text-sm mb-3">🎯 Funnel de Conversión</h3>
                                <div className="space-y-3">
                                    {[
                                        { label: "Registrados", value: data.totalUsers, pct: 100, color: "bg-accent" },
                                        { label: "Empezaron", value: data.usersStarted, pct: data.totalUsers > 0 ? Math.round((data.usersStarted / data.totalUsers) * 100) : 0, color: "bg-primary" },
                                        { label: "Completaron", value: data.usersCompleted, pct: data.totalUsers > 0 ? Math.round((data.usersCompleted / data.totalUsers) * 100) : 0, color: "bg-success" },
                                    ].map((step) => (
                                        <div key={step.label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-text-secondary">{step.label}</span>
                                                <span className="text-text-muted">{step.value} ({step.pct}%)</span>
                                            </div>
                                            <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden">
                                                <div className={`h-full rounded-full ${step.color} transition-all`} style={{ width: `${step.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Distribution */}
                            <div className="glass-card p-5">
                                <h3 className="text-white font-bold text-sm mb-3">📈 Progreso Promedio</h3>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="relative w-24 h-24">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                                            <circle cx="18" cy="18" r="15.915" fill="none" stroke="url(#grad)" strokeWidth="3"
                                                strokeDasharray={`${data.avgProgress} ${100 - data.avgProgress}`} strokeLinecap="round" />
                                            <defs><linearGradient id="grad"><stop offset="0%" stopColor="#6366f1" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-white text-lg font-bold">{data.avgProgress}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-text-muted text-xs">XP total generado</p>
                                    <p className="text-xp-gold font-bold text-lg">{data.totalXPEarned} XP</p>
                                </div>
                            </div>

                            {/* Mini Signup Chart */}
                            <div className="glass-card p-5">
                                <h3 className="text-white font-bold text-sm mb-3">📅 Registros (14 días)</h3>
                                <div className="flex items-end gap-1 h-20">
                                    {data.signupTrend.map((d, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1" title={`${d.date}: ${d.count} registros`}>
                                            <div className="w-full rounded-t gradient-bg transition-all hover:opacity-80"
                                                style={{ height: `${Math.max((d.count / maxSignup) * 100, 4)}%`, minHeight: "3px" }} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1 text-text-muted text-[9px]">
                                    <span>{data.signupTrend[0]?.date.split("-").slice(1).join("/")}</span>
                                    <span>Hoy</span>
                                </div>
                                <p className="text-text-muted text-[10px] text-center mt-2">
                                    {data.monthSignups} registros en 30 días
                                </p>
                            </div>
                        </div>

                        {/* ═══ TABS ═══ */}
                        <div className="flex gap-2 mb-6">
                            {[
                                { id: "overview" as const, label: "📊 Resumen" },
                                { id: "users" as const, label: `👥 Usuarios (${data.totalUsers})` },
                                { id: "courses" as const, label: `📚 Cursos (${data.courseStats.length})` },
                            ].map((tab) => (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? "gradient-bg text-white" : "glass text-text-secondary hover:text-white"}`}>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* ═══ OVERVIEW TAB ═══ */}
                        {activeTab === "overview" && (
                            <div className="space-y-6">
                                {/* Users who completed course */}
                                <div className="glass-card overflow-hidden">
                                    <div className="p-5 border-b border-border-dark">
                                        <h2 className="text-white font-bold">🏆 Alumnos que Completaron el Curso</h2>
                                    </div>
                                    {data.userList.filter(u => u.courseComplete).length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-text-muted text-sm">Todavía ningún alumno completó el curso</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border-dark/50">
                                            {data.userList.filter(u => u.courseComplete).map((u) => (
                                                <div key={u.id} className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center text-success text-sm font-bold">✓</div>
                                                        <div>
                                                            <p className="text-white text-sm font-medium">{u.name}</p>
                                                            <p className="text-text-muted text-xs">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs">
                                                        <span className="text-xp-gold font-bold">{u.xp} XP</span>
                                                        <span className="text-success px-2 py-0.5 rounded-full bg-success/15">100% ✓</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Users in progress */}
                                <div className="glass-card overflow-hidden">
                                    <div className="p-5 border-b border-border-dark">
                                        <h2 className="text-white font-bold">📖 Alumnos en Progreso</h2>
                                    </div>
                                    {data.userList.filter(u => u.completedLessons > 0 && !u.courseComplete).length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-text-muted text-sm">Ningún alumno en progreso actualmente</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border-dark/50">
                                            {data.userList.filter(u => u.completedLessons > 0 && !u.courseComplete).sort((a, b) => b.progressPercent - a.progressPercent).map((u) => (
                                                <div key={u.id} className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-white text-sm font-medium truncate">{u.name}</p>
                                                            <p className="text-text-muted text-xs">{u.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-24">
                                                            <div className="flex justify-between text-[10px] text-text-muted mb-0.5">
                                                                <span>{u.completedLessons} lecciones</span>
                                                                <span>{u.progressPercent}%</span>
                                                            </div>
                                                            <div className="w-full h-1.5 rounded-full bg-border-dark overflow-hidden">
                                                                <div className="h-full rounded-full gradient-bg" style={{ width: `${u.progressPercent}%` }} />
                                                            </div>
                                                        </div>
                                                        <span className="text-xp-gold text-xs font-bold w-12 text-right">{u.xp} XP</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Inactive users */}
                                <div className="glass-card overflow-hidden">
                                    <div className="p-5 border-b border-border-dark flex items-center justify-between">
                                        <h2 className="text-white font-bold">😴 Registrados sin Actividad</h2>
                                        <span className="text-text-muted text-xs">{data.userList.filter(u => u.completedLessons === 0).length} usuarios</span>
                                    </div>
                                    <div className="divide-y divide-border-dark/50 max-h-[300px] overflow-y-auto">
                                        {data.userList.filter(u => u.completedLessons === 0).map((u) => (
                                            <div key={u.id} className="px-5 py-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-text-muted text-xs">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-text-secondary text-sm">{u.name}</p>
                                                        <p className="text-text-muted text-[10px]">{u.email}</p>
                                                    </div>
                                                </div>
                                                <span className="text-text-muted text-xs">Registrado {timeAgo(u.created_at)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ═══ USERS TAB ═══ */}
                        {activeTab === "users" && (
                            <div className="glass-card overflow-hidden">
                                <div className="p-5 border-b border-border-dark flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-2">
                                        {[
                                            { id: "all" as const, label: "Todos" },
                                            { id: "started" as const, label: "En Progreso" },
                                            { id: "completed" as const, label: "Completados" },
                                            { id: "inactive" as const, label: "Inactivos" },
                                        ].map((f) => (
                                            <button key={f.id} onClick={() => setFilterBy(f.id)}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filterBy === f.id ? "gradient-bg text-white" : "bg-white/5 text-text-muted hover:text-white"}`}>
                                                {f.label}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="text" placeholder="🔍 Buscar..." value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-border-dark text-white text-xs focus:border-primary focus:outline-none w-48" />
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-border-dark text-white text-xs focus:border-primary focus:outline-none">
                                            <option value="newest">Más recientes</option>
                                            <option value="oldest">Más antiguos</option>
                                            <option value="name">Por nombre</option>
                                            <option value="xp">Por XP</option>
                                            <option value="progress">Por progreso</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Header */}
                                <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2 text-text-muted text-[10px] font-medium uppercase tracking-wider border-b border-border-dark/50">
                                    <div className="col-span-3">Usuario</div>
                                    <div className="col-span-2">Email</div>
                                    <div className="col-span-1">Registrado</div>
                                    <div className="col-span-2">Progreso</div>
                                    <div className="col-span-1">XP</div>
                                    <div className="col-span-1">Quizzes</div>
                                    <div className="col-span-1">Último Login</div>
                                    <div className="col-span-1">Estado</div>
                                </div>

                                <div className="divide-y divide-border-dark/50 max-h-[600px] overflow-y-auto">
                                    {filteredUsers.map((user) => (
                                        <div key={user.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-5 py-3 hover:bg-white/3 transition-colors items-center text-xs">
                                            <div className="col-span-3 flex items-center gap-2">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${user.courseComplete ? "bg-success" : user.completedLessons > 0 ? "gradient-bg" : "bg-white/10"}`}>
                                                    {user.courseComplete ? "✓" : user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-white truncate">{user.name}</span>
                                            </div>
                                            <div className="col-span-2 text-text-muted truncate">{user.email}</div>
                                            <div className="col-span-1 text-text-muted">{timeAgo(user.created_at)}</div>
                                            <div className="col-span-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-1.5 rounded-full bg-border-dark overflow-hidden">
                                                        <div className={`h-full rounded-full ${user.courseComplete ? "bg-success" : "gradient-bg"}`}
                                                            style={{ width: `${user.progressPercent}%` }} />
                                                    </div>
                                                    <span className="text-text-muted text-[10px] w-8">{user.progressPercent}%</span>
                                                </div>
                                            </div>
                                            <div className="col-span-1 text-xp-gold font-medium">{user.xp}</div>
                                            <div className="col-span-1 text-text-muted">{user.passedQuizzes}</div>
                                            <div className="col-span-1 text-text-muted">{user.last_sign_in ? timeAgo(user.last_sign_in) : "—"}</div>
                                            <div className="col-span-1">
                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${user.courseComplete ? "bg-success/15 text-success" :
                                                        user.completedLessons > 0 ? "bg-primary/15 text-primary" :
                                                            "bg-white/5 text-text-muted"
                                                    }`}>
                                                    {user.courseComplete ? "Completó" : user.completedLessons > 0 ? "En curso" : "Inactivo"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {filteredUsers.length === 0 && (
                                    <div className="p-10 text-center"><p className="text-text-muted text-sm">No se encontraron usuarios</p></div>
                                )}
                            </div>
                        )}

                        {/* ═══ COURSES TAB ═══ */}
                        {activeTab === "courses" && (
                            <div className="space-y-4">
                                {data.courseStats.map((c) => (
                                    <div key={c.id} className="glass-card overflow-hidden">
                                        <div className="p-5 flex items-center justify-between">
                                            <div>
                                                <h3 className="text-white font-bold text-sm">{c.title}</h3>
                                                <div className="flex items-center gap-4 text-text-muted text-xs mt-1">
                                                    <span>📦 {c.modules} módulos</span>
                                                    <span>🎬 {c.lessons} lecciones</span>
                                                    <span>🧠 {c.quizzes} preguntas</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.published ? "bg-success/15 text-success" : "bg-amber-500/15 text-amber-400"}`}>
                                                    {c.published ? "Publicado" : "Borrador"}
                                                </span>
                                                <Link href={`/admin/courses/${c.id}`} className="text-accent text-xs hover:underline">Editar →</Link>
                                            </div>
                                        </div>
                                        {c.moduleNames.length > 0 && (
                                            <div className="px-5 pb-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {c.moduleNames.map((name: string, i: number) => (
                                                        <span key={i} className="px-2 py-1 rounded-lg bg-white/5 text-text-muted text-[10px]">
                                                            {i + 1}. {name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
