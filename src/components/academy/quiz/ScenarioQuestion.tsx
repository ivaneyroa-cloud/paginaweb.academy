"use client";

import type { ScenarioQuestion as ScenarioQ } from "./types";

interface ScenarioQuestionProps {
    question: ScenarioQ;
    answered: boolean;
    isCorrect: boolean;
    selectedScenario: number | null;
    scenarioFeedback: string;
    onSelect: (index: number) => void;
}

export default function ScenarioQuestion({ question, answered, isCorrect, selectedScenario, scenarioFeedback, onSelect }: ScenarioQuestionProps) {
    return (
        <div className="space-y-3">
            {question.options.map((opt, i) => {
                let cls = "p-4 rounded-xl border transition-all cursor-pointer w-full text-left min-h-[48px] ";
                if (!answered) {
                    cls += "border-border-dark hover:border-accent/50 hover:bg-white/5";
                } else if (i === selectedScenario && isCorrect) {
                    cls += "border-success/50 bg-success/10";
                } else if (i === selectedScenario && !isCorrect) {
                    cls += "border-danger/50 bg-danger/10";
                } else {
                    cls += "border-border-dark opacity-50";
                }
                return (
                    <button key={i} onClick={() => onSelect(i)} className={cls}>
                        <span className={`text-sm leading-relaxed ${answered && i === selectedScenario && isCorrect ? "text-success" :
                            answered && i === selectedScenario && !isCorrect ? "text-danger" : "text-text-secondary"
                            }`}>
                            {opt.text}
                        </span>
                    </button>
                );
            })}
            {answered && scenarioFeedback && (
                <div className={`p-4 rounded-xl border ${isCorrect ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
                    <p className={`text-sm leading-relaxed ${isCorrect ? "text-success" : "text-warning"}`}>
                        💡 {scenarioFeedback}
                    </p>
                </div>
            )}
        </div>
    );
}
