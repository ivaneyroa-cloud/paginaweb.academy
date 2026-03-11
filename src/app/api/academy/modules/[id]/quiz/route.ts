// ─── Module Quiz Questions API ───
// GET /api/modules/[id]/quiz — Returns quiz questions for a module (answers stripped)
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Fetch module info
        const { data: mod } = await supabase
            .from("modules")
            .select("id, title, order_index, course_id")
            .eq("id", id)
            .single();

        if (!mod) {
            return NextResponse.json({ error: "Module not found" }, { status: 404 });
        }

        // Fetch quiz questions — STRIP all answer fields
        const { data: questions, error } = await supabase
            .from("quiz_questions")
            .select("id, module_id, type, question, options, xp, order_index, scenario, unit, hint, scenario_options")
            .eq("module_id", id)
            .order("order_index", { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Strip answers from scenario_options (only keep text, not correct/feedback)
        const safeQuestions = (questions || []).map(q => ({
            id: q.id,
            module_id: q.module_id,
            type: q.type || "choice",
            question: q.question,
            xp: q.xp || 5,
            order_index: q.order_index,
            options: q.type === "scenario"
                ? (q.scenario_options || []).map((o: any) => ({ text: o.text }))
                : q.options,
            scenario: q.scenario,
            unit: q.unit,
            hint: q.hint,
        }));

        return NextResponse.json({
            module: {
                id: mod.id,
                title: mod.title,
                moduleIndex: (mod.order_index || 0) + 1,
                courseId: mod.course_id,
            },
            questions: safeQuestions,
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=60, max-age=30, stale-while-revalidate=120",
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
