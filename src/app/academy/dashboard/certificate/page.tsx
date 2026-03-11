"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/academy/supabase";
import Navbar from "@/components/academy/Navbar";
import { getProgress } from "@/lib/academy/progress";
import type { User } from "@supabase/supabase-js";

export default function CertificatePage() {
    const router = useRouter();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [courseCompleted, setCourseCompleted] = useState(false);
    const [rendered, setRendered] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session) {
                    router.push("/academy/login");
                } else {
                    setUser(session.user);
                    const p = getProgress();
                    const allPassed = p.passedQuizzes.length >= 4;
                    setCourseCompleted(allPassed);
                    setLoading(false);
                }
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    const getUserName = () => {
        if (!user) return "Estudiante";
        return (
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Estudiante"
        );
    };

    const formatDate = () => {
        const now = new Date();
        const months = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
        ];
        return `${now.getDate()} de ${months[now.getMonth()]} de ${now.getFullYear()}`;
    };

    const drawCertificate = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas || !user) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const W = 1600;
        const H = 1130;
        canvas.width = W;
        canvas.height = H;

        const F = "'Segoe UI', 'Inter', system-ui, sans-serif";

        // ── Background — elegant cream ──
        ctx.fillStyle = "#faf8f4";
        ctx.fillRect(0, 0, W, H);

        // ── Outer gold border ──
        ctx.strokeStyle = "#c9a84c";
        ctx.lineWidth = 4;
        ctx.strokeRect(30, 30, W - 60, H - 60);

        // ── Inner decorative border ──
        ctx.strokeStyle = "#c9a84c";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(45, 45, W - 90, H - 90);

        // ── Corner ornaments ──
        const drawCorner = (cx: number, cy: number, sx: number, sy: number) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.scale(sx, sy);
            ctx.strokeStyle = "#c9a84c";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 35);
            ctx.lineTo(0, 0);
            ctx.lineTo(35, 0);
            ctx.stroke();
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(5, 25);
            ctx.lineTo(5, 5);
            ctx.lineTo(25, 5);
            ctx.stroke();
            ctx.fillStyle = "#c9a84c";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(5, -5);
            ctx.lineTo(10, 0);
            ctx.lineTo(5, 5);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        };
        drawCorner(50, 50, 1, 1);
        drawCorner(W - 50, 50, -1, 1);
        drawCorner(50, H - 50, 1, -1);
        drawCorner(W - 50, H - 50, -1, -1);

        // ── Top gold decorative line ──
        const goldLine = ctx.createLinearGradient(W * 0.2, 0, W * 0.8, 0);
        goldLine.addColorStop(0, "transparent");
        goldLine.addColorStop(0.15, "#c9a84c");
        goldLine.addColorStop(0.5, "#e8d48b");
        goldLine.addColorStop(0.85, "#c9a84c");
        goldLine.addColorStop(1, "transparent");
        ctx.fillStyle = goldLine;
        ctx.fillRect(W * 0.1, 175, W * 0.8, 2);

        // ── "SHIPPAR ACADEMY" ──
        ctx.textAlign = "center";
        ctx.fillStyle = "#8a7a50";
        ctx.font = `500 16px ${F}`;
        ctx.fillText("S H I P P A R    A C A D E M Y", W / 2, 110);

        // ── Main title ──
        ctx.fillStyle = "#1a1a2e";
        ctx.font = `300 52px ${F}`;
        ctx.fillText("CERTIFICADO DE FINALIZACIÓN", W / 2, 157);

        // ── "Se certifica que" ──
        ctx.fillStyle = "#666";
        ctx.font = `italic 18px Georgia, ${F}`;
        ctx.fillText("Se certifica que", W / 2, 225);

        // ── Student name ──
        ctx.fillStyle = "#1a1a2e";
        ctx.font = `bold 58px Georgia, ${F}`;
        const name = getUserName().toUpperCase();
        ctx.fillText(name, W / 2, 290);

        // ── Name underline ──
        const nw = ctx.measureText(name).width;
        ctx.fillStyle = "#c9a84c";
        ctx.fillRect(W / 2 - nw / 2 - 20, 305, nw + 40, 2);

        // ── "ha completado satisfactoriamente" ──
        ctx.fillStyle = "#666";
        ctx.font = `italic 18px Georgia, ${F}`;
        ctx.fillText("ha completado satisfactoriamente el programa", W / 2, 350);

        // ── Course title ──
        ctx.fillStyle = "#1a1a2e";
        ctx.font = `bold 34px ${F}`;
        ctx.fillText("Cómo Importar desde China en 2026", W / 2, 400);

        // ── Subtitle ──
        ctx.fillStyle = "#888";
        ctx.font = `400 17px ${F}`;
        ctx.fillText("Régimen Courier Simplificado  —  Nivel Operador S1", W / 2, 435);

        // ── Bottom gold line ──
        ctx.fillStyle = goldLine;
        ctx.fillRect(W * 0.1, 465, W * 0.8, 1.5);

        // ── Modules ──
        ctx.fillStyle = "#8a7a50";
        ctx.font = `600 14px ${F}`;
        ctx.fillText("MÓDULOS APROBADOS", W / 2, 505);

        const modules = [
            "Fundamentos y Reglas del Juego",
            "Estrategia de Producto y Sourcing",
            "Impuestos y Base Imponible",
            "Logística Real y Proceso Completo",
        ];
        modules.forEach((mod, i) => {
            ctx.fillStyle = "#333";
            ctx.font = `500 18px ${F}`;
            ctx.fillText(`✓  Módulo ${i + 1}: ${mod}`, W / 2, 540 + i * 34);
        });

        // ── Date ──
        const dateY = 540 + modules.length * 34 + 30;
        ctx.fillStyle = "#777";
        ctx.font = `400 15px ${F}`;
        ctx.fillText(`Fecha de emisión: ${formatDate()}`, W / 2, dateY);

        // ── Signature — cursive font ──
        const sigBaseY = H - 150;
        const sigX = W / 2;

        // Load cursive font for signature
        const sigFont = new FontFace("GreatVibes", "url(https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN-XCg6UKDXlq.woff2)");
        try {
            const loaded = await sigFont.load();
            document.fonts.add(loaded);
        } catch { /* fallback below */ }

        // Signature text in elegant cursive
        const hasCursive = document.fonts.check("40px GreatVibes");
        const sigFontFamily = hasCursive ? "'GreatVibes'" : "'Georgia', serif";

        ctx.fillStyle = "#1a1a3e";
        ctx.font = `400 52px ${sigFontFamily}`;
        ctx.textAlign = "center";
        ctx.fillText("Iván Eyroa", sigX, sigBaseY);

        // Signature line
        ctx.fillStyle = "#bbb";
        ctx.fillRect(sigX - 140, sigBaseY + 12, 280, 1);

        // Name — printed
        ctx.fillStyle = "#1a1a2e";
        ctx.font = `700 24px ${F}`;
        ctx.fillText("Iván Eyroa", sigX, sigBaseY + 42);

        // Title — prominent
        ctx.fillStyle = "#8a7a50";
        ctx.font = `600 18px ${F}`;
        ctx.fillText("CEO & Founder — Shippar", sigX, sigBaseY + 68);

        // ── Certificate ID ──
        const certId = `SA-${Date.now().toString(36).toUpperCase()}-S1`;
        ctx.fillStyle = "#ccc";
        ctx.font = `400 11px ${F}`;
        ctx.textAlign = "center";
        ctx.fillText(`Certificado Nº ${certId}`, W / 2, H - 58);

        setRendered(true);
    }, [user]);

    useEffect(() => {
        if (courseCompleted && user && canvasRef.current) {
            setTimeout(() => drawCertificate(), 300);
        }
    }, [courseCompleted, user, drawCertificate]);

    const downloadPNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `Certificado_Shippar_Academy_${getUserName().replace(/\s+/g, "_")}.png`;
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
    };

    const downloadPDF = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`Certificado_Shippar_Academy_${getUserName().replace(/\s+/g, "_")}.pdf`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!courseCompleted) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <div className="glass-card p-12">
                        <div className="text-6xl mb-6">🔒</div>
                        <h1 className="text-2xl font-bold text-white mb-3">
                            Certificado no disponible
                        </h1>
                        <p className="text-text-secondary mb-8 leading-relaxed">
                            Necesitás completar los 4 módulos y aprobar todos los quizzes
                            para obtener tu Certificado de Importador S1.
                        </p>
                        <div className="space-y-2 mb-8">
                            {[1, 2, 3, 4].map((i) => {
                                const passed = i <= getProgress().passedQuizzes.length;
                                return (
                                    <div
                                        key={i}
                                        className={`flex items-center gap-3 p-3 rounded-xl border ${passed
                                            ? "border-success/20 bg-success/5"
                                            : "border-border-dark bg-white/5"
                                            }`}
                                    >
                                        <span className={`text-lg ${passed ? "text-success" : "text-text-muted"}`}>
                                            {passed ? "✓" : "○"}
                                        </span>
                                        <span className={`text-sm ${passed ? "text-success" : "text-text-muted"}`}>
                                            Módulo {i + 1} — Quiz {passed ? "aprobado" : "pendiente"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <a
                            href="/academy/dashboard"
                            className="inline-block px-8 py-3 rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity"
                        >
                            Volver al curso
                        </a>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🎓</div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        ¡Felicitaciones, {getUserName()}!
                    </h1>
                    <p className="text-text-secondary">
                        Completaste el curso. Descargá tu certificado oficial de Shippar Academy.
                    </p>
                </div>

                <div className="glass-card p-4 sm:p-6 mb-6">
                    <canvas
                        ref={canvasRef}
                        className="w-full rounded-lg"
                        style={{ aspectRatio: "1600/1130" }}
                    />
                </div>

                {rendered && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                        <button
                            onClick={downloadPNG}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            🖼️ Descargar PNG
                        </button>
                        <button
                            onClick={downloadPDF}
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass text-white font-semibold hover:border-border-hover transition-colors flex items-center justify-center gap-2"
                        >
                            📄 Descargar PDF
                        </button>
                        <a
                            href="/academy/dashboard"
                            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass text-text-secondary font-medium text-center hover:text-white transition-colors"
                        >
                            Volver al Dashboard
                        </a>
                    </div>
                )}

                {/* Legal Disclaimer */}
                {rendered && (
                    <div className="mt-10 max-w-2xl mx-auto text-center space-y-3 opacity-70">
                        <div className="w-16 h-px bg-border-dark mx-auto mb-4" />
                        <p className="text-text-muted text-xs leading-relaxed">
                            <strong className="text-text-secondary">⚠️ Aviso importante:</strong> Este certificado acredita la finalización del curso educativo
                            &quot;Cómo Importar desde China en 2026&quot; dictado por Shippar Academy. <strong className="text-text-secondary">No constituye un título habilitante</strong> ni
                            reemplaza la matrícula de Despachante de Aduanas u otra habilitación profesional requerida
                            por la normativa vigente para operar como agente de comercio exterior.
                        </p>
                        <p className="text-text-muted text-xs leading-relaxed">
                            El contenido del curso es de carácter <strong className="text-text-secondary">exclusivamente educativo e informativo</strong>.
                            El éxito de cualquier operación de importación depende de las normativas, regulaciones y
                            condiciones vigentes al momento de la operación real. Shippar Academy no se hace responsable
                            por decisiones comerciales tomadas en base a este contenido.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
