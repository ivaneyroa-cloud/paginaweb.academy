"use client";

import { I18nProvider } from "@/i18n";
import HreflangTags from "@/components/HreflangTags";
import JsonLd from "@/components/JsonLd";

export default function I18nWrapper({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <HreflangTags />
            <JsonLd />
            {children}
        </I18nProvider>
    );
}
