// ─── Event Tracking Helper ───
// Fire-and-forget event emission for analytics

import { supabase } from "@/lib/academy/supabase";

export async function trackEvent(
    eventType: string,
    ids: {
        course_id?: string;
        module_id?: string;
        lesson_id?: string;
        quiz_id?: string;
    } = {},
    metadata: Record<string, unknown> = {}
) {
    try {
        const token = (await supabase.auth.getSession()).data.session?.access_token;
        if (!token) return; // Not logged in, skip

        // Fire and forget — no await on the page
        fetch("/api/academy/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ event_type: eventType, ...ids, metadata }),
        }).catch(() => { }); // Silent fail — events are best-effort
    } catch {
        // Never let tracking break the app
    }
}
