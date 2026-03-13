"use client";

import ServiceLandingTemplate from "@/components/servicios/ServiceLandingTemplate";
import fulfillmentData from "@/data/servicios/fulfillment";

export default function FulfillmentPage() {
    return <ServiceLandingTemplate data={fulfillmentData} />;
}
