// ─── One-Time localStorage → DB Migration ───
// Call on dashboard load. Sets a flag to never run twice.

import { supabase } from "@/lib/academy/supabase";

const STORAGE_KEY = "shippar_academy_progress";
const MIGRATION_FLAG = "shippar_progress_migrated";

export async function migrateLocalProgressToDb(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (localStorage.getItem(MIGRATION_FLAG)) return false; // Already migrated

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        localStorage.setItem(MIGRATION_FLAG, "true");
        return false; // Nothing to migrate
    }

    let local: any;
    try {
        local = JSON.parse(raw);
    } catch {
        localStorage.setItem(MIGRATION_FLAG, "true");
        return false;
    }

    if (!local.completedLessons?.length && !local.passedQuizzes?.length) {
        localStorage.setItem(MIGRATION_FLAG, "true");
        return false; // Empty progress
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    try {
        // Fetch existing DB progress
        const res = await fetch("/api/academy/progress", {
            headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return false;

        const { progress: dbProgress } = await res.json();
        const dbLessons: string[] = dbProgress.completed_lessons || [];
        const dbQuizzes: string[] = dbProgress.passed_quizzes || [];
        const dbXp: number = dbProgress.xp || 0;

        // Merge: union of both sources, take max XP
        const mergedLessons = [...new Set([...dbLessons, ...local.completedLessons])];
        const mergedQuizzes = [...new Set([...dbQuizzes, ...(local.passedQuizzes || [])])];
        const mergedXp = Math.max(dbXp, local.xp || 0);

        // Write merged data back to DB
        const writeRes = await fetch("/api/academy/progress/migrate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
                completed_lessons: mergedLessons,
                passed_quizzes: mergedQuizzes,
                xp: mergedXp,
            }),
        });

        if (writeRes.ok) {
            localStorage.setItem(MIGRATION_FLAG, "true");
            // Update local cache with merged data
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                completedLessons: mergedLessons,
                passedQuizzes: mergedQuizzes,
                xp: mergedXp,
            }));
            return true;
        }
    } catch (err) {
        console.error("Progress migration failed:", err);
    }

    return false;
}
