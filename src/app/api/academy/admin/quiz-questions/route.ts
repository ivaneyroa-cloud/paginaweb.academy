export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { sanitizeQuizUpdate } from "@/lib/academy/validators";
import { logAdminAction } from "@/lib/academy/audit";
import { invalidateCache } from "@/lib/academy/analyticsCache";

// POST: create quiz question
export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const body = await request.json();
    const { module_id, type, question, options, correct_index, explanation, xp, order_index } = body;

    if (!module_id || !question?.trim()) {
        return NextResponse.json({ error: "module_id and question are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("quiz_questions")
        .insert({
            module_id,
            type: type || "choice",
            question: question.trim(),
            options: options || [],
            correct_index: correct_index || 0,
            explanation: explanation || "",
            xp: xp || 10,
            order_index: order_index || 0,
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "quiz_question.create",
        targetTable: "quiz_questions",
        targetId: data.id,
        changes: { after: data },
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ quiz_question: data });
}

// DELETE
export async function DELETE(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("quiz_questions").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "quiz_question.delete",
        targetTable: "quiz_questions",
        targetId: id,
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ success: true });
}
