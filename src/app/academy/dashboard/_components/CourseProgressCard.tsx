"use client";

import Link from "next/link";

interface CourseProgressCardProps {
    courseProgress: number;
    courseComplete: boolean;
    completedLessons: number;
}

export default function CourseProgressCard({ courseProgress, courseComplete, completedLessons }: CourseProgressCardProps) {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    📖 Tu Curso
                </h2>
                <span className="text-xs text-text-muted">
                    {Math.round(courseProgress)}% completado
                </span>
            </div>
            <div className="w-full h-3 rounded-full bg-border-dark overflow-hidden mb-4">
                <div
                    className="h-full rounded-full gradient-bg transition-all duration-500"
                    style={{ width: `${courseProgress}%` }}
                />
            </div>
            <p className="text-text-secondary text-sm mb-5">
                Cómo Importar desde China en 2026 — Régimen Courier Simplificado
            </p>
            {courseComplete ? (
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/academy/dashboard/certificate"
                        className="flex-1 text-center py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold hover:opacity-90 transition-opacity"
                    >
                        🎓 Ver Certificado
                    </Link>
                    <Link
                        href="/academy/dashboard/course"
                        className="flex-1 text-center py-3 rounded-xl glass text-text-secondary font-medium hover:text-white transition-colors"
                    >
                        Revisar Módulos
                    </Link>
                </div>
            ) : (
                <Link
                    href="/academy/dashboard/course"
                    className="block w-full text-center py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity"
                >
                    {completedLessons === 0 ? "🚀 Empezar Curso" : "▶️ Continuar Curso"}
                </Link>
            )}
        </div>
    );
}
