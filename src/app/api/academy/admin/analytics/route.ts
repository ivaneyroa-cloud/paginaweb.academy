import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";
import { cachedQuery } from "@/lib/academy/analyticsCache";

export async function GET(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    try {
        const analytics = await cachedQuery("admin:analytics", async () => {
            // 1. All auth users (paginated)
            const allUsers: any[] = [];
            let page = 1;
            let hasMore = true;
            while (hasMore) {
                const { data: { users } } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
                allUsers.push(...users);
                hasMore = users.length === 1000;
                page++;
                if (page > 50) break;
            }

            const totalUsers = allUsers.length;

            const userList = allUsers.map((u: any) => ({
                id: u.id,
                email: u.email,
                name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "—",
                created_at: u.created_at,
                last_sign_in: u.last_sign_in_at,
                provider: u.app_metadata?.provider || "email",
            })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            // 2. Time-based counts
            const now = new Date();
            const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
            const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
            const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

            const todaySignups = userList.filter((u: any) => new Date(u.created_at) > todayStart).length;
            const weekSignups = userList.filter((u: any) => new Date(u.created_at) > sevenDaysAgo).length;
            const monthSignups = userList.filter((u: any) => new Date(u.created_at) > thirtyDaysAgo).length;
            const activeUsers = userList.filter((u: any) => u.last_sign_in && new Date(u.last_sign_in) > sevenDaysAgo).length;

            // 3. Course stats
            const { data: courses } = await supabaseAdmin
                .from("courses")
                .select(`id, title, published, modules (id, title, lessons (id, title), quiz_questions (id))`);

            const courseStats = (courses || []).map((c: any) => {
                const modules = c.modules || [];
                return {
                    id: c.id,
                    title: c.title,
                    published: c.published,
                    modules: modules.length,
                    lessons: modules.reduce((s: number, m: any) => s + (m.lessons?.length || 0), 0),
                    quizzes: modules.reduce((s: number, m: any) => s + (m.quiz_questions?.length || 0), 0),
                    moduleNames: modules.map((m: any) => m.title),
                };
            });

            // 4. User progress data
            const { data: progressData } = await supabaseAdmin
                .from("user_progress")
                .select("*");

            const progressMap = new Map();
            (progressData || []).forEach((p: any) => {
                progressMap.set(p.user_id, p);
            });

            const totalLessonsPerCourse = courseStats.reduce((sum: number, c: any) => sum + c.lessons, 0);

            const usersWithProgress = userList.map((u: any) => {
                const prog = progressMap.get(u.id);
                const completedLessons = prog?.completed_lessons?.length || 0;
                const passedQuizzes = prog?.passed_quizzes?.length || 0;
                const xp = prog?.xp || 0;
                const lastActivity = prog?.updated_at || null;
                const courseComplete = totalLessonsPerCourse > 0 && completedLessons >= totalLessonsPerCourse;

                return {
                    ...u,
                    completedLessons,
                    passedQuizzes,
                    xp,
                    lastActivity,
                    courseComplete,
                    progressPercent: totalLessonsPerCourse > 0 ? Math.round((completedLessons / totalLessonsPerCourse) * 100) : 0,
                };
            });

            const usersStarted = usersWithProgress.filter((u: any) => u.completedLessons > 0).length;
            const usersCompleted = usersWithProgress.filter((u: any) => u.courseComplete).length;
            const avgProgress = usersWithProgress.length > 0
                ? Math.round(usersWithProgress.reduce((sum: number, u: any) => sum + u.progressPercent, 0) / usersWithProgress.length)
                : 0;
            const totalXPEarned = usersWithProgress.reduce((sum: number, u: any) => sum + u.xp, 0);

            // 5. Signup trend (last 14 days)
            const signupTrend: { date: string; count: number }[] = [];
            for (let i = 13; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split("T")[0];
                const count = userList.filter((u: any) => u.created_at?.startsWith(dateStr)).length;
                signupTrend.push({ date: dateStr, count });
            }

            return {
                totalUsers,
                todaySignups,
                weekSignups,
                monthSignups,
                activeUsers,
                usersStarted,
                usersCompleted,
                avgProgress,
                totalXPEarned,
                signupTrend,
                courseStats,
                userList: usersWithProgress,
            };
        });

        return NextResponse.json(analytics, {
            headers: {
                "Cache-Control": "private, max-age=30, stale-while-revalidate=60",
            },
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
