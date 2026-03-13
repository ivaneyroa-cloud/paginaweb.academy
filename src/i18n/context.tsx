"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/* ══════════════════════════════════════════════════════════
   i18n — Lightweight client-side internationalization
   ──────────────────────────────────────────────────────────
   • No external dependencies
   • ~0 KB overhead (just JSON strings)
   • Supports ES / EN (expandable to ZH)
   ══════════════════════════════════════════════════════════ */

export type Locale = "es" | "en";

type Translations = Record<string, string>;

type I18nContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

/* ── Translation dictionaries ── */
const dictionaries: Record<Locale, Translations> = {
    es: {},
    en: {},
};

/** Register translations for a locale */
export function registerTranslations(locale: Locale, translations: Translations) {
    dictionaries[locale] = { ...dictionaries[locale], ...translations };
}

/** Provider — wrap your app */
export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocale] = useState<Locale>("es");

    const t = useCallback(
        (key: string, fallback?: string): string => {
            // Try current locale first, then fallback to ES, then to the key itself
            return dictionaries[locale]?.[key] ?? dictionaries.es?.[key] ?? fallback ?? key;
        },
        [locale]
    );

    return (
        <I18nContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </I18nContext.Provider>
    );
}

/** Hook — use in any component */
export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        // Fallback for components outside provider
        return {
            locale: "es" as Locale,
            setLocale: () => {},
            t: (key: string, fallback?: string) => fallback ?? key,
        };
    }
    return ctx;
}
