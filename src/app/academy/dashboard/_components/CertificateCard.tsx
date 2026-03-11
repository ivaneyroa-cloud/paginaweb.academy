"use client";

import Link from "next/link";

interface CertificateCardProps {
    courseComplete: boolean;
    courseProgress: number;
    completedLessons: number;
}

export default function CertificateCard({ courseComplete, courseProgress, completedLessons }: CertificateCardProps) {
    return (
        <div className="glass-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-xp-gold/10 rounded-full blur-[50px]" />
            <div className="relative z-10 text-center">
                <div className="text-4xl mb-3">{courseComplete ? "🎓" : "📜"}</div>
                <h3 className="text-white font-bold text-sm mb-1">
                    Certificado de Importador S1
                </h3>
                {courseComplete ? (
                    <>
                        <p className="text-success text-xs mb-4 leading-relaxed">
                            ¡Curso completado! Tu certificado está listo.
                        </p>
                        <Link
                            href="/academy/dashboard/certificate"
                            className="inline-block w-full py-3 rounded-xl gradient-bg text-white font-semibold text-sm btn-glow hover:opacity-90 transition-opacity"
                        >
                            🎓 Descargar Certificado
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="text-text-muted text-xs mb-4 leading-relaxed">
                            Completá el 100% del curso para desbloquear tu certificado
                        </p>
                        <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden">
                            <div
                                className="h-full rounded-full bg-xp-gold progress-glow"
                                style={{ width: `${courseProgress}%` }}
                            />
                        </div>
                        <p className="text-text-muted text-xs mt-2">
                            {completedLessons}/4 lecciones
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
