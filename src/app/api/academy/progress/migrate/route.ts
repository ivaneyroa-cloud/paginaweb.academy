// ─── Progress Migration API ───
// One-time endpoint to merge localStorage progress into DB

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireUser } from "@/lib/academy/auth";

export async function POST(request: Request) {
    const auth = await requireUser(request);
    if (!auth.success) return auth.response;

    const { completed_lessons, passed_quizzes, xp } = await request.json();

    // Validate arrays
    if (!Array.isArray(completed_lessons) || !Array.isArray(passed_quizzes)) {
        return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Cap XP to prevent manipulation (max reasonable XP per item)
    const maxPossibleXp = (completed_lessons.length + passed_quizzes.length) * 20;
    const safeXp = Math.min(xp || 0, maxPossibleXp);

    const { data, error } = await supabaseAdmin
        .from("user_progress")
        .upsert(
            {
                user_id: auth.user.id,
                completed_lessons,
                passed_quizzes,
                xp: safeXp,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
        )
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ progress: data });
}
