import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";

export async function POST(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    const results: string[] = [];

    // Try to create courses table via RPC (may not be available)
    try {
        await supabaseAdmin.rpc("exec_sql", {
            sql: `CREATE TABLE IF NOT EXISTS courses (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                subtitle TEXT,
                emoji TEXT DEFAULT '📦',
                level TEXT DEFAULT 'Principiante',
                is_free BOOLEAN DEFAULT false,
                published BOOLEAN DEFAULT false,
                order_index INTEGER DEFAULT 0,
                created_at TIMESTAMPTZ DEFAULT now()
            );`
        });
    } catch {
        // RPC not available — tables should be created via SQL Editor
    }

    // If rpc doesn't work, try direct SQL via REST
    // Fallback: create tables using from().insert() pattern
    // Let's try creating them via the admin client

    const tables = [
        {
            name: "courses",
            check: async () => {
                const { error } = await supabaseAdmin.from("courses").select("id").limit(1);
                return !error;
            },
        },
        {
            name: "modules",
            check: async () => {
                const { error } = await supabaseAdmin.from("modules").select("id").limit(1);
                return !error;
            },
        },
        {
            name: "lessons",
            check: async () => {
                const { error } = await supabaseAdmin.from("lessons").select("id").limit(1);
                return !error;
            },
        },
        {
            name: "quiz_questions",
            check: async () => {
                const { error } = await supabaseAdmin.from("quiz_questions").select("id").limit(1);
                return !error;
            },
        },
    ];

    for (const table of tables) {
        const exists = await table.check();
        results.push(`${table.name}: ${exists ? "✅ exists" : "❌ missing"}`);
    }

    return NextResponse.json({
        message: "Database check complete",
        results,
        sqlToRun: `
-- Run this SQL in Supabase Dashboard > SQL Editor:

CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    subtitle TEXT,
    emoji TEXT DEFAULT '📦',
    level TEXT DEFAULT 'Principiante',
    is_free BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    youtube_url TEXT,
    duration TEXT DEFAULT '3 min',
    content_markdown TEXT,
    xp_reward INTEGER DEFAULT 15,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'choice',
    question TEXT NOT NULL,
    options JSONB DEFAULT '[]',
    correct_index INTEGER DEFAULT 0,
    explanation TEXT,
    xp INTEGER DEFAULT 10,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    completed_lessons TEXT[] DEFAULT '{}',
    passed_quizzes TEXT[] DEFAULT '{}',
    xp INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
);

CREATE TABLE IF NOT EXISTS newsletter_subs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read courses" ON courses FOR SELECT USING (published = true);
CREATE POLICY "Public read modules" ON modules FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Public read quiz_questions" ON quiz_questions FOR SELECT USING (true);
CREATE POLICY "Users manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users insert newsletter" ON newsletter_subs FOR INSERT WITH CHECK (auth.uid() = user_id);
        `,
    });
}
