import type { AppLocale } from "@/i18n/types";
import type { TranslateVars } from "@/i18n/types";
import type { MessageBundles } from "@/i18n/messages";

function getByPath(
  obj: Record<string, unknown>,
  path: string,
): string | undefined {
  const parts = path.split(".").filter(Boolean);
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur !== null && typeof cur === "object" && p in (cur as object)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) {
    return template;
  }
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.replaceAll(`{${key}}`, String(value));
  }
  return out;
}

/**
 * Chave no formato `arquivo.chave` ou `arquivo.secao.folha` (primeiro segmento = nome do .json).
 */
export function translateKey(
  locale: AppLocale,
  bundles: MessageBundles,
  key: string,
  vars?: TranslateVars,
): string {
  const firstDot = key.indexOf(".");
  if (firstDot === -1) {
    return key;
  }
  const namespace = key.slice(0, firstDot);
  const path = key.slice(firstDot + 1);
  if (!path) {
    return key;
  }

  const table = (bundles[locale] as Record<string, Record<string, unknown>>)[
    namespace
  ];
  if (!table) {
    return key;
  }

  const raw = getByPath(table as Record<string, unknown>, path);
  if (raw === undefined) {
    return key;
  }
  return interpolate(raw, vars);
}
