"use client";

import { useState, useEffect, useCallback } from "react";
import type {
    Question, QuestionType,
    ChoiceQuestion as ChoiceQ,
    TrueFalseQuestion as TFQ,
    OrderQuestion as OrderQ,
    FillQuestion as FillQ,
    CalculationQuestion as CalcQ,
    ScenarioQuestion as ScenarioQ,
    GradeResult,
} from "./quiz/types";
import { TYPE_LABEL, TYPE_EMOJI } from "./quiz/types";
import QuizProgressBar from "./quiz/QuizProgressBar";
import QuizResults from "./quiz/QuizResults";
import FeedbackBar from "./quiz/FeedbackBar";
import ChoiceQuestion from "./quiz/ChoiceQuestion";
import TrueFalseQuestion from "./quiz/TrueFalseQuestion";
import OrderQuestion from "./quiz/OrderQuestion";
import FillQuestion from "./quiz/FillQuestion";
import CalculationQuestion from "./quiz/CalculationQuestion";
import ScenarioQuestion from "./quiz/ScenarioQuestion";

// Re-export for external usage
export type { Question } from "./quiz/types";

interface QuizPlayerProps {
    title: string;
    questions: Question[];
    moduleIndex: number;
    totalModules: number;
    onComplete: (score: number, totalXp: number, totalQuestions: number) => void;
}

// ── Server grading function ──
async function gradeAnswer(questionId: string, answer: any): Promise<GradeResult> {
    const res = await fetch("/api/academy/quiz/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, answer }),
    });
    if (!res.ok) {
        return { correct: false, explanation: "Error al verificar respuesta", correctAnswer: null, xp: 0 };
    }
    return res.json();
}

export default function QuizPlayer({ title, questions, moduleIndex, totalModules, onComplete }: QuizPlayerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [timer, setTimer] = useState(30);
    const [timerActive, setTimerActive] = useState(true);
    const [grading, setGrading] = useState(false);
    const [explanation, setExplanation] = useState("");
    const [scenarioFeedback, setScenarioFeedback] = useState("");

    // Per-question state
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [selectedTF, setSelectedTF] = useState<boolean | null>(null);
    const [orderedItems, setOrderedItems] = useState<string[]>([]);
    const [fillAnswer, setFillAnswer] = useState("");
    const [calcAnswer, setCalcAnswer] = useState("");
    const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

    const question = questions[currentIndex];

    // Timer
    useEffect(() => {
        if (!timerActive || answered || grading) return;
        if (timer <= 0) {
            handleTimeUp();
            return;
        }
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer, timerActive, answered, grading]);

    // Reset state on question change
    useEffect(() => {
        setAnswered(false);
        setIsCorrect(false);
        setGrading(false);
        setExplanation("");
        setScenarioFeedback("");
        setSelectedChoice(null);
        setSelectedTF(null);
        setFillAnswer("");
        setCalcAnswer("");
        setSelectedScenario(null);
        setTimer(question.type === "calculation" ? 60 : question.type === "order" ? 45 : 30);
        setTimerActive(true);

        if (question.type === "order") {
            const items = [...(question as OrderQ).options];
            // Shuffle if not already shuffled by API
            const shuffled = items.sort(() => Math.random() - 0.5);
            setOrderedItems(shuffled);
        }
    }, [currentIndex]);

    const handleTimeUp = useCallback(() => {
        if (answered || grading) return;
        setAnswered(true);
        setIsCorrect(false);
        setTimerActive(false);
        setExplanation("Se acabó el tiempo.");
    }, [answered, grading]);

    const processGradeResult = (result: GradeResult) => {
        setIsCorrect(result.correct);
        setExplanation(result.explanation || "");
        if (result.correct) {
            setScore((s) => s + 1);
            setXpEarned((xp) => xp + result.xp);
        }
        setAnswered(true);
        setGrading(false);
        setTimerActive(false);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((i) => i + 1);
        } else {
            setShowResults(true);
            onComplete(score, xpEarned, questions.length);
        }
    };

    // ── Answer Handlers (call server) ──
    const handleChoice = async (index: number) => {
        if (answered || grading) return;
        setSelectedChoice(index);
        setGrading(true);
        setTimerActive(false);
        const result = await gradeAnswer(question.id, index);
        processGradeResult(result);
    };

    const handleTrueFalse = async (answer: boolean) => {
        if (answered || grading) return;
        setSelectedTF(answer);
        setGrading(true);
        setTimerActive(false);
        const result = await gradeAnswer(question.id, answer);
        processGradeResult(result);
    };

    const handleOrderSubmit = async () => {
        if (answered || grading) return;
        setGrading(true);
        setTimerActive(false);
        const result = await gradeAnswer(question.id, orderedItems);
        processGradeResult(result);
    };

    const moveItem = (fromIndex: number, direction: "up" | "down") => {
        if (answered || grading) return;
        const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || toIndex >= orderedItems.length) return;
        const newItems = [...orderedItems];
        [newItems[fromIndex], newItems[toIndex]] = [newItems[toIndex], newItems[fromIndex]];
        setOrderedItems(newItems);
    };

    const handleFillSubmit = async () => {
        if (answered || grading || !fillAnswer.trim()) return;
        setGrading(true);
        setTimerActive(false);
        const result = await gradeAnswer(question.id, fillAnswer.trim());
        processGradeResult(result);
    };

    const handleCalcSubmit = async () => {
        if (answered || grading || !calcAnswer.trim()) return;
        setGrading(true);
        setTimerActive(false);
        const num = parseFloat(calcAnswer.replace(",", "."));
        const result = await gradeAnswer(question.id, num);
        processGradeResult(result);
    };

    const handleScenario = async (index: number) => {
        if (answered || grading) return;
        setSelectedScenario(index);
        setGrading(true);
        setTimerActive(false);
        const result = await gradeAnswer(question.id, index);
        setScenarioFeedback(result.explanation || "");
        processGradeResult(result);
    };

    // ── Results Screen ──
    if (showResults) {
        return (
            <QuizResults
                score={score}
                xpEarned={xpEarned}
                totalQuestions={questions.length}
                moduleIndex={moduleIndex}
                totalModules={totalModules}
                onRetry={() => {
                    setCurrentIndex(0);
                    setScore(0);
                    setXpEarned(0);
                    setShowResults(false);
                }}
            />
        );
    }

    // ── Timer Color ──
    const timerColor = timer > 15 ? "text-success" : timer > 5 ? "text-warning" : "text-danger";

    return (
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
            <QuizProgressBar title={title} currentIndex={currentIndex} totalQuestions={questions.length} />

            <div className="glass-card p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-medium">
                            {TYPE_EMOJI[question.type]} {TYPE_LABEL[question.type]}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-xp-gold/15 text-xp-gold text-xs font-medium">
                            +{question.xp} XP
                        </span>
                    </div>
                    <div className={`text-lg font-bold ${timerColor} transition-colors ${timer <= 5 && !answered ? "animate-pulse" : ""}`}>
                        ⏱ {timer}s
                    </div>
                </div>

                {/* Question Text */}
                <h3 className="text-white text-base sm:text-lg lg:text-xl font-bold mb-4 sm:mb-6 leading-relaxed">
                    {question.question}
                </h3>

                {/* Scenario description */}
                {(question.type === "calculation" || question.type === "scenario") && (
                    <div className="p-3 sm:p-4 rounded-xl bg-white/5 border border-border-dark mb-4 sm:mb-6">
                        <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
                            {question.type === "calculation"
                                ? (question as CalcQ).scenario
                                : (question as ScenarioQ).scenario}
                        </p>
                    </div>
                )}

                {/* Grading indicator */}
                {grading && (
                    <div className="flex items-center justify-center gap-2 py-4">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        <span className="text-text-secondary text-sm">Verificando...</span>
                    </div>
                )}

                {/* Question Type Renderers */}
                {!grading && (
                    <>
                        {question.type === "choice" && (
                            <ChoiceQuestion question={question as ChoiceQ} answered={answered} selectedChoice={selectedChoice} isCorrect={isCorrect} onSelect={handleChoice} />
                        )}
                        {question.type === "truefalse" && (
                            <TrueFalseQuestion question={question as TFQ} answered={answered} selectedTF={selectedTF} onSelect={handleTrueFalse} />
                        )}
                        {question.type === "order" && (
                            <OrderQuestion question={question as OrderQ} answered={answered} orderedItems={orderedItems} onMove={moveItem} onSubmit={handleOrderSubmit} />
                        )}
                        {question.type === "fill" && (
                            <FillQuestion question={question as FillQ} answered={answered} isCorrect={isCorrect} fillAnswer={fillAnswer} onAnswerChange={setFillAnswer} onSubmit={handleFillSubmit} />
                        )}
                        {question.type === "calculation" && (
                            <CalculationQuestion question={question as CalcQ} answered={answered} isCorrect={isCorrect} calcAnswer={calcAnswer} onAnswerChange={setCalcAnswer} onSubmit={handleCalcSubmit} />
                        )}
                        {question.type === "scenario" && (
                            <ScenarioQuestion question={question as ScenarioQ} answered={answered} isCorrect={isCorrect} selectedScenario={selectedScenario} scenarioFeedback={scenarioFeedback} onSelect={handleScenario} />
                        )}
                    </>
                )}

                {/* Feedback Bar */}
                {answered && !grading && (
                    <FeedbackBar
                        isCorrect={isCorrect}
                        explanation={question.type === "scenario" ? "" : explanation}
                        isLastQuestion={currentIndex >= questions.length - 1}
                        onNext={handleNext}
                    />
                )}
            </div>
        </div>
    );
}
