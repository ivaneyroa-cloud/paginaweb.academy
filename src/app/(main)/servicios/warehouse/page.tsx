"use client";

import ServiceLandingTemplate from "@/components/servicios/ServiceLandingTemplate";
import warehouseData from "@/data/servicios/warehouse";

export default function WarehousePage() {
    return <ServiceLandingTemplate data={warehouseData} />;
}
