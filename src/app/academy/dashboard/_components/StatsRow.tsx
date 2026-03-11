"use client";

import type { UserProgress } from "@/lib/academy/progress";
import type { Rank } from "@/lib/academy/types";
import type { Badge } from "@/lib/academy/progress";

interface StatsRowProps {
    progress: UserProgress;
    rank: Rank;
    xp: number;
    progressToNext: number;
    unlockedCount: number;
}

export default function StatsRow({ progress, rank, xp, progressToNext, unlockedCount }: StatsRowProps) {
    const completedLessons = progress.completedLessons.length;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-5 text-center">
                <div className="text-3xl mb-1">{rank.emoji}</div>
                <p className="text-white font-bold text-sm">{rank.name}</p>
                <p className="text-text-muted text-xs">{xp} XP</p>
                <div className="w-full h-1.5 rounded-full bg-border-dark overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progressToNext}%` }} />
                </div>
            </div>
            <div className="glass-card p-5 text-center">
                <div className="text-3xl mb-1">📚</div>
                <p className="text-white font-bold text-sm">{completedLessons}/4</p>
                <p className="text-text-muted text-xs">Lecciones</p>
                <div className="w-full h-1.5 rounded-full bg-border-dark overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${(completedLessons / 4) * 100}%` }} />
                </div>
            </div>
            <div className="glass-card p-5 text-center">
                <div className="text-3xl mb-1">✅</div>
                <p className="text-white font-bold text-sm">{progress.passedQuizzes.length}/4</p>
                <p className="text-text-muted text-xs">Quizzes</p>
                <div className="w-full h-1.5 rounded-full bg-border-dark overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${(progress.passedQuizzes.length / 4) * 100}%` }} />
                </div>
            </div>
            <div className="glass-card p-5 text-center">
                <div className="text-3xl mb-1">🏆</div>
                <p className="text-white font-bold text-sm">{unlockedCount}/5</p>
                <p className="text-text-muted text-xs">Badges</p>
                <div className="w-full h-1.5 rounded-full bg-border-dark overflow-hidden mt-2">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all" style={{ width: `${(unlockedCount / 5) * 100}%` }} />
                </div>
            </div>
        </div>
    );
}
