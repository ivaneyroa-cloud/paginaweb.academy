"use client";

import CountUp from "./CountUp";

export default function HeroStats() {
    return (
        <div className="flex items-center justify-center gap-10 mt-14">
            <div className="text-center">
                <CountUp
                    end={4}
                    className="text-3xl font-bold text-white"
                />
                <div className="text-text-muted text-xs mt-1 tracking-wide uppercase">
                    Módulos
                </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
                <CountUp
                    end={11}
                    suffix=" min"
                    className="text-3xl font-bold text-white"
                />
                <div className="text-text-muted text-xs mt-1 tracking-wide uppercase">
                    De contenido
                </div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
                <CountUp
                    end={0}
                    prefix="$"
                    className="text-3xl font-bold text-accent"
                />
                <div className="text-text-muted text-xs mt-1 tracking-wide uppercase">
                    Costo
                </div>
            </div>
        </div>
    );
}
