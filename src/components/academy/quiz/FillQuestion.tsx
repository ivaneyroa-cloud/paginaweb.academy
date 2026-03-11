"use client";

import type { FillQuestion as FillQ } from "./types";

interface FillQuestionProps {
    question: FillQ;
    answered: boolean;
    isCorrect: boolean;
    fillAnswer: string;
    onAnswerChange: (value: string) => void;
    onSubmit: () => void;
}

export default function FillQuestion({ question, answered, isCorrect, fillAnswer, onAnswerChange, onSubmit }: FillQuestionProps) {
    return (
        <div className="space-y-4">
            {question.hint && (
                <p className="text-text-muted text-xs italic">
                    Pista: {question.hint}
                </p>
            )}
            <div className="flex gap-3">
                <input
                    type="text"
                    value={fillAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                    disabled={answered}
                    placeholder="Escribí tu respuesta..."
                    className={`flex-1 px-4 py-3 min-h-[48px] rounded-xl border text-white bg-surface-solid focus:outline-none transition-colors text-base ${answered
                        ? isCorrect
                            ? "border-success/50 bg-success/10"
                            : "border-danger/50 bg-danger/10"
                        : "border-border-dark focus:border-accent"
                        }`}
                />
                {!answered && (
                    <button
                        onClick={onSubmit}
                        disabled={!fillAnswer.trim()}
                        className="px-6 py-3 min-h-[48px] rounded-xl gradient-bg text-white font-semibold btn-glow disabled:opacity-50 transition-opacity"
                    >
                        Enviar
                    </button>
                )}
            </div>
        </div>
    );
}
