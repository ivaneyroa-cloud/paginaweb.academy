// ==========================================
// Shippar Academy — Type Definitions
// ==========================================

export interface User {
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    total_xp: number;
    role: 'student' | 'admin';
    created_at: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url?: string;
    order_index: number;
    published: boolean;
    created_at: string;
}

export interface Module {
    id: string;
    course_id: string;
    title: string;
    order_index: number;
}

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    youtube_url: string;
    notes_markdown: string;
    action_links: ActionLink[];
    xp_reward: number;
    order_index: number;
}

export interface ActionLink {
    label: string;
    url: string;
    icon?: string;
}

export interface Quiz {
    id: string;
    module_id: string;
    title: string;
    passing_score: number;
}

export interface QuizQuestion {
    id: string;
    quiz_id: string;
    question: string;
    options: string[];
    correct_index: number;
    explanation: string;
    order_index: number;
}

export interface UserProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    completed: boolean;
    completed_at?: string;
}

export interface QuizResult {
    id: string;
    user_id: string;
    quiz_id: string;
    score: number;
    total_questions: number;
    xp_earned: number;
    completed_at: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon_emoji: string;
    condition_type: 'first_lesson' | 'perfect_quiz' | 'module_complete' | 'course_complete' | 'speed_quiz';
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    earned_at: string;
    badge?: Badge;
}

// Computed / UI types
export interface CourseWithProgress extends Course {
    modules: ModuleWithLessons[];
    totalLessons: number;
    completedLessons: number;
    progressPercent: number;
}

export interface ModuleWithLessons extends Module {
    lessons: Lesson[];
    quiz?: Quiz;
}

export type Rank = {
    name: string;
    emoji: string;
    minXp: number;
    maxXp: number;
};

export const RANKS: Rank[] = [
    { name: 'Importador Novato', emoji: '🐣', minXp: 0, maxXp: 25 },
    { name: 'Importador en Camino', emoji: '📦', minXp: 26, maxXp: 75 },
    { name: 'Importador Courier', emoji: '✈️', minXp: 76, maxXp: 150 },
    { name: 'Maestro del Courier', emoji: '🏆', minXp: 151, maxXp: Infinity },
];

export function getUserRank(xp: number): Rank {
    return RANKS.find(r => xp >= r.minXp && xp <= r.maxXp) || RANKS[0];
}
