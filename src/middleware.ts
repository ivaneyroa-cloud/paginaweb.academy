// ─── Next.js Middleware ───
// Auth guards for Academy pages AND API routes

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_ADMIN_EMAILS = ["ivaneyroa@shippar.net", "abaleani@shippar.net"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ═══ /api/academy/admin/* — JWT + admin check ═══
    if (pathname.startsWith("/api/academy/admin")) {
        const authHeader = request.headers.get("authorization");

        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];

        try {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser(token);

            if (error || !user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Check admin status — try DB first, fallback to hardcoded
            let isAdmin = false;
            try {
                const supabaseService = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.SUPABASE_SERVICE_ROLE_KEY!
                );
                const { data: adminRecord } = await supabaseService
                    .from("admin_users")
                    .select("id")
                    .eq("email", user.email?.toLowerCase() ?? "")
                    .single();
                isAdmin = !!adminRecord;
            } catch {
                // admin_users table might not exist yet
                isAdmin = FALLBACK_ADMIN_EMAILS.includes(
                    user.email?.toLowerCase() || ""
                );
            }

            if (!isAdmin) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            // Pass user info downstream via headers
            const response = NextResponse.next();
            response.headers.set("x-user-id", user.id);
            response.headers.set("x-user-email", user.email ?? "");
            return response;
        } catch {
            return NextResponse.json({ error: "Auth failed" }, { status: 403 });
        }
    }

    // ═══ /academy/admin/* pages — redirect if not authenticated ═══
    if (pathname.startsWith("/academy/admin")) {
        const hasSession = request.cookies
            .getAll()
            .some((c) => c.name.includes("auth-token") || c.name.includes("sb-"));
        if (!hasSession) {
            return NextResponse.redirect(new URL("/academy/login", request.url));
        }
    }

    // ═══ /academy/dashboard/* pages — redirect if not authenticated ═══
    if (pathname.startsWith("/academy/dashboard")) {
        const hasSession = request.cookies
            .getAll()
            .some((c) => c.name.includes("auth-token") || c.name.includes("sb-"));
        if (!hasSession) {
            return NextResponse.redirect(new URL("/academy/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/academy/admin/:path*", "/academy/admin/:path*", "/academy/dashboard/:path*"],
};
