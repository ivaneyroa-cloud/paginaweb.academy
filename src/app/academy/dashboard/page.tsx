"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/academy/supabase";
import { getUserRank, RANKS } from "@/lib/academy/types";
import { getProgress, getUnlockedBadges, type UserProgress } from "@/lib/academy/progress";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";
import Navbar from "@/components/academy/Navbar";
import WhatsAppButton from "@/components/academy/WhatsAppButton";

// Dashboard components
import StatsRow from "./_components/StatsRow";
import CourseProgressCard from "./_components/CourseProgressCard";
import PostCourseCTA from "./_components/PostCourseCTA";
import BadgesGrid from "./_components/BadgesGrid";
import ContactFormCard from "./_components/ContactFormCard";
import XPRankCard from "./_components/XPRankCard";
import QuickActions from "./_components/QuickActions";
import CertificateCard from "./_components/CertificateCard";
import ShipparPromo from "./_components/ShipparPromo";

const TIPS = [
    "Siempre pedí Trade Assurance en Alibaba para proteger tu pago.",
    "El peso volumétrico puede ser mayor que el real — calculalo antes de comprar.",
    "La base imponible es CIF, no FOB. No confíes en cuentas simplificadas.",
    "Validá con 3 unidades antes de escalar a 200.",
    "Comunicarte como empresa te da mejores precios y respuestas.",
    "El Courier es una herramienta táctica, no universal.",
    "Un producto liviano con buen margen es ideal para Courier.",
    "No compitas por precio contra contenedores. Competí por diferenciación.",
];

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<SupabaseAuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState<UserProgress>({ completedLessons: [], passedQuizzes: [], xp: 0 });
    const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    setUser(session.user);
                    setProgress(getProgress());
                    setLoading(false);
                } else {
                    if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") {
                        router.push("/academy/login");
                    }
                }
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    useEffect(() => {
        const handleFocus = () => setProgress(getProgress());
        window.addEventListener("focus", handleFocus);
        return () => window.removeEventListener("focus", handleFocus);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
                    <p className="text-text-muted text-sm">Cargando tu panel...</p>
                </div>
            </div>
        );
    }

    // Derived state
    const xp = progress.xp;
    const completedLessons = progress.completedLessons.length;
    const rank = getUserRank(xp);
    const nextRank = RANKS.find((r) => r.minXp > xp);
    const progressToNext = nextRank
        ? ((xp - rank.minXp) / (nextRank.minXp - rank.minXp)) * 100
        : 100;
    const totalLessons = Math.max(progress.completedLessons.length, 4);
    const courseProgress = (completedLessons / totalLessons) * 100;
    const courseComplete = progress.passedQuizzes.length >= 4;
    const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Estudiante";
    const badges = getUnlockedBadges();
    const unlockedCount = badges.filter((b) => b.unlocked).length;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <WhatsAppButton />

            <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
                {/* Welcome Header */}
                <div className="mb-10 relative">
                    <div className="absolute -top-10 -left-20 w-80 h-80 bg-primary/15 rounded-full blur-[120px]" />
                    <div className="absolute -top-10 -right-20 w-60 h-60 bg-accent/10 rounded-full blur-[100px]" />
                    <div className="relative z-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Hola, <span className="gradient-text">{userName}</span> 👋
                        </h1>
                        <p className="text-text-secondary text-lg mb-4">
                            Tu panel de control de Shippar Academy
                        </p>
                        <div className="glass-card p-4 flex flex-col sm:flex-row items-center gap-3 max-w-lg">
                            <div className="flex items-center gap-2 text-sm text-white/70">
                                <span>🔔</span>
                                <span>Suscribite para enterarte cuando lancemos nuevos cursos</span>
                            </div>
                            <button
                                onClick={() => {
                                    const email = user?.email;
                                    if (email) {
                                        alert('¡Listo! Te avisaremos a ' + email + ' cuando lancemos nuevos cursos.');
                                    }
                                }}
                                className="px-5 py-2 rounded-xl gradient-bg text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                            >
                                Suscribirme
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tip del día */}
                <div className="mb-8 glass-card p-4 border-l-4 border-l-amber-400 flex items-start gap-3">
                    <span className="text-xl mt-0.5">💡</span>
                    <div>
                        <p className="text-amber-300 text-xs font-semibold uppercase tracking-wide mb-1">Tip del día</p>
                        <p className="text-text-secondary text-sm">{TIPS[tipIndex]}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <StatsRow
                    progress={progress}
                    rank={rank}
                    xp={xp}
                    progressToNext={progressToNext}
                    unlockedCount={unlockedCount}
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN (2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        <CourseProgressCard
                            courseProgress={courseProgress}
                            courseComplete={courseComplete}
                            completedLessons={completedLessons}
                        />
                        {courseComplete && <PostCourseCTA />}
                        <BadgesGrid badges={badges} />
                        <ContactFormCard />
                    </div>

                    {/* RIGHT COLUMN (1/3) */}
                    <div className="space-y-6">
                        <XPRankCard xp={xp} rank={rank} nextRank={nextRank} progressToNext={progressToNext} />
                        <QuickActions />
                        <CertificateCard courseComplete={courseComplete} courseProgress={courseProgress} completedLessons={completedLessons} />
                        <ShipparPromo />
                    </div>
                </div>
            </main>
        </div>
    );
}
