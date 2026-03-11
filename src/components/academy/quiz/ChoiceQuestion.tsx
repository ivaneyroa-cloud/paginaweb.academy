"use client";

import type { ChoiceQuestion as ChoiceQ } from "./types";

interface ChoiceQuestionProps {
    question: ChoiceQ;
    answered: boolean;
    selectedChoice: number | null;
    isCorrect: boolean;
    onSelect: (index: number) => void;
}

export default function ChoiceQuestion({ question, answered, selectedChoice, isCorrect, onSelect }: ChoiceQuestionProps) {
    return (
        <div className="space-y-3">
            {question.options.map((opt, i) => {
                let cls = "p-4 rounded-xl border transition-all cursor-pointer ";
                if (!answered) {
                    cls += "border-border-dark hover:border-accent/50 hover:bg-white/5";
                } else if (i === selectedChoice && isCorrect) {
                    cls += "border-success/50 bg-success/10";
                } else if (i === selectedChoice && !isCorrect) {
                    cls += "border-danger/50 bg-danger/10 animate-shake";
                } else {
                    cls += "border-border-dark opacity-50";
                }
                return (
                    <button key={i} onClick={() => onSelect(i)} className={`w-full text-left min-h-[48px] ${cls}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${answered && i === selectedChoice && isCorrect ? "border-success text-success" :
                                answered && i === selectedChoice && !isCorrect ? "border-danger text-danger" :
                                    "border-border-dark text-text-muted"
                                }`}>
                                {answered && i === selectedChoice && isCorrect ? "✓" :
                                    answered && i === selectedChoice && !isCorrect ? "✗" :
                                        String.fromCharCode(65 + i)}
                            </div>
                            <span className={`text-sm ${answered && i === selectedChoice && isCorrect ? "text-success font-medium" :
                                answered && i === selectedChoice && !isCorrect ? "text-danger" : "text-text-secondary"}`}>
                                {opt}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
