export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { sanitizeLessonUpdate } from "@/lib/academy/validators";
import { logAdminAction } from "@/lib/academy/audit";
import { invalidateCache } from "@/lib/academy/analyticsCache";

// POST: create lesson with all fields
export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const body = await request.json();
    const {
        module_id, title, youtube_url, duration,
        content_markdown, xp_reward, order_index,
        notes, guide, action_links,
    } = body;

    if (!module_id || !title?.trim()) {
        return NextResponse.json({ error: "module_id and title are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("lessons")
        .insert({
            module_id,
            title: title.trim(),
            youtube_url: youtube_url || "",
            duration: duration || "3 min",
            content_markdown: content_markdown || "",
            xp_reward: xp_reward || 15,
            order_index: order_index || 0,
            notes: notes || [],
            guide: guide || [],
            action_links: action_links || [],
        })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "lesson.create",
        targetTable: "lessons",
        targetId: data.id,
        changes: { after: data },
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ lesson: data });
}

// PATCH: update existing lesson — with sanitized fields
export async function PATCH(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const body = await request.json();
    const sanitized = sanitizeLessonUpdate(body);

    if (Object.keys(sanitized).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("lessons")
        .update(sanitized)
        .eq("id", id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "lesson.update",
        targetTable: "lessons",
        targetId: id,
        changes: { after: sanitized },
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ lesson: data });
}

// DELETE
export async function DELETE(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("lessons").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "lesson.delete",
        targetTable: "lessons",
        targetId: id,
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ success: true });
}
