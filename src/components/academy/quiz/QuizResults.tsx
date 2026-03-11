"use client";

interface QuizResultsProps {
    score: number;
    xpEarned: number;
    totalQuestions: number;
    moduleIndex: number;
    totalModules: number;
    onRetry: () => void;
}

export default function QuizResults({ score, xpEarned, totalQuestions, moduleIndex, totalModules, onRetry }: QuizResultsProps) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;
    const isLastModule = moduleIndex >= totalModules;
    const nextModuleLesson = `l${moduleIndex + 1}`;

    return (
        <div className="glass-card p-8 sm:p-12 text-center max-w-lg mx-auto animate-fade-in">
            <div className="text-6xl mb-6">
                {passed ? (isLastModule ? "🎓" : "🏆") : "💪"}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
                {passed
                    ? isLastModule
                        ? "¡Curso completado!"
                        : "¡Módulo completado!"
                    : "¡Buen intento!"}
            </h2>
            <p className="text-text-secondary mb-8">
                {passed
                    ? isLastModule
                        ? "Felicitaciones, terminaste todo el curso. Ya tenés las bases para importar."
                        : "Aprobaste el quiz. El siguiente módulo ya está desbloqueado."
                    : "Necesitás 70% para aprobar. Revisá el material y volvé a intentarlo."}
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
                <div className="text-center">
                    <div className={`text-4xl font-bold ${passed ? "text-success" : "text-warning"}`}>
                        {percentage}%
                    </div>
                    <div className="text-text-muted text-xs mt-1">Precisión</div>
                </div>
                <div className="w-px h-12 bg-border-dark" />
                <div className="text-center">
                    <div className="text-4xl font-bold text-xp-gold">{xpEarned}</div>
                    <div className="text-text-muted text-xs mt-1">XP Ganados</div>
                </div>
                <div className="w-px h-12 bg-border-dark" />
                <div className="text-center">
                    <div className="text-4xl font-bold text-white">
                        {score}/{totalQuestions}
                    </div>
                    <div className="text-text-muted text-xs mt-1">Correctas</div>
                </div>
            </div>

            <div className="space-y-3">
                {passed && !isLastModule && (
                    <a
                        href={`/dashboard/lesson/${nextModuleLesson}`}
                        className="block w-full py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow text-center"
                    >
                        🚀 Avanzar al Módulo {moduleIndex + 1}
                    </a>
                )}
                {passed && isLastModule && (
                    <a
                        href="/academy/dashboard/certificate"
                        className="block w-full py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow text-center"
                    >
                        🎓 Ver tu certificado
                    </a>
                )}
                {!passed && (
                    <button
                        onClick={onRetry}
                        className="w-full py-3.5 rounded-xl gradient-bg text-white font-semibold btn-glow"
                    >
                        🔄 Reintentar Quiz
                    </button>
                )}
                <a
                    href="/academy/dashboard"
                    className="block w-full py-3.5 rounded-xl glass text-white font-medium text-center hover:border-border-hover transition-colors"
                >
                    Volver al Dashboard
                </a>
            </div>
        </div>
    );
}
