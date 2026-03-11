// ─── Centralized Auth Helpers ───
// Replaces 9 copies of verifyAdmin() across route handlers

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "./supabaseAdmin";

// ─── Types ───

type AuthSuccess = { success: true; user: User };
type AuthFailure = { success: false; response: NextResponse };
type AuthResult = AuthSuccess | AuthFailure;

// ─── Token extraction ───

async function getUserFromToken(request: Request): Promise<User | null> {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser(token);
    if (error || !user) return null;
    return user;
}

// ─── Admin check (DB-based, falls back to hardcoded list) ───

const FALLBACK_ADMIN_EMAILS = [
    "ivaneyroa@shippar.net",
    "abaleani@shippar.net",
];

async function checkIsAdmin(email: string | undefined): Promise<boolean> {
    if (!email) return false;
    const normalizedEmail = email.toLowerCase();

    // Try DB lookup first (admin_users table)
    try {
        const { data } = await supabaseAdmin
            .from("admin_users")
            .select("id")
            .eq("email", normalizedEmail)
            .single();
        if (data) return true;
    } catch {
        // Table might not exist yet — fall back to hardcoded list
    }

    // Fallback to hardcoded list
    return FALLBACK_ADMIN_EMAILS.includes(normalizedEmail);
}

// ─── Public API ───

export async function requireUser(request: Request): Promise<AuthResult> {
    const user = await getUserFromToken(request);
    if (!user) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }
    return { success: true, user };
}

export async function requireAdmin(request: Request): Promise<AuthResult> {
    const user = await getUserFromToken(request);
    if (!user) {
        return {
            success: false,
            response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
        };
    }

    const isAdmin = await checkIsAdmin(user.email);
    if (!isAdmin) {
        return {
            success: false,
            response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        };
    }

    return { success: true, user };
}

export { checkIsAdmin as isAdminEmail };
