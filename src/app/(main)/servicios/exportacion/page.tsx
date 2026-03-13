"use client";

import ServiceLandingTemplate from "@/components/servicios/ServiceLandingTemplate";
import exportacionData from "@/data/servicios/exportacion";

export default function ExportacionPage() {
    return <ServiceLandingTemplate data={exportacionData} />;
}
