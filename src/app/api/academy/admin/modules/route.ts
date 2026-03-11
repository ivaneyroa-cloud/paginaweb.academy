export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { logAdminAction } from "@/lib/academy/audit";
import { invalidateCache } from "@/lib/academy/analyticsCache";

// POST /api/admin/modules — create module
export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const body = await request.json();
    const { course_id, title, order_index } = body;

    if (!course_id || !title?.trim()) {
        return NextResponse.json({ error: "course_id and title are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
        .from("modules")
        .insert({ course_id, title: title.trim(), order_index: order_index || 0 })
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "module.create",
        targetTable: "modules",
        targetId: data.id,
        changes: { after: data },
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ module: data });
}

// DELETE /api/admin/modules?id=xxx
export async function DELETE(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const { error } = await supabaseAdmin.from("modules").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logAdminAction({
        adminEmail: auth.user.email!,
        action: "module.delete",
        targetTable: "modules",
        targetId: id,
        ip: request.headers.get("x-forwarded-for") ?? undefined,
    });

    invalidateCache("public:courses");

    return NextResponse.json({ success: true });
}
