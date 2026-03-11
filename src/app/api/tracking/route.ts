import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

/* ─── Rate limit: 15 tracking queries per minute per IP ─── */
const RATE_LIMIT = 15;
const RATE_WINDOW = 60_000; // 1 minute

/* ─── Token cache ─── */
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getUPSToken(): Promise<string> {
    // Return cached token if still valid (with 60s buffer)
    if (cachedToken && Date.now() < tokenExpiry - 60_000) {
        return cachedToken;
    }

    const clientId = process.env.UPS_CLIENT_ID;
    const clientSecret = process.env.UPS_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error("UPS_CLIENT_ID or UPS_CLIENT_SECRET not configured");
    }

    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const res = await fetch("https://onlinetools.ups.com/security/v1/oauth/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${credentials}`,
        },
        body: "grant_type=client_credentials",
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error("UPS OAuth error:", errorText);
        throw new Error(`Failed to get UPS token: ${res.status}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    // Token typically lasts ~4 hours (14400s). Cache it.
    tokenExpiry = Date.now() + (data.expires_in ?? 14400) * 1000;

    return cachedToken!;
}

/* ─── GET /api/tracking?number=XXXX ─── */
export async function GET(request: NextRequest) {
    /* Rate limit check */
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { limited } = checkRateLimit(`tracking:${ip}`, RATE_LIMIT, RATE_WINDOW);
    if (limited) {
        return NextResponse.json(
            { error: "Demasiadas consultas. Esperá un momento e intentá de nuevo." },
            { status: 429 }
        );
    }

    const trackingNumber = request.nextUrl.searchParams.get("number");

    if (!trackingNumber || trackingNumber.length < 7 || trackingNumber.length > 34) {
        return NextResponse.json(
            { error: "El número de tracking debe tener entre 7 y 34 caracteres." },
            { status: 400 }
        );
    }

    try {
        const token = await getUPSToken();

        const transId = `shippar-${Date.now()}`;
        const res = await fetch(
            `https://onlinetools.ups.com/api/track/v1/details/${encodeURIComponent(trackingNumber)}?locale=es_AR`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    transId,
                    transactionSrc: "shippar",
                },
            }
        );

        if (!res.ok) {
            const errorBody = await res.text();
            console.error("UPS Tracking API error:", res.status, errorBody);

            if (res.status === 404 || res.status === 400) {
                return NextResponse.json(
                    { error: "No se encontró información para ese número de tracking." },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { error: "Error al consultar el estado. Intentá de nuevo." },
                { status: 502 }
            );
        }

        const data = await res.json();

        // Parse UPS response into a clean format
        const trackResult = parseUPSResponse(data);

        return NextResponse.json(trackResult);
    } catch (err) {
        console.error("Tracking error:", err);
        return NextResponse.json(
            { error: "Error interno del servidor. Intentá de nuevo más tarde." },
            { status: 500 }
        );
    }
}

/* ─── Parse UPS response into a clean, frontend-friendly format ─── */
interface Activity {
    date: string;
    time: string;
    location: string;
    status: string;
    statusCode: string;
}

interface TrackingResult {
    trackingNumber: string;
    status: string;
    statusCode: string;
    statusDescription: string;
    estimatedDelivery: string | null;
    deliveredDate: string | null;
    origin: string;
    destination: string;
    service: string;
    weight: string;
    activities: Activity[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseUPSResponse(data: any): TrackingResult {
    const shipment = data?.trackResponse?.shipment?.[0];
    const pkg = shipment?.package?.[0];

    if (!shipment || !pkg) {
        return {
            trackingNumber: "",
            status: "unknown",
            statusCode: "",
            statusDescription: "No se pudo obtener información del envío.",
            estimatedDelivery: null,
            deliveredDate: null,
            origin: "",
            destination: "",
            service: "",
            weight: "",
            activities: [],
        };
    }

    const currentStatus = pkg.currentStatus ?? {};
    const activities: Activity[] = (pkg.activity ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (act: any) => {
            const loc = act.location?.address ?? {};
            const locationParts = [loc.city, loc.stateProvince, loc.country].filter(Boolean);

            return {
                date: act.date ?? "",
                time: act.time ?? "",
                location: locationParts.join(", ") || "—",
                status: act.status?.description ?? act.status?.type ?? "",
                statusCode: act.status?.code ?? act.status?.type ?? "",
            };
        }
    );

    // Determine estimated delivery
    let estimatedDelivery: string | null = null;
    if (pkg.deliveryDate?.[0]?.date) {
        const d = pkg.deliveryDate[0].date;
        estimatedDelivery = `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`;
    }

    // Determine delivered date
    let deliveredDate: string | null = null;
    if (currentStatus?.code === "011" || currentStatus?.type === "D") {
        const firstActivity = activities[0];
        if (firstActivity) {
            const d = firstActivity.date;
            deliveredDate = d.length === 8
                ? `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 8)}`
                : d;
        }
    }

    // Map status type AND status code to user-friendly state
    const statusTypeMap: Record<string, string> = {
        M: "manifest",    // Order processed / label created
        I: "in_transit",  // In transit
        X: "exception",   // Exception
        D: "delivered",   // Delivered
        P: "pickup",      // Pickup
        RS: "returned",   // Returned to sender
    };

    // UPS also uses numeric status codes
    const statusCodeMap: Record<string, string> = {
        "003": "manifest",    // Label created, ready for shipment
        "004": "manifest",    // Shipment ready
        "005": "in_transit",  // In transit
        "007": "in_transit",  // In transit to destination
        "011": "delivered",   // Delivered
        "021": "in_transit",  // On the way
        "036": "in_transit",  // In transit
        "052": "exception",   // Exception
        "092": "in_transit",  // Customs cleared
    };

    const statusType = currentStatus?.type ?? "";
    const statusCode = currentStatus?.code ?? "";
    const mappedStatus = statusTypeMap[statusType]
        ?? statusCodeMap[statusCode]
        ?? "in_transit";

    // Extract origin & destination from packageAddress or shipmentAddress
    // UPS uses varying type names: "ORIGIN", "SHIP_FROM", "ORIGIN_ADDRESS"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const packageAddresses: any[] = pkg.packageAddress ?? [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const shipmentAddresses: any[] = shipment.shipmentAddress ?? shipment.shipperAddress ?? [];

    // Helper to format address object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatAddr = (addrObj: any): string => {
        if (!addrObj?.address) return "";
        const a = addrObj.address;
        return [a.city, a.stateProvince, a.country].filter(Boolean).join(", ");
    };

    // Try to find origin from package addresses first, then shipment addresses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findOrigin = (addrs: any[]): any =>
        addrs.find((a: any) => 
            a.type === "ORIGIN" || 
            a.type === "SHIP_FROM" || 
            a.type === "ORIGIN_ADDRESS" ||
            a.type === "SHIPPER"
        );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findDest = (addrs: any[]): any =>
        addrs.find((a: any) => 
            a.type === "DESTINATION" || 
            a.type === "SHIP_TO" || 
            a.type === "DESTINATION_ADDRESS"
        );

    const originAddr = findOrigin(packageAddresses) ?? findOrigin(shipmentAddresses);
    const destAddr = findDest(packageAddresses) ?? findDest(shipmentAddresses);

    let origin = formatAddr(originAddr);
    let dest = formatAddr(destAddr);

    // Fallback: if origin is still empty, use the LAST activity's location
    // (last in array = first chronologically = where the package started)
    if (!origin && activities.length > 0) {
        origin = activities[activities.length - 1].location;
    }
    // Fallback: if destination is empty, use the FIRST activity's location
    // (first in array = most recent = where the package is heading/arrived)
    if (!dest && activities.length > 0) {
        dest = activities[0].location;
    }

    // White-label service name
    const rawService = pkg.service?.description ?? shipment.service?.description ?? "";
    const serviceMap: Record<string, string> = {
        "UPS Expedited": "Standard",
        "UPS Express": "Express",
        "UPS Express Saver": "Express Saver",
        "UPS Standard": "Standard",
        "UPS Worldwide Express": "Express Internacional",
        "UPS Worldwide Expedited": "Standard Internacional",
        "UPS 2nd Day Air": "Express 2 Días",
        "UPS 3 Day Select": "Express 3 Días",
        "UPS Next Day Air": "Express Next Day",
        "UPS Ground": "Terrestre",
    };
    const service = serviceMap[rawService] ?? rawService.replace(/^UPS\s*/i, "");

    // White-label status description
    const rawDesc = currentStatus?.description ?? "";
    const statusDescription = rawDesc.replace(/UPS/gi, "Shippar");

    return {
        trackingNumber: pkg.trackingNumber ?? shipment.inquiryNumber ?? "",
        status: mappedStatus,
        statusCode: currentStatus?.code ?? "",
        statusDescription,
        estimatedDelivery,
        deliveredDate,
        origin,
        destination: dest,
        service,
        weight: pkg.weight?.weight ? `${pkg.weight.weight} ${pkg.weight.unitOfMeasurement ?? ""}` : "",
        activities: activities.map(a => ({
            ...a,
            status: a.status.replace(/UPS/gi, "Shippar"),
        })),
    };
}
