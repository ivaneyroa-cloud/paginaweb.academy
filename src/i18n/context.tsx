"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

/* ══════════════════════════════════════════════════════════
   i18n — Lightweight client-side internationalization
   ──────────────────────────────────────────────────────────
   • No external dependencies
   • ~0 KB overhead (just JSON strings)
   • Supports ES / EN (expandable to ZH)
   • Reads locale from cookie set by middleware
   • Updates URL to /en/* when switching language
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

/** Read the NEXT_LOCALE cookie */
function getLocaleCookie(): Locale {
    if (typeof document === "undefined") return "es";
    const match = document.cookie.match(/NEXT_LOCALE=(\w+)/);
    if (match && (match[1] === "es" || match[1] === "en")) {
        return match[1] as Locale;
    }
    return "es";
}

/** Set the NEXT_LOCALE cookie */
function setLocaleCookie(locale: Locale) {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

/** Provider — wrap your app */
export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("es");
    const pathname = usePathname();
    const router = useRouter();

    // Initialize locale from cookie on mount
    useEffect(() => {
        setLocaleState(getLocaleCookie());
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        setLocaleCookie(newLocale);

        // Strip any existing locale prefix from the pathname
        // usePathname() may return /en/servicios/courier (browser URL), not the rewritten path
        let cleanPath = pathname;
        const localePrefix = /^\/(en|es)(\/|$)/;
        if (localePrefix.test(cleanPath)) {
            cleanPath = cleanPath.replace(localePrefix, "/");
            if (cleanPath === "") cleanPath = "/";
        }

        // Update URL to reflect the new locale
        if (newLocale === "es") {
            // Spanish is default — use clean URL (no prefix)
            router.push(cleanPath);
        } else {
            // Non-default locale — add prefix
            router.push(`/${newLocale}${cleanPath}`);
        }
    }, [pathname, router]);

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
