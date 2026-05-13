"use client";

import { useTranslate } from "@/i18n/use-translate";
import type { AppLocale } from "@/i18n/types";

export function AuthedAppHeader() {
  const { translate, locale, setLocale } = useTranslate();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface-elevated/95 backdrop-blur supports-[backdrop-filter]:bg-surface-elevated/80">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <span className="text-sm font-semibold text-foreground md:text-base">
          {translate("common.brandShort")}
        </span>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <span className="hidden text-muted sm:inline">
            {translate("header.languageLabel")}
          </span>
          <select
            value={locale}
            aria-label={translate("header.languageLabel")}
            onChange={(e) => {
              setLocale(e.target.value as AppLocale);
            }}
            className="input-field h-9 max-w-[200px] cursor-pointer py-1.5 text-sm"
          >
            <option value="pt">{translate("header.optionPt")}</option>
            <option value="en">{translate("header.optionEn")}</option>
          </select>
        </label>
      </div>
    </header>
  );
}
