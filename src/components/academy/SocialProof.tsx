"use client";

import { useState, useEffect } from "react";

/**
 * Social proof counter with count-up animation.
 * Grows ~7-23 per day from a base date.
 */
export default function SocialProof() {
    // Base: 183 students on March 1, 2026
    const baseDate = new Date("2026-03-01").getTime();
    const today = new Date().setHours(0, 0, 0, 0);
    const daysSinceBase = Math.max(0, Math.floor((today - baseDate) / 86400000));

    // Seeded pseudo-random growth: 7-23 per day
    let target = 183;
    for (let i = 0; i < daysSinceBase; i++) {
        const seed = (i * 2654435761) >>> 0;
        const increment = 7 + (seed % 17);
        target += increment;
    }

    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1000; // ms — sweet spot: premium, not gimmicky
        const startValue = 0;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic for smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (target - startValue) * eased);

            setCount(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [target]);

    return (
        <div className="flex items-center justify-center gap-3 mt-6 animate-slide-up">
            {/* Stacked avatars */}
            <div className="flex -space-x-2">
                {[32, 44, 56, 68].map((seed, i) => (
                    <img
                        key={i}
                        src={`https://i.pravatar.cc/56?img=${seed}`}
                        alt=""
                        className="w-7 h-7 rounded-full border-2 border-[#0c1929] object-cover"
                    />
                ))}
            </div>
            <p className="text-white/50 text-sm">
                Unite a los{" "}
                <span className="text-accent font-semibold">{count}</span>{" "}
                emprendedores que ya están aprendiendo a importar correctamente
            </p>
        </div>
    );
}
