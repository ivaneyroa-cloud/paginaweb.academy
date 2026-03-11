// ─── Shared Quiz Types ───

export type QuestionType = "choice" | "truefalse" | "order" | "fill" | "calculation" | "scenario";

// ── Base question (public — no answers) ──
export interface BaseQuestion {
    id: string;
    type: QuestionType;
    question: string;
    xp: number;
}

// ── Public question types (no correct answers — used by QuizPlayer) ──
export interface ChoiceQuestion extends BaseQuestion {
    type: "choice";
    options: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: "truefalse";
}

export interface OrderQuestion extends BaseQuestion {
    type: "order";
    options: string[]; // shuffled items to order
}

export interface FillQuestion extends BaseQuestion {
    type: "fill";
    hint?: string;
}

export interface CalculationQuestion extends BaseQuestion {
    type: "calculation";
    scenario: string;
    unit: string;
}

export interface ScenarioQuestion extends BaseQuestion {
    type: "scenario";
    scenario: string;
    options: { text: string }[];
}

export type Question = ChoiceQuestion | TrueFalseQuestion | OrderQuestion | FillQuestion | CalculationQuestion | ScenarioQuestion;

// ── Grading API response ──
export interface GradeResult {
    correct: boolean;
    explanation: string;
    correctAnswer: any;
    xp: number;
}

// Shared labels
export const TYPE_LABEL: Record<QuestionType, string> = {
    choice: "Opción Múltiple",
    truefalse: "Verdadero o Falso",
    order: "Ordenar Pasos",
    fill: "Completar",
    calculation: "Cálculo Práctico",
    scenario: "Caso Práctico",
};

export const TYPE_EMOJI: Record<QuestionType, string> = {
    choice: "🔘",
    truefalse: "⚡",
    order: "📋",
    fill: "✏️",
    calculation: "🧮",
    scenario: "💼",
};
