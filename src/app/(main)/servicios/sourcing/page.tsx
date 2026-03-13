"use client";

import ServiceLandingTemplate from "@/components/servicios/ServiceLandingTemplate";
import sourcingData from "@/data/servicios/sourcing";

export default function SourcingPage() {
    return <ServiceLandingTemplate data={sourcingData} />;
}
