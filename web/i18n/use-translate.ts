"use client";

import { useContext } from "react";
import { I18nContext } from "@/i18n/i18n-provider";
import { messageBundles } from "@/i18n/messages";
import { translateKey } from "@/i18n/translate-core";

/**
 * Uso: `const { translate, locale, setLocale } = useTranslate();`
 * Chaves: `namespace.rest` — o primeiro segmento é o nome do ficheiro JSON (sem `.json`).
 * Ex.: `translate('auth.login.heading')` → `auth.json` → `{ "login": { "heading": "…" } }`
 */
export function useTranslate() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error(
      translateKey("pt", messageBundles, "errors.useTranslateMissing"),
    );
  }
  return {
    translate: ctx.translate,
    locale: ctx.locale,
    setLocale: ctx.setLocale,
  };
}
