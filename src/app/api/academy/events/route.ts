export const dynamic = 'force-dynamic';
// ─── Event Tracking API ───
// Append-only event log for analytics

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireUser } from "@/lib/academy/auth";

const VALID_EVENTS = [
    "course_started", "course_completed",
    "module_started", "module_completed",
    "lesson_started", "lesson_completed",
    "quiz_started", "quiz_passed", "quiz_failed",
] as const;

type EventType = (typeof VALID_EVENTS)[number];

interface EventPayload {
    event_type: EventType;
    course_id?: string;
    module_id?: string;
    lesson_id?: string;
    quiz_id?: string;
    metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
    const auth = await requireUser(request);
    if (!auth.success) return auth.response;

    const body: EventPayload = await request.json();

    // Validate event_type
    if (!VALID_EVENTS.includes(body.event_type as EventType)) {
        return NextResponse.json(
            { error: `Invalid event_type. Must be one of: ${VALID_EVENTS.join(", ")}` },
            { status: 400 }
        );
    }

    // Validate UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    for (const field of ["course_id", "module_id", "lesson_id", "quiz_id"] as const) {
        if (body[field] && !uuidRegex.test(body[field] as string)) {
            return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
        }
    }

    // Sanitize metadata — max 1KB
    const metadata = body.metadata || {};
    if (JSON.stringify(metadata).length > 1024) {
        return NextResponse.json({ error: "metadata too large" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("user_events").insert({
        user_id: auth.user.id, // Always from JWT, never from body
        event_type: body.event_type,
        course_id: body.course_id || null,
        module_id: body.module_id || null,
        lesson_id: body.lesson_id || null,
        quiz_id: body.quiz_id || null,
        metadata,
    });

    if (error) {
        // Don't fail hard — events are best-effort
        console.error("Event insert error:", error);
        return NextResponse.json({ error: "Failed to record event" }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
}
