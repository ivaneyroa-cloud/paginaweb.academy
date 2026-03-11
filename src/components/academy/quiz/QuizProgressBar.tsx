"use client";

interface QuizProgressBarProps {
    title: string;
    currentIndex: number;
    totalQuestions: number;
}

export default function QuizProgressBar({ title, currentIndex, totalQuestions }: QuizProgressBarProps) {
    const progress = (currentIndex / totalQuestions) * 100;

    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-medium">{title}</span>
                <span className="text-text-muted text-xs">
                    {currentIndex + 1} de {totalQuestions}
                </span>
            </div>
            <div className="w-full h-2 rounded-full bg-border-dark overflow-hidden">
                <div
                    className="h-full rounded-full gradient-bg transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
