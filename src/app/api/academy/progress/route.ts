export const dynamic = 'force-dynamic';
// ─── Rewritten Progress API ───
// XP is now server-side. Replay prevention. No more client xp_earned.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireUser } from "@/lib/academy/auth";

export async function GET(request: Request) {
    const auth = await requireUser(request);
    if (!auth.success) return auth.response;

    const { data, error } = await supabaseAdmin
        .from("user_progress")
        .select("*")
        .eq("user_id", auth.user.id)
        .single();

    if (error && error.code !== "PGRST116") {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
        progress: data || {
            user_id: auth.user.id,
            completed_lessons: [],
            passed_quizzes: [],
            xp: 0,
        },
    });
}

export async function POST(request: Request) {
    const auth = await requireUser(request);
    if (!auth.success) return auth.response;

    const body = await request.json();
    const { action, lesson_id, quiz_id } = body;

    // ─── Read existing progress ───
    const { data: existing } = await supabaseAdmin
        .from("user_progress")
        .select("*")
        .eq("user_id", auth.user.id)
        .single();

    let completedLessons: string[] = existing?.completed_lessons || [];
    let passedQuizzes: string[] = existing?.passed_quizzes || [];
    let xp: number = existing?.xp || 0;

    // ═══ COMPLETE LESSON ═══
    if (action === "complete_lesson" && lesson_id) {
        // Replay prevention
        if (completedLessons.includes(lesson_id)) {
            return NextResponse.json({
                progress: existing,
                message: "Lesson already completed",
            });
        }

        // XP from database — NOT from client
        const { data: lesson } = await supabaseAdmin
            .from("lessons")
            .select("xp_reward")
            .eq("id", lesson_id)
            .single();

        if (!lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        completedLessons = [...completedLessons, lesson_id];
        xp += lesson.xp_reward || 10;

        // ═══ PASS QUIZ ═══
    } else if (action === "pass_quiz" && quiz_id) {
        // Replay prevention
        if (passedQuizzes.includes(quiz_id)) {
            return NextResponse.json({
                progress: existing,
                message: "Quiz already passed",
            });
        }

        // Get XP from DB
        const { data: question } = await supabaseAdmin
            .from("quiz_questions")
            .select("xp")
            .eq("id", quiz_id)
            .single();

        passedQuizzes = [...passedQuizzes, quiz_id];
        xp += question?.xp || 15;
    } else {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // ═══ Save progress ═══
    const progressData = {
        user_id: auth.user.id,
        completed_lessons: completedLessons,
        passed_quizzes: passedQuizzes,
        xp,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
        .from("user_progress")
        .upsert(progressData, { onConflict: "user_id" })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress: data });
}
