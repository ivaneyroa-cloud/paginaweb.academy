// ─── Progress API Client ───
// Supabase-first, localStorage as cache. Source of truth = DB.

import { supabase } from "@/lib/academy/supabase";

interface ProgressData {
    completedLessons: string[];
    passedQuizzes: string[];
    xp: number;
}

const STORAGE_KEY = "shippar_academy_progress";

async function getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
}

// Read: Supabase first, fallback to localStorage
export async function getProgress(): Promise<ProgressData> {
    const token = await getToken();

    if (token) {
        try {
            const res = await fetch("/api/academy/progress", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const { progress } = await res.json();
                const mapped: ProgressData = {
                    completedLessons: progress.completed_lessons || [],
                    passedQuizzes: progress.passed_quizzes || [],
                    xp: progress.xp || 0,
                };
                // Sync to localStorage as cache
                syncToLocal(mapped);
                return mapped;
            }
        } catch {
            // Fall through to localStorage
        }
    }

    return getLocalProgress();
}

function getLocalProgress(): ProgressData {
    if (typeof window === "undefined") return { completedLessons: [], passedQuizzes: [], xp: 0 };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : { completedLessons: [], passedQuizzes: [], xp: 0 };
    } catch {
        return { completedLessons: [], passedQuizzes: [], xp: 0 };
    }
}

// Write: DB first (source of truth), then sync localStorage
export async function completeLesson(lessonId: string): Promise<ProgressData> {
    const token = await getToken();

    if (token) {
        try {
            const res = await fetch("/api/academy/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    action: "complete_lesson",
                    lesson_id: lessonId,
                }),
            });
            if (res.ok) {
                const { progress } = await res.json();
                const mapped: ProgressData = {
                    completedLessons: progress.completed_lessons,
                    passedQuizzes: progress.passed_quizzes,
                    xp: progress.xp,
                };
                syncToLocal(mapped);
                return mapped;
            }
        } catch {
            // Fall through to local
        }
    }

    return completeLessonLocal(lessonId);
}

export async function passQuiz(quizId: string): Promise<ProgressData> {
    const token = await getToken();

    if (token) {
        try {
            const res = await fetch("/api/academy/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    action: "pass_quiz",
                    quiz_id: quizId,
                }),
            });
            if (res.ok) {
                const { progress } = await res.json();
                const mapped: ProgressData = {
                    completedLessons: progress.completed_lessons,
                    passedQuizzes: progress.passed_quizzes,
                    xp: progress.xp,
                };
                syncToLocal(mapped);
                return mapped;
            }
        } catch {
            // Fall through
        }
    }

    return passQuizLocal(quizId);
}

function syncToLocal(data: ProgressData) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Legacy local functions (kept for offline fallback only)
function completeLessonLocal(lessonId: string): ProgressData {
    const p = getLocalProgress();
    if (!p.completedLessons.includes(lessonId)) {
        p.completedLessons.push(lessonId);
        p.xp += 10; // Default fallback XP
    }
    syncToLocal(p);
    return p;
}

function passQuizLocal(quizId: string): ProgressData {
    const p = getLocalProgress();
    if (!p.passedQuizzes.includes(quizId)) {
        p.passedQuizzes.push(quizId);
        p.xp += 15; // Default fallback XP
    }
    syncToLocal(p);
    return p;
}

// Check if module quiz is passed (backwards compat with the original progress.ts API)
export function isModuleQuizPassed(progress: ProgressData, moduleId: string): boolean {
    return progress.passedQuizzes.includes(moduleId);
}

// Check if lesson is completed
export function isLessonCompleted(progress: ProgressData, lessonId: string): boolean {
    return progress.completedLessons.includes(lessonId);
}
