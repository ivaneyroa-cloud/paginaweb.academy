import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit } from "@/lib/rateLimit";

/* ══════════════════════════════════════════════════════════
   POST /api/quote — Receives quote form data and sends email
   Uses Resend (free tier: 100 emails/day)
   ══════════════════════════════════════════════════════════ */

const resend = new Resend(process.env.RESEND_API_KEY);

/* Rate limit: 5 quotes per minute per IP */
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

export async function POST(req: NextRequest) {
    try {
        /* Rate limit check */
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const { limited } = checkRateLimit(`quote:${ip}`, RATE_LIMIT, RATE_WINDOW);
        if (limited) {
            return NextResponse.json(
                { error: "Demasiadas solicitudes. Esperá un momento." },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { nombre, telefono, origen, peso, company } = body;

        /* ── Honeypot: if 'company' has a value, it's a bot ── */
        if (company) {
            // Return fake success — bot thinks it worked
            return NextResponse.json({ success: true });
        }

        /* ── Validation ── */
        if (!nombre || !telefono || !origen) {
            return NextResponse.json(
                { error: "Faltan campos obligatorios." },
                { status: 400 }
            );
        }

        /* ── Origin label mapping ── */
        const originLabels: Record<string, string> = {
            china: "China",
            usa: "Estados Unidos",
            europa: "Europa",
        };

        /* ── Send email via Resend ── */
        const { error } = await resend.emails.send({
            from: "Shippar Web <onboarding@resend.dev>",
            to: "ivaneyroa@shippar.net",
            subject: `Nueva cotización — ${nombre} | ${originLabels[origen] ?? origen}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a1628; color: #ffffff; border-radius: 16px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #1DA1FF, #2BC0FF); padding: 24px 32px;">
                        <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">Nueva solicitud de cotización</h1>
                        <p style="margin: 4px 0 0; font-size: 13px; color: rgba(255,255,255,0.85);">Shippar — Cotizador web</p>
                    </div>
                    <div style="padding: 28px 32px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 13px; width: 140px;">Nombre</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 14px; font-weight: 600;">${nombre}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 13px;">Teléfono</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #ffffff; font-size: 14px; font-weight: 600;">${telefono}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); font-size: 13px;">Origen</td>
                                <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.06); color: #2BC0FF; font-size: 14px; font-weight: 600;">${originLabels[origen] ?? origen}</td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; color: rgba(255,255,255,0.5); font-size: 13px;">Peso estimado</td>
                                <td style="padding: 12px 0; color: #ffffff; font-size: 14px; font-weight: 600;">${peso ? `${peso} kg` : "No especificado"}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 24px; padding: 16px; background: rgba(43,192,255,0.06); border: 1px solid rgba(43,192,255,0.12); border-radius: 10px;">
                            <p style="margin: 0; font-size: 12px; color: rgba(255,255,255,0.5);">Destino: <strong style="color: #ffffff;">Argentina</strong></p>
                        </div>
                    </div>
                    <div style="padding: 16px 32px; background: rgba(0,0,0,0.15); border-top: 1px solid rgba(255,255,255,0.04);">
                        <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.3);">Enviado desde shippar.app</p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json(
                { error: "Error al enviar la cotización." },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Quote email error:", error);
        return NextResponse.json(
            { error: "Error al enviar la cotización. Intentá nuevamente." },
            { status: 500 }
        );
    }
}
