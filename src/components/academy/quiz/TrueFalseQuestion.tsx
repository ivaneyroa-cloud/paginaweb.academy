"use client";

import type { TrueFalseQuestion as TFQ } from "./types";

interface TrueFalseQuestionProps {
    question: TFQ;
    answered: boolean;
    selectedTF: boolean | null;
    onSelect: (value: boolean) => void;
}

export default function TrueFalseQuestion({ answered, selectedTF, onSelect }: TrueFalseQuestionProps) {
    // After answering, we only know if the selected answer was correct or not (via isCorrect from parent).
    // Since TF has only 2 options, if the user picked one and it's wrong, the other is correct.
    // But we DON'T have isCorrect here — we just show selected state.
    // The parent handles isCorrect via FeedbackBar. Here we just show which was selected.
    return (
        <div className="grid grid-cols-2 gap-4">
            {[true, false].map((val) => {
                let cls = "p-6 rounded-xl border-2 transition-all cursor-pointer text-center min-h-[80px] flex flex-col items-center justify-center ";
                if (!answered) {
                    cls += "border-border-dark hover:border-accent/50 hover:bg-white/5";
                } else if (val === selectedTF) {
                    cls += "border-primary/50 bg-primary/10";
                } else {
                    cls += "border-border-dark opacity-50";
                }
                return (
                    <button key={String(val)} onClick={() => onSelect(val)} className={cls}>
                        <div className="text-3xl mb-2">{val ? "✅" : "❌"}</div>
                        <div className={`font-bold ${answered && val === selectedTF ? "text-primary" : "text-white"}`}>
                            {val ? "VERDADERO" : "FALSO"}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
