export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, interest, message } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: "Nombre y email son requeridos" },
                { status: 400 }
            );
        }

        const web3formsKey = process.env.WEB3FORMS_KEY;

        if (!web3formsKey) {
            console.warn("WEB3FORMS_KEY not set — form data logged but not emailed");
            console.log("Contact form submission:", body);
            return NextResponse.json({ success: true, method: "logged" });
        }

        // Send via Web3Forms (free email forwarding)
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                access_key: web3formsKey,
                subject: `Nuevo lead desde Shippar Academy: ${name}`,
                from_name: "Shippar Academy",
                name,
                email,
                phone: phone || "No proporcionado",
                interest: interest || "No especificado",
                message: message || "Sin mensaje adicional",
            }),
        });

        const responseText = await response.text();
        console.log("Web3Forms response:", response.status, responseText.substring(0, 300));

        let result;
        try {
            result = JSON.parse(responseText);
        } catch {
            console.error("Web3Forms returned non-JSON:", responseText.substring(0, 200));
            if (response.ok) {
                return NextResponse.json({ success: true, method: "emailed" });
            }
            return NextResponse.json(
                { error: "Error al enviar el formulario" },
                { status: 500 }
            );
        }

        if (!result.success) {
            console.error("Web3Forms error:", result);
            return NextResponse.json(
                { error: result.message || "Error al enviar" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, method: "emailed" });
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
