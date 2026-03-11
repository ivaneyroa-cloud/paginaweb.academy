"use client";

import type { CalculationQuestion as CalcQ } from "./types";

interface CalculationQuestionProps {
    question: CalcQ;
    answered: boolean;
    isCorrect: boolean;
    calcAnswer: string;
    onAnswerChange: (value: string) => void;
    onSubmit: () => void;
}

export default function CalculationQuestion({ question, answered, isCorrect, calcAnswer, onAnswerChange, onSubmit }: CalculationQuestionProps) {
    return (
        <div className="space-y-4">
            <div className="flex gap-3 items-center">
                <input
                    type="text"
                    inputMode="decimal"
                    value={calcAnswer}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSubmit()}
                    disabled={answered}
                    placeholder="Tu resultado..."
                    className={`flex-1 px-4 py-3 min-h-[48px] rounded-xl border text-white bg-surface-solid focus:outline-none transition-colors text-right text-lg font-mono ${answered
                        ? isCorrect
                            ? "border-success/50 bg-success/10"
                            : "border-danger/50 bg-danger/10"
                        : "border-border-dark focus:border-accent"
                        }`}
                />
                <span className="text-text-muted text-sm font-medium">
                    {question.unit}
                </span>
                {!answered && (
                    <button
                        onClick={onSubmit}
                        disabled={!calcAnswer.trim()}
                        className="px-6 py-3 min-h-[48px] rounded-xl gradient-bg text-white font-semibold btn-glow disabled:opacity-50 transition-opacity"
                    >
                        Calcular
                    </button>
                )}
            </div>
            {answered && (
                <p className={`text-sm ${isCorrect ? "text-success" : "text-danger"}`}>
                    {isCorrect ? "¡Cálculo perfecto!" : "Respuesta incorrecta"}
                </p>
            )}
        </div>
    );
}
