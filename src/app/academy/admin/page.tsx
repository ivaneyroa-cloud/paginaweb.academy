"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import type { User } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["ivaneyroa@shippar.net", "abaleani@shippar.net"];

interface AuthUser {
    id: string;
    email: string;
    fullName: string;
    createdAt: string;
    lastSignIn: string | null;
    provider: string;
}

export default function AdminPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"overview" | "users">("overview");

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!session) {
                    router.push("/academy/login");
                    return;
                }
                const u = session.user;
                if (!ADMIN_EMAILS.includes(u.email?.toLowerCase() || "")) {
                    router.push("/academy/dashboard");
                    return;
                }
                setUser(u);
                await fetchUsers(session.access_token);
                setLoading(false);
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    const fetchUsers = async (token: string) => {
        try {
            const res = await fetch("/api/academy/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data.users);
            setTotalUsers(data.totalUsers);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
                    <p className="text-text-muted text-sm">Verificando acceso admin...</p>
                </div>
            </div>
        );
    }

    const filteredUsers = users.filter(
        (u) =>
            u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const todayUsers = users.filter((u) => {
        const d = new Date(u.createdAt);
        const today = new Date();
        return d.toDateString() === today.toDateString();
    });

    const weekUsers = users.filter((u) => {
        const d = new Date(u.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d >= weekAgo;
    });

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                {/* Header */}
                <div className="mb-8 relative">
                    <div className="absolute -top-10 -left-20 w-80 h-80 bg-red-500/10 rounded-full blur-[120px]" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-wider">
                                Admin Panel
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            🛡️ Panel de Administración
                        </h1>
                        <p className="text-text-secondary">
                            Bienvenido, {user?.email}
                        </p>
                    </div>
                </div>

                {/* Quick Nav */}
                <div className="flex gap-3 mb-6">
                    <Link href="/academy/admin/courses"
                        className="glass-card px-5 py-3 flex items-center gap-3 card-hover">
                        <span className="text-xl">📚</span>
                        <div>
                            <div className="text-white text-sm font-medium">Gestión de Cursos</div>
                            <div className="text-text-muted text-xs">Crear, editar y publicar</div>
                        </div>
                    </Link>
                    <Link href="/academy/admin/analytics"
                        className="glass-card px-5 py-3 flex items-center gap-3 card-hover">
                        <span className="text-xl">📊</span>
                        <div>
                            <div className="text-white text-sm font-medium">Analytics</div>
                            <div className="text-text-muted text-xs">Usuarios y estadísticas</div>
                        </div>
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "overview"
                            ? "gradient-bg text-white"
                            : "glass text-text-secondary hover:text-white"
                            }`}
                    >
                        📊 Resumen
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "users"
                            ? "gradient-bg text-white"
                            : "glass text-text-secondary hover:text-white"
                            }`}
                    >
                        👥 Usuarios ({totalUsers})
                    </button>
                </div>

                {error && (
                    <div className="glass-card p-4 border-l-4 border-l-red-500 mb-6">
                        <p className="text-red-400 text-sm">Error: {error}</p>
                    </div>
                )}

                {/* ── OVERVIEW TAB ── */}
                {activeTab === "overview" && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="glass-card p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-[30px]" />
                                <div className="relative z-10">
                                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Usuarios</p>
                                    <p className="text-3xl font-bold text-white">{totalUsers}</p>
                                </div>
                            </div>
                            <div className="glass-card p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-success/10 rounded-full blur-[30px]" />
                                <div className="relative z-10">
                                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Registros hoy</p>
                                    <p className="text-3xl font-bold text-success">{todayUsers.length}</p>
                                </div>
                            </div>
                            <div className="glass-card p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-[30px]" />
                                <div className="relative z-10">
                                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Esta semana</p>
                                    <p className="text-3xl font-bold text-accent">{weekUsers.length}</p>
                                </div>
                            </div>
                            <div className="glass-card p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-[30px]" />
                                <div className="relative z-10">
                                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Cursos activos</p>
                                    <p className="text-3xl font-bold text-amber-400">1</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Link
                                href="/academy/admin/courses"
                                className="glass-card p-6 flex items-center gap-4 card-hover group"
                            >
                                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-xl">
                                    📚
                                </div>
                                <div>
                                    <h3 className="text-white font-bold group-hover:text-accent transition-colors">Gestión de Cursos</h3>
                                    <p className="text-text-muted text-xs">Crear, editar y publicar cursos</p>
                                </div>
                                <span className="ml-auto text-text-muted group-hover:text-accent transition-colors">→</span>
                            </Link>
                            <Link href="/academy/admin/analytics" className="glass-card p-6 flex items-center gap-4 group card-hover">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                                    📊
                                </div>
                                <div>
                                    <h3 className="text-white font-bold group-hover:text-accent transition-colors">Analytics</h3>
                                    <p className="text-text-muted text-xs">Usuarios, progreso y estadísticas</p>
                                </div>
                                <span className="ml-auto text-text-muted group-hover:text-accent transition-colors">→</span>
                            </Link>
                        </div>

                        {/* Recent signups */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                🆕 Últimos registros
                            </h2>
                            <div className="space-y-3">
                                {users.slice(0, 10).map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-sm font-bold">
                                                {u.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-medium">{u.fullName}</p>
                                                <p className="text-text-muted text-xs">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-text-muted text-xs">{formatDate(u.createdAt)}</p>
                                            <p className="text-text-muted text-[10px]">{u.provider}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── USERS TAB ── */}
                {activeTab === "users" && (
                    <div className="space-y-6">
                        {/* Search */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Buscar por nombre o email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-border-dark text-white placeholder-text-muted text-sm focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Users Table */}
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border-dark">
                                            <th className="text-left px-5 py-3 text-text-muted text-xs font-medium uppercase tracking-wider">Usuario</th>
                                            <th className="text-left px-5 py-3 text-text-muted text-xs font-medium uppercase tracking-wider">Email</th>
                                            <th className="text-left px-5 py-3 text-text-muted text-xs font-medium uppercase tracking-wider">Registro</th>
                                            <th className="text-left px-5 py-3 text-text-muted text-xs font-medium uppercase tracking-wider">Último login</th>
                                            <th className="text-left px-5 py-3 text-text-muted text-xs font-medium uppercase tracking-wider">Provider</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-dark/50">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
                                                            {u.fullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-white text-sm font-medium">{u.fullName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-text-secondary text-sm">{u.email}</td>
                                                <td className="px-5 py-4 text-text-muted text-sm">{formatDate(u.createdAt)}</td>
                                                <td className="px-5 py-4 text-text-muted text-sm">{u.lastSignIn ? formatDate(u.lastSignIn) : "—"}</td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2 py-1 rounded-full bg-white/5 text-text-muted text-xs">
                                                        {u.provider}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {filteredUsers.length === 0 && (
                                <div className="p-8 text-center text-text-muted text-sm">
                                    No se encontraron usuarios
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
