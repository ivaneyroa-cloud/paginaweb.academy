export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/academy/supabaseAdmin";
import { requireAdmin } from "@/lib/academy/auth";

export async function GET(request: Request) {
    const auth = await requireAdmin(request);
    if (!auth.success) return auth.response;

    // Fetch all auth users using admin API (paginated)
    const allUsers: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage: 1000,
        });

        if (listError) {
            return NextResponse.json({ error: listError.message }, { status: 500 });
        }

        allUsers.push(...users);
        hasMore = users.length === 1000;
        page++;

        // Safety valve
        if (page > 50) break;
    }

    const formattedUsers = allUsers.map((u) => ({
        id: u.id,
        email: u.email,
        fullName: u.user_metadata?.full_name || u.email?.split("@")[0] || "Sin nombre",
        createdAt: u.created_at,
        lastSignIn: u.last_sign_in_at,
        provider: u.app_metadata?.provider || "email",
    }));

    return NextResponse.json({
        users: formattedUsers,
        totalUsers: formattedUsers.length,
    });
}
