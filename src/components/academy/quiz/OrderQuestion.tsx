"use client";

import type { OrderQuestion as OrderQ } from "./types";

interface OrderQuestionProps {
    question: OrderQ;
    answered: boolean;
    orderedItems: string[];
    onMove: (fromIndex: number, direction: "up" | "down") => void;
    onSubmit: () => void;
}

export default function OrderQuestion({ answered, orderedItems, onMove, onSubmit }: OrderQuestionProps) {
    return (
        <div className="space-y-2">
            {orderedItems.map((item, i) => (
                <div
                    key={item}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${answered
                        ? "border-primary/30 bg-white/5"
                        : "border-border-dark"
                        }`}
                >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${answered
                        ? "bg-primary/15 text-primary"
                        : "bg-primary/15 text-primary"
                        }`}>
                        {i + 1}
                    </div>
                    <span className="text-text-secondary text-sm flex-1">{item}</span>
                    {!answered && (
                        <div className="flex flex-col gap-0.5">
                            <button
                                onClick={() => onMove(i, "up")}
                                disabled={i === 0}
                                className="p-2 min-w-[36px] min-h-[36px] text-text-muted hover:text-white disabled:opacity-20 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onMove(i, "down")}
                                disabled={i === orderedItems.length - 1}
                                className="p-2 min-w-[36px] min-h-[36px] text-text-muted hover:text-white disabled:opacity-20 transition-colors flex items-center justify-center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {!answered && (
                <button
                    onClick={onSubmit}
                    className="w-full mt-4 py-3 min-h-[48px] rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity"
                >
                    Confirmar orden
                </button>
            )}
        </div>
    );
}
