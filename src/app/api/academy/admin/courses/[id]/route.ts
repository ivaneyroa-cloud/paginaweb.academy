import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { sanitizeCourseUpdate } from "@/lib/academy/validators";
import { logAdminAction } from "@/lib/academy/audit";
import { invalidateCache } from "@/lib/academy/analyticsCache";

// GET single course with full structure
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { id } = await params;

    const { data: course, error } = await supabaseAdmin
        .from("courses")
        .select(`
            *,
            modules (
                *,
                lessons (*),
                quiz_questions (*)
            )
        `)
        .eq("id", id)
        .order("order_index", { referencedTable: "modules" })
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Sort lessons and quiz_questions within modules
    if (course?.modules) {
        course.modules = course.modules.map((m: any) => ({
            ...m,
            lessons: (m.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index),
            quiz_questions: (m.quiz_questions || []).sort((a: any, b: any) => a.order_index - b.order_index),
        }));
    }

    return NextResponse.json({ course });
}

// PATCH: update course metadata — now with field whitelist
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { id } = await params;
    const body = await request.json();

    // Sanitize: only allow whitelisted fields
    const sanitized = sanitizeCourseUpdate(body);
    if (Object.keys(sanitized).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("courses")
        .update(sanitized)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "course.update",
        targetTable: "courses",
        targetId: id,
        changes: { after: sanitized },
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    // Invalidate course cache
    invalidateCache("public:courses");
    invalidateCache(`public:course:${id}`);

    return NextResponse.json({ course: data });
}

// DELETE course
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { id } = await params;

    const { error } = await supabaseAdmin.from("courses").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "course.delete",
        targetTable: "courses",
        targetId: id,
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ success: true });
}
