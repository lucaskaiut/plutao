import type { AppLocale } from "@/i18n/types";
import { localeToApiRequestHeaders } from "@/i18n/locale-headers";

/** Cabeçalhos de idioma em pedidos `fetch` do browser ao BFF (alinhados à API Laravel). */
export function mergeLocaleHeaders(
  locale: AppLocale,
  initHeaders?: HeadersInit,
): Headers {
  const headers = new Headers(initHeaders);
  const localePart = new Headers(localeToApiRequestHeaders(locale));
  localePart.forEach((value, key) => {
    headers.set(key, value);
  });
  return headers;
}
