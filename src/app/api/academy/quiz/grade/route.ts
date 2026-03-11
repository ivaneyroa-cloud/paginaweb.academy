export const dynamic = 'force-dynamic';
// ─── Server-Side Quiz Grading ───
// POST /api/quiz/grade
// Body: { questionId: string, answer: any }
// Returns: { correct: boolean, explanation: string, correctAnswer?: any }

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { questionId, answer } = body;

        if (!questionId || answer === undefined) {
            return NextResponse.json(
                { error: "questionId and answer are required" },
                { status: 400 }
            );
        }

        // Fetch the question with its correct answer from DB
        const { data: question, error } = await supabaseAdmin
            .from("quiz_questions")
            .select("*")
            .eq("id", questionId)
            .single();

        if (error || !question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        let correct = false;
        let explanation = question.explanation || "";
        let correctAnswer: any = undefined;

        const type = question.type || "choice";

        switch (type) {
            case "choice": {
                correct = answer === question.correct_index;
                correctAnswer = question.correct_index;
                break;
            }
            case "truefalse": {
                correct = answer === question.correct_answer;
                correctAnswer = question.correct_answer;
                break;
            }
            case "order": {
                const expected = question.correct_order || [];
                correct = JSON.stringify(answer) === JSON.stringify(expected);
                correctAnswer = expected;
                break;
            }
            case "fill": {
                const accepted = (question.accepted_answers || []) as string[];
                const userAnswer = String(answer).toLowerCase().trim();
                correct = accepted.some((a: string) => {
                    const acc = a.toLowerCase().trim();
                    return userAnswer.includes(acc) || acc.includes(userAnswer);
                });
                correctAnswer = accepted[0];
                break;
            }
            case "calculation": {
                const num = parseFloat(String(answer).replace(",", "."));
                const tolerance = question.tolerance || 0.5;
                correct = !isNaN(num) && Math.abs(num - question.correct_answer) <= tolerance;
                correctAnswer = question.correct_answer;
                break;
            }
            case "scenario": {
                const options = question.scenario_options || [];
                const selected = options[answer];
                if (selected) {
                    correct = selected.correct === true;
                    explanation = selected.feedback || explanation;
                }
                correctAnswer = options.findIndex((o: any) => o.correct);
                break;
            }
        }

        return NextResponse.json({
            correct,
            explanation,
            correctAnswer,
            xp: correct ? (question.xp || 5) : 0,
        });
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 500 }
        );
    }
}
