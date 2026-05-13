import type { AppLocale } from "@/i18n/types";
import { defaultLocale } from "@/i18n/types";

/**
 * Preferência de idioma a partir do header `Accept-Language` (enviado pelo navegador em cada pedido).
 */
export function localeFromAcceptLanguage(
  header: string | null | undefined,
): AppLocale {
  if (!header || header.trim() === "") {
    return defaultLocale;
  }
  const first = header.split(",")[0]?.trim().toLowerCase() ?? "";
  const tag = first.split(";")[0]?.trim() ?? "";
  if (tag.startsWith("pt")) {
    return "pt";
  }
  if (tag.startsWith("en")) {
    return "en";
  }
  return defaultLocale;
}

/** `navigator.language` — pode ser usado no cliente com `setLocale` se quiser alinhar ao SO. */
export function localeFromNavigator(): AppLocale {
  if (typeof navigator === "undefined") {
    return defaultLocale;
  }
  const tag = navigator.language?.toLowerCase() ?? "";
  if (tag.startsWith("pt")) {
    return "pt";
  }
  if (tag.startsWith("en")) {
    return "en";
  }
  return defaultLocale;
}

export function localeToHtmlLang(locale: AppLocale): string {
  return locale === "pt" ? "pt-BR" : "en";
}

export function isAppLocale(value: string): value is AppLocale {
  return value === "pt" || value === "en";
}

export function localeFromCookieValue(
  value: string | undefined,
): AppLocale | null {
  if (!value) {
    return null;
  }
  return isAppLocale(value) ? value : null;
}

