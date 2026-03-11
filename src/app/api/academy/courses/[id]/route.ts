// ─── Public Course Detail ───
// Uses anon client + strips correct_index from quiz questions

import { NextResponse } from "next/server";
import { supabaseAdmin as supabasePublic } from "@/lib/academy/supabaseAdmin";
import { cachedQuery } from "@/lib/academy/analyticsCache";


export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const course = await cachedQuery(`public:course:${id}`, async () => {
            const { data, error } = await supabasePublic
                .from("courses")
                .select(`
                    id, title, description, subtitle, emoji, level, is_free, published, order_index, created_at,
                    modules (
                        id, title, order_index,
                        lessons (id, title, youtube_url, duration, content_markdown, xp_reward, order_index, notes, guide, action_links),
                        quiz_questions (id, module_id, type, question, options, explanation, xp, order_index,
                            correct_index, correct_answer, correct_order, accepted_answers, tolerance, unit, scenario, scenario_options)
                    )
                `)
                .eq("id", id)
                .eq("published", true)
                .single();

            if (error || !data) return null;

            // Sort modules and their children
            data.modules = (data.modules || [])
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((m: any) => ({
                    ...m,
                    lessons: (m.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index),
                    quiz_questions: (m.quiz_questions || [])
                        .sort((a: any, b: any) => a.order_index - b.order_index)
                        .map((q: any) => ({
                            // PUBLIC: Strip all answer fields — grading is server-side via /api/quiz/grade
                            id: q.id,
                            module_id: q.module_id,
                            type: q.type || "choice",
                            question: q.question,
                            xp: q.xp,
                            order_index: q.order_index,
                            // Only include non-answer data
                            options: q.type === "scenario"
                                ? (q.scenario_options || []).map((o: any) => ({ text: o.text }))
                                : q.options,
                            scenario: q.scenario,
                            unit: q.unit,
                            hint: q.hint,
                        })),
                }));

            return data;
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        return NextResponse.json({ course }, {
            headers: {
                "Cache-Control": "public, s-maxage=120, max-age=60, stale-while-revalidate=300",
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
