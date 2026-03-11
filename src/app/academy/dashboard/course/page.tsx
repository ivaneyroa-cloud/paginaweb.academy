"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/academy/supabase";

// This page redirects to the first course from DB.
// No hardcoded course data.
export default function CourseRedirectPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event: any, session: any) => {
                if (!session) {
                    router.push("/academy/login");
                    return;
                }

                try {
                    // Fetch courses list and redirect to first one
                    const res = await fetch("/api/academy/courses");
                    if (res.ok) {
                        const data = await res.json();
                        if (data.courses && data.courses.length > 0) {
                            router.replace(`/dashboard/course/${data.courses[0].id}`);
                            return;
                        }
                    }

                    // Fallback: try fetching by slug
                    const resFallback = await fetch("/api/academy/courses/importar-china-2026");
                    if (resFallback.ok) {
                        const fallbackData = await resFallback.json();
                        if (fallbackData.course) {
                            router.replace(`/dashboard/course/${fallbackData.course.id}`);
                            return;
                        }
                    }

                    setError("No se encontraron cursos disponibles");
                } catch {
                    setError("Error al cargar cursos");
                }
            }
        );
        return () => subscription.unsubscribe();
    }, [router]);

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="glass-card p-10 text-center">
                    <div className="text-5xl mb-4">📚</div>
                    <h2 className="text-white text-xl font-bold mb-2">Sin cursos</h2>
                    <p className="text-text-secondary text-sm mb-6">{error}</p>
                    <button onClick={() => router.push("/academy/dashboard")} className="px-6 py-3 rounded-xl gradient-bg text-white font-semibold">
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
    );
}
