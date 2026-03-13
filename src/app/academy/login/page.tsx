"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Force a hard reload to the dashboard so auth state connects
            window.location.href = "/academy/dashboard";
        } catch (err: any) {
            setError(err.message || "Error al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 mt-16 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />

                <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in">
                    <div className="text-center mb-8">
                        <img src="/logo-shippar.webp" alt="Shippar" className="h-10 w-auto mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
                        <p className="text-text-secondary text-sm">
                            Ingresá a tu cuenta para continuar aprendiendo
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-danger-light border border-danger/20 text-danger text-sm text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface-solid border border-border-dark text-white focus:outline-none focus:border-accent transition-colors"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface-solid border border-border-dark text-white focus:outline-none focus:border-accent transition-colors"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center btn-glow disabled:opacity-50 transition-opacity mt-4"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Ingresar"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border-dark text-center">
                        <p className="text-text-secondary text-sm">
                            ¿No tenés una cuenta?{" "}
                            <Link href="/academy/register" className="text-accent hover:text-accent-hover font-medium transition-colors">
                                Registrate gratis
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
