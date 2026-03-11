export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { sanitizeCourseUpdate } from "@/lib/academy/validators";
import { logAdminAction } from "@/lib/academy/audit";

// GET: List all courses (with modules count)
export async function GET(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { data: courses, error } = await supabaseAdmin
        .from("courses")
        .select("*, modules(id, title, order_index, lessons(id), quiz_questions(id))")
        .order("order_index");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ courses: courses || [] });
}

// POST: Create a new course
export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const body = await request.json();
    const { title, description, subtitle, emoji, level, is_free } = body;

    if (!title?.trim()) {
        return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("courses")
        .insert({
            title: title.trim(),
            description: description?.trim() || "",
            subtitle: subtitle?.trim() || "",
            emoji: emoji || "📦",
            level: level || "Principiante",
            is_free: is_free || false,
            published: false,
            order_index: 0,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "course.create",
        targetTable: "courses",
        targetId: data.id,
        changes: { after: data },
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ course: data });
}
