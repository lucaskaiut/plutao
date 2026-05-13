import type { AppLocale } from "@/i18n/types";

/** Cabeçalhos enviados à API Laravel em cada pedido. */
export function localeToApiRequestHeaders(locale: AppLocale): HeadersInit {
  return {
    "Accept-Language": localeToAcceptLanguageHeader(locale),
    "X-App-Locale": locale,
  };
}

export function localeToAcceptLanguageHeader(locale: AppLocale): string {
  return locale === "pt"
    ? "pt-BR,pt;q=0.9,en;q=0.8"
    : "en-US,en;q=0.9,pt;q=0.8";
}
