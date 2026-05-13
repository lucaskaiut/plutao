import { getServerLocale } from "@/i18n/server";
import { localeToApiRequestHeaders } from "@/i18n/locale-headers";
import { getApiBaseUrl } from "@/lib/config/env";

export type ApiJsonInit = Omit<RequestInit, "body"> & {
  body?: unknown;
};

/**
 * Cliente HTTP centralizado para chamadas server-side à API Laravel.
 * `path` deve começar com `/` (ex.: `/me`, `/login`) — o prefixo `/api` vem de `API_BASE_URL`.
 * Inclui sempre `Accept-Language` e `X-App-Locale` com base na preferência do utilizador.
 */
export async function serverApiFetch(
  path: string,
  init: ApiJsonInit = {},
): Promise<Response> {
  const base = getApiBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const appLocale = await getServerLocale();
  const headers = new Headers(init.headers);
  const localeHeaders = localeToApiRequestHeaders(appLocale);
  for (const [key, value] of Object.entries(localeHeaders)) {
    headers.set(key, value);
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  let body: BodyInit | undefined = init.body as BodyInit | undefined;
  if (init.body !== undefined && typeof init.body === "object" && !(init.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(init.body);
  }

  return fetch(url, {
    ...init,
    headers,
    body,
    cache: "no-store",
  });
}
