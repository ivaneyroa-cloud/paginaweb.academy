"use client";

interface FeedbackBarProps {
    isCorrect: boolean;
    explanation: string;
    isLastQuestion: boolean;
    onNext: () => void;
}

export default function FeedbackBar({ isCorrect, explanation, isLastQuestion, onNext }: FeedbackBarProps) {
    return (
        <div className="mt-6 space-y-4 animate-slide-up">
            {explanation && (
                <div className={`p-4 rounded-xl border ${isCorrect ? "border-success/30 bg-success/5" : "border-danger/30 bg-danger/5"}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{isCorrect ? "✅" : "❌"}</span>
                        <span className={`font-bold text-sm ${isCorrect ? "text-success" : "text-danger"}`}>
                            {isCorrect ? "¡Correcto!" : "Incorrecto"}
                        </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">
                        {explanation}
                    </p>
                </div>
            )}

            <button
                onClick={onNext}
                className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow hover:opacity-90 transition-opacity"
            >
                {!isLastQuestion ? "Siguiente Pregunta →" : "Ver Resultados 🏆"}
            </button>
        </div>
    );
}
