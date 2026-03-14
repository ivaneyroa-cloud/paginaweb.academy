import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",           // API routes — not for crawling
                    "/academy/admin/", // Admin panel
                    "/academy/dashboard/", // User dashboard (requires auth)
                    "/academy/login",
                    "/academy/register",
                ],
            },
        ],
        sitemap: "https://shippar.net/sitemap.xml",
    };
}
