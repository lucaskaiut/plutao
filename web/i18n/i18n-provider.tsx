"use client";

import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import { messageBundles } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/types";
import type { TranslateVars } from "@/i18n/types";
import { translateKey } from "@/i18n/translate-core";

export type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  translate: (key: string, vars?: TranslateVars) => string;
};

export const I18nContext = createContext<I18nContextValue | null>(null);

function persistLocaleCookie(locale: AppLocale): void {
  if (typeof document === "undefined") {
    return;
  }
  const maxAge = 60 * 60 * 24 * 365;
  const secure =
    typeof process !== "undefined" && process.env.NODE_ENV === "production"
      ? ";secure"
      : "";
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${maxAge};samesite=lax${secure}`;
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: AppLocale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  const setLocale = useCallback(
    (next: AppLocale) => {
      setLocaleState(next);
      persistLocaleCookie(next);
      router.refresh();
    },
    [router],
  );

  const translate = useCallback(
    (key: string, vars?: TranslateVars) =>
      translateKey(locale, messageBundles, key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      translate,
    }),
    [locale, setLocale, translate],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
