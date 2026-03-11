// ─── Admin Audit Logging ───
// Logs all admin mutations for accountability

import { supabaseAdmin } from "./supabaseAdmin";

export async function logAdminAction(params: {
    adminEmail: string;
    action: string;
    targetTable: string;
    targetId?: string;
    changes?: { before?: unknown; after?: unknown };
    ip?: string;
}) {
    try {
        await supabaseAdmin.from("admin_audit_log").insert({
            admin_email: params.adminEmail,
            action: params.action,
            target_table: params.targetTable,
            target_id: params.targetId,
            changes: params.changes,
            ip_address: params.ip,
        });
    } catch (err) {
        // Audit logging should never break the main flow
        console.error("Audit log failed:", err);
    }
}
