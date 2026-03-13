"use client";

import ServiceLandingTemplate from "@/components/servicios/ServiceLandingTemplate";
import courierData from "@/data/servicios/courier";

export default function CourierPage() {
    return <ServiceLandingTemplate data={courierData} />;
}
