export const dynamic = 'force-dynamic';
// ─── Public Courses List ───
// Uses shared lazy client + caching

import { NextResponse } from "next/server";
import { supabaseAdmin as supabasePublic } from "@/lib/academy/supabaseAdmin";
import { cachedQuery } from "@/lib/academy/analyticsCache";

export async function GET() {
    try {
        const courses = await cachedQuery("public:courses", async () => {
            const { data, error } = await supabasePublic
                .from("courses")
                .select(`
                    id, title, description, subtitle, emoji, level, is_free, published, order_index,
                    modules (
                        id, title, order_index,
                        lessons (id, title, duration, xp_reward, order_index),
                        quiz_questions (id, order_index)
                    )
                `)
                .eq("published", true)
                .order("order_index");

            if (error) throw error;

            return (data || []).map((course: any) => ({
                ...course,
                modules: (course.modules || [])
                    .sort((a: any, b: any) => a.order_index - b.order_index)
                    .map((mod: any) => ({
                        ...mod,
                        lessons: (mod.lessons || []).sort((a: any, b: any) => a.order_index - b.order_index),
                        quiz_questions: (mod.quiz_questions || []).sort((a: any, b: any) => a.order_index - b.order_index),
                    })),
                totalLessons: (course.modules || []).reduce(
                    (s: number, m: any) => s + (m.lessons?.length || 0), 0
                ),
                totalQuestions: (course.modules || []).reduce(
                    (s: number, m: any) => s + (m.quiz_questions?.length || 0), 0
                ),
            }));
        });

        return NextResponse.json({ courses }, {
            headers: {
                "Cache-Control": "public, s-maxage=60, max-age=30, stale-while-revalidate=120",
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
