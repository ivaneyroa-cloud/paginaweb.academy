"use client";

import type { Rank } from "@/lib/academy/types";

interface XPRankCardProps {
    xp: number;
    rank: Rank;
    nextRank: Rank | undefined;
    progressToNext: number;
}

export default function XPRankCard({ xp, rank, nextRank, progressToNext }: XPRankCardProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                ⭐ Tu Nivel
            </h3>
            <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{rank.emoji}</div>
                <div>
                    <p className="text-white font-bold">{rank.name}</p>
                    <p className="text-text-muted text-xs">{xp} XP totales</p>
                </div>
            </div>
            {nextRank && (
                <>
                    <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden mb-2">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all"
                            style={{ width: `${progressToNext}%` }}
                        />
                    </div>
                    <p className="text-text-muted text-xs">
                        {nextRank.minXp - xp} XP para {nextRank.emoji} {nextRank.name}
                    </p>
                </>
            )}
        </div>
    );
}
