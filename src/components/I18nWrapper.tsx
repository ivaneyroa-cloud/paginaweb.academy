"use client";

import { I18nProvider } from "@/i18n";
import HreflangTags from "@/components/HreflangTags";

export default function I18nWrapper({ children }: { children: React.ReactNode }) {
    return (
        <I18nProvider>
            <HreflangTags />
            {children}
        </I18nProvider>
    );
}
