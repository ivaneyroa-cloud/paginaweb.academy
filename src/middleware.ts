// ─── Next.js Middleware ───
// i18n locale routing + Auth guards for Academy pages AND API routes

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const FALLBACK_ADMIN_EMAILS = ["ivaneyroa@shippar.net", "abaleani@shippar.net"];

const SUPPORTED_LOCALES = ["es", "en"];
const DEFAULT_LOCALE = "es";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ═══ i18n — locale prefix routing ═══
    // Check if the pathname starts with a supported locale prefix
    const pathnameSegments = pathname.split("/");
    const maybeLocale = pathnameSegments[1]; // e.g. "en" from "/en/servicios/courier"

    if (SUPPORTED_LOCALES.includes(maybeLocale) && maybeLocale !== DEFAULT_LOCALE) {
        // Strip the locale prefix and rewrite to the actual page
        const strippedPath = "/" + pathnameSegments.slice(2).join("/") || "/";
        const url = request.nextUrl.clone();
        url.pathname = strippedPath;

        const response = NextResponse.rewrite(url);
        // Set locale cookie so the client knows which language to use
        response.cookies.set("NEXT_LOCALE", maybeLocale, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: "lax",
        });
        return response;
    }

    // If accessing the default locale (es) path, set/clear the cookie
    if (maybeLocale === DEFAULT_LOCALE) {
        // /es/servicios/courier → /servicios/courier (redirect to canonical)
        const strippedPath = "/" + pathnameSegments.slice(2).join("/") || "/";
        const url = request.nextUrl.clone();
        url.pathname = strippedPath;
        const response = NextResponse.redirect(url, 308);
        response.cookies.set("NEXT_LOCALE", DEFAULT_LOCALE, {
            path: "/",
            maxAge: 60 * 60 * 24 * 365,
            sameSite: "lax",
        });
        return response;
    }

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
    matcher: [
        // i18n locale prefixes
        "/en/:path*",
        "/es/:path*",
        // Academy auth
        "/api/academy/admin/:path*",
        "/academy/admin/:path*",
        "/academy/dashboard/:path*",
    ],
};
