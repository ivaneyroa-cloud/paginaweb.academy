// ── Progress Manager — Multi-Course Support ──
// Tracks: completed lessons, passed quizzes, XP per course
// Uses localStorage as cache, DB as source of truth

const STORAGE_KEY = "shippar_academy_progress";

// Per-course progress stored in localStorage
export interface CourseProgress {
    completedLessons: string[];  // lesson UUIDs
    passedQuizzes: string[];     // module UUIDs
    xp: number;
}

// Backward-compatible: flat progress for dashboard totals
export interface UserProgress {
    completedLessons: string[];
    passedQuizzes: string[];
    xp: number;
}

// All courses progress keyed by course_id
interface AllProgress {
    courses: Record<string, CourseProgress>;
    totalXp: number;
}

const DEFAULT_COURSE_PROGRESS: CourseProgress = {
    completedLessons: [],
    passedQuizzes: [],
    xp: 0,
};

// ── Storage helpers ──

function getAllProgress(): AllProgress {
    if (typeof window === "undefined") return { courses: {}, totalXp: 0 };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { courses: {}, totalXp: 0 };
        const parsed = JSON.parse(raw);
        // Handle old flat format migration
        if (parsed.completedLessons && !parsed.courses) {
            return {
                courses: { legacy: parsed as CourseProgress },
                totalXp: parsed.xp || 0,
            };
        }
        return parsed;
    } catch {
        return { courses: {}, totalXp: 0 };
    }
}

function saveAllProgress(progress: AllProgress) {
    if (typeof window === "undefined") return;
    progress.totalXp = Object.values(progress.courses).reduce((sum, c) => sum + c.xp, 0);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ── Public API ──

/** Get progress for a specific course */
export function getCourseProgress(courseId: string): CourseProgress {
    const all = getAllProgress();
    return all.courses[courseId] || { ...DEFAULT_COURSE_PROGRESS };
}

/** Get aggregated progress across ALL courses (for dashboard totals) */
export function getProgress(): UserProgress {
    const all = getAllProgress();
    const courses = Object.values(all.courses);
    return {
        completedLessons: courses.flatMap(c => c.completedLessons),
        passedQuizzes: courses.flatMap(c => c.passedQuizzes),
        xp: all.totalXp,
    };
}

/** Complete a lesson in a specific course */
export function completeLesson(courseId: string, lessonId: string, xpReward: number): CourseProgress {
    const all = getAllProgress();
    if (!all.courses[courseId]) {
        all.courses[courseId] = { ...DEFAULT_COURSE_PROGRESS };
    }
    const cp = all.courses[courseId];
    if (!cp.completedLessons.includes(lessonId)) {
        cp.completedLessons.push(lessonId);
        cp.xp += xpReward;
    }
    saveAllProgress(all);
    return cp;
}

/** Pass a quiz (module-level) in a specific course */
export function passQuiz(courseId: string, moduleId: string, xpEarned: number): CourseProgress {
    const all = getAllProgress();
    if (!all.courses[courseId]) {
        all.courses[courseId] = { ...DEFAULT_COURSE_PROGRESS };
    }
    const cp = all.courses[courseId];
    if (!cp.passedQuizzes.includes(moduleId)) {
        cp.passedQuizzes.push(moduleId);
        cp.xp += xpEarned;
    }
    saveAllProgress(all);
    return cp;
}

export function isLessonCompleted(courseId: string, lessonId: string): boolean {
    return getCourseProgress(courseId).completedLessons.includes(lessonId);
}

export function isQuizPassed(courseId: string, moduleId: string): boolean {
    return getCourseProgress(courseId).passedQuizzes.includes(moduleId);
}

// ── Module unlock logic (dynamic, position-based) ──
// Module N is unlocked if:
//   - N === 0 (first module always unlocked)
//   - OR: All lessons of module N-1 are completed AND module N-1's quiz is passed

export interface ModuleInfo {
    id: string;
    lessonIds: string[];
}

/** Check if a module is unlocked based on previous module completion */
export function isModuleUnlocked(
    courseId: string,
    moduleIndex: number,
    orderedModules: ModuleInfo[]
): boolean {
    if (moduleIndex === 0) return true;

    const prev = orderedModules[moduleIndex - 1];
    if (!prev) return true;

    const cp = getCourseProgress(courseId);
    const allPrevLessonsDone = prev.lessonIds.every(id => cp.completedLessons.includes(id));
    const prevQuizPassed = cp.passedQuizzes.includes(prev.id);

    return allPrevLessonsDone && prevQuizPassed;
}

/** Get module status for UI rendering */
export function getModuleStatus(
    courseId: string,
    moduleIndex: number,
    moduleId: string,
    lessonIds: string[],
    orderedModules: ModuleInfo[]
): "locked" | "lesson" | "quiz" | "completed" {
    if (!isModuleUnlocked(courseId, moduleIndex, orderedModules)) return "locked";
    const cp = getCourseProgress(courseId);
    const allLessonsDone = lessonIds.every(id => cp.completedLessons.includes(id));
    if (!allLessonsDone) return "lesson";
    if (!cp.passedQuizzes.includes(moduleId)) return "quiz";
    return "completed";
}

/** Check if entire course is completed (all modules' quizzes passed) */
export function isCourseComplete(courseId: string, moduleIds: string[]): boolean {
    const cp = getCourseProgress(courseId);
    return moduleIds.every(id => cp.passedQuizzes.includes(id));
}

// ── Badge system ──
export interface Badge {
    id: string;
    emoji: string;
    name: string;
    description: string;
    unlocked: boolean;
}

export function getUnlockedBadges(): Badge[] {
    const p = getProgress();
    const completedModules = p.passedQuizzes.length;
    // "Course complete" = at least one course fully completed
    // We check if there's any course where all quizzes are passed
    const all = getAllProgress();
    const anyCourseComplete = Object.values(all.courses).some(cp => cp.passedQuizzes.length >= 4);

    return [
        {
            id: "b1",
            emoji: "🐣",
            name: "Primer Paso",
            description: "Completaste tu primera lección",
            unlocked: p.completedLessons.length >= 1,
        },
        {
            id: "b2",
            emoji: "🧠",
            name: "Quiz Master",
            description: "Aprobaste tu primer quiz",
            unlocked: p.passedQuizzes.length >= 1,
        },
        {
            id: "b3",
            emoji: "📦",
            name: "Módulo Completo",
            description: "Completaste un módulo entero",
            unlocked: completedModules >= 1,
        },
        {
            id: "b4",
            emoji: "⚡",
            name: "Rayo Veloz",
            description: "Completaste 2+ módulos",
            unlocked: completedModules >= 2,
        },
        {
            id: "b5",
            emoji: "🏆",
            name: "Importador S1",
            description: "Completaste todo el curso",
            unlocked: anyCourseComplete,
        },
    ];
}
