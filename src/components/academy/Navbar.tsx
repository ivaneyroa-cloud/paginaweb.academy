"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/academy/supabase";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: any, session: any) => {
                setUser(session?.user ?? null);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user ? "/academy/dashboard" : "/"} className="flex items-center gap-2 group">
                        <img
                            src="/logo-shippar.png"
                            alt="Shippar"
                            className="h-7 w-auto group-hover:scale-105 transition-transform"
                        />
                        <span className="text-lg font-bold gradient-text">
                            Academy
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-0">
                        {user ? (
                            <>
                                <Link
                                    href="/academy/dashboard"
                                    className={`px-5 py-2 rounded-lg text-base font-medium transition-colors ${isActive("/academy/dashboard")
                                        ? "gradient-text bg-white/10"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    Panel
                                </Link>
                                <div className="w-px h-5 bg-border-dark" />
                                <Link
                                    href="/academy/dashboard/courses"
                                    className={`px-5 py-2 rounded-lg text-base font-medium transition-colors ${pathname?.startsWith("/academy/dashboard/course") || pathname?.startsWith("/academy/dashboard/lesson") || pathname?.startsWith("/academy/dashboard/quiz")
                                        ? "gradient-text bg-white/10"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    Cursos
                                </Link>
                                <div className="w-px h-5 bg-border-dark" />
                                <Link
                                    href="/academy/dashboard/community"
                                    className={`px-5 py-2 rounded-lg text-base font-medium transition-colors ${pathname?.startsWith("/academy/dashboard/community")
                                        ? "gradient-text bg-white/10"
                                        : "text-text-secondary hover:text-white hover:bg-white/5"
                                        }`}
                                >
                                    Comunidad
                                </Link>
                                <div className="w-px h-6 bg-border-dark mx-2" />
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
                                        <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white text-sm font-medium max-w-[120px] truncate">
                                            {userName}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 rounded-xl border border-border-dark text-text-secondary hover:text-white hover:border-border-hover text-sm font-medium transition-colors"
                                    >
                                        Salir
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/#cursos"
                                    className="text-text-secondary hover:text-white transition-colors text-sm font-medium px-4 py-2"
                                >
                                    Cursos
                                </Link>
                                <Link
                                    href="/academy/login"
                                    className="text-text-secondary hover:text-white transition-colors text-sm font-medium px-4 py-2"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/academy/register"
                                    className="px-5 py-2 rounded-xl gradient-bg text-white text-sm font-semibold btn-glow hover:opacity-90 transition-opacity"
                                >
                                    Registrarse Gratis
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden text-text-secondary hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden pb-4 animate-slide-up">
                        <div className="flex flex-col gap-1">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 py-3 px-2">
                                        <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                                            {userName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white text-sm font-medium">{userName}</span>
                                    </div>
                                    <Link
                                        href="/academy/dashboard"
                                        onClick={() => setMobileOpen(false)}
                                        className={`py-3 px-3 rounded-lg text-base font-medium transition-colors ${isActive("/academy/dashboard") ? "gradient-text bg-white/10" : "text-text-secondary"
                                            }`}
                                    >
                                        Panel
                                    </Link>
                                    <div className="h-px bg-border-dark mx-3" />
                                    <Link
                                        href="/academy/dashboard/courses"
                                        onClick={() => setMobileOpen(false)}
                                        className={`py-3 px-3 rounded-lg text-base font-medium transition-colors ${pathname?.startsWith("/academy/dashboard/course") ? "gradient-text bg-white/10" : "text-text-secondary"
                                            }`}
                                    >
                                        Cursos
                                    </Link>
                                    <div className="h-px bg-border-dark mx-3" />
                                    <Link
                                        href="/academy/dashboard/community"
                                        onClick={() => setMobileOpen(false)}
                                        className={`py-3 px-3 rounded-lg text-base font-medium transition-colors ${pathname?.startsWith("/academy/dashboard/community") ? "gradient-text bg-white/10" : "text-text-secondary"
                                            }`}
                                    >
                                        Comunidad
                                    </Link>
                                    <button
                                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                                        className="text-left text-danger hover:text-red-400 transition-colors text-sm font-medium py-2.5 px-3"
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/#cursos"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-text-secondary hover:text-white transition-colors text-sm font-medium py-2"
                                    >
                                        Cursos
                                    </Link>
                                    <Link
                                        href="/academy/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-text-secondary hover:text-white transition-colors text-sm font-medium py-2"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href="/academy/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold text-center btn-glow"
                                    >
                                        Registrarse Gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
