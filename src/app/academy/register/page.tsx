"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";

export default function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // 1. SignUp con Supabase Auth
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signUpError) throw signUpError;

            // 2. Insertar en la tabla publica de users (si es necesario, aunque Supabase
            // puede hacerlo automágicamente con un trigger en la BD. Lo dejamos comentado
            // por si falla el trigger o preferís hacerlo manual después).
            /*
            if (data.user) {
              await supabase.from("users").insert([
                {
                  id: data.user.id,
                  full_name: fullName,
                  email: email,
                  total_xp: 0,
                  role: "student",
                },
              ]);
            }
            */

            setSuccess(true);

            // Auto-redirect después de 2 segundos (el signup ya loguea al usuario)
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 2000);

        } catch (err: any) {
            setError(err.message || "Error al crear la cuenta.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 mt-16 relative overflow-hidden">
                {/* Background glow effects */}
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[128px]" />

                <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in">
                    <div className="text-center mb-8">
                        <img src="/logo-shippar.png" alt="Shippar" className="h-10 w-auto mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Creá tu cuenta gratis</h1>
                        <p className="text-text-secondary text-sm">
                            Empezá hoy mismo a importar como un profesional
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-danger-light border border-danger/20 text-danger text-sm text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-xl bg-success-light border border-success/20 text-success text-sm text-center animate-pulse-glow">
                            ¡Cuenta creada con éxito! Redirigiendo a tu panel...
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface-solid border border-border-dark text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-surface-solid border border-border-dark text-white focus:outline-none focus:border-primary transition-colors"
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
                                minLength={6}
                                className="w-full px-4 py-3 rounded-xl bg-surface-solid border border-border-dark text-white focus:outline-none focus:border-primary transition-colors"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || success}
                            className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold flex items-center justify-center btn-glow disabled:opacity-50 transition-opacity mt-6"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Comenzar"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border-dark text-center">
                        <p className="text-text-secondary text-sm">
                            ¿Ya tenés una cuenta?{" "}
                            <Link href="/academy/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
                                Iniciá sesión acá
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
