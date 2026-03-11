// ─── Lesson Detail API ───
// GET /api/lessons/[id] — Returns lesson with module context and navigation
import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/academy/supabaseAdmin";


export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Fetch the lesson
        const { data: lesson, error } = await supabase
            .from("lessons")
            .select("id, title, youtube_url, duration, content_markdown, xp_reward, order_index, notes, guide, action_links, module_id")
            .eq("id", id)
            .single();

        if (error || !lesson) {
            return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
        }

        // Fetch the module for context
        const { data: mod } = await supabase
            .from("modules")
            .select("id, title, order_index, course_id")
            .eq("id", lesson.module_id)
            .single();

        if (!mod) {
            return NextResponse.json({ error: "Module not found" }, { status: 404 });
        }

        // Fetch all lessons in this module for prev/next navigation
        const { data: siblings } = await supabase
            .from("lessons")
            .select("id, order_index")
            .eq("module_id", lesson.module_id)
            .order("order_index", { ascending: true });

        const sorted = siblings || [];
        const currentIdx = sorted.findIndex(l => l.id === id);
        const prevLessonId = currentIdx > 0 ? sorted[currentIdx - 1].id : null;
        const nextLessonId = currentIdx < sorted.length - 1 ? sorted[currentIdx + 1].id : null;

        // Extract youtubeId from youtube_url
        let youtubeId = "";
        if (lesson.youtube_url) {
            const match = lesson.youtube_url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            youtubeId = match ? match[1] : lesson.youtube_url;
        }

        return NextResponse.json({
            lesson: {
                id: lesson.id,
                title: lesson.title,
                youtubeId,
                duration: lesson.duration || "3 min",
                xpReward: lesson.xp_reward || 10,
                notes: lesson.notes || [],
                guide: lesson.guide || [],
                actionLinks: lesson.action_links || [],
                moduleId: mod.id,
                moduleTitle: mod.title,
                moduleIndex: (mod.order_index || 0) + 1,
                courseId: mod.course_id,
                prevLessonId,
                nextLessonId,
            }
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=120, max-age=60, stale-while-revalidate=300",
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
