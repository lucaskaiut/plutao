import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE_NAME } from "@/i18n/constants";
import { localeFromAcceptLanguage, localeFromCookieValue } from "@/i18n/locale";
import { messageBundles } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/types";
import type { TranslateVars } from "@/i18n/types";
import { translateKey } from "@/i18n/translate-core";

export async function getServerLocale(): Promise<AppLocale> {
  const jar = await cookies();
  const fromCookie = localeFromCookieValue(jar.get(LOCALE_COOKIE_NAME)?.value);
  if (fromCookie) {
    return fromCookie;
  }
  const accept = (await headers()).get("accept-language");
  return localeFromAcceptLanguage(accept);
}

export async function getServerTranslate(): Promise<{
  locale: AppLocale;
  translate: (key: string, vars?: TranslateVars) => string;
}> {
  const locale = await getServerLocale();
  return {
    locale,
    translate: (key: string, vars?: TranslateVars) =>
      translateKey(locale, messageBundles, key, vars),
  };
}
