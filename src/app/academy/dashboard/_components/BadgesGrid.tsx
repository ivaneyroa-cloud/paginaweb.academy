"use client";

import type { Badge } from "@/lib/academy/progress";

interface BadgesGridProps {
    badges: Badge[];
}

export default function BadgesGrid({ badges }: BadgesGridProps) {
    return (
        <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                🏆 Tus Badges
            </h2>
            <div className="grid grid-cols-5 gap-3">
                {badges.map((badge) => (
                    <div
                        key={badge.id}
                        className={`text-center p-3 rounded-xl border transition-all relative ${badge.unlocked
                            ? "border-amber-500/30 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                            : "border-white/5 bg-white/[0.03]"
                            }`}
                        title={badge.unlocked ? `${badge.name} — Desbloqueado` : `${badge.name} — Bloqueado`}
                    >
                        <div className={`text-2xl mb-1 ${badge.unlocked ? "" : "grayscale opacity-30"}`}>
                            {badge.emoji}
                        </div>
                        {!badge.unlocked && (
                            <div className="absolute top-1.5 right-1.5 text-[10px] text-white/30">🔒</div>
                        )}
                        <p className={`text-xs font-medium ${badge.unlocked ? "text-white" : "text-white/30"}`}>
                            {badge.name}
                        </p>
                        {badge.unlocked && (
                            <p className="text-[10px] text-amber-300 mt-0.5">Desbloqueado ✓</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
