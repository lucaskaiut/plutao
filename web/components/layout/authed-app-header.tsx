"use client";

import { useTranslate } from "@/i18n/use-translate";
import type { AppLocale } from "@/i18n/types";

export function AuthedAppHeader() {
  const { translate, locale, setLocale } = useTranslate();

  return (
    <header className="z-20 shrink-0 bg-background shadow-none max-md:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-none dark:max-md:shadow-[0_4px_24px_-6px_rgba(0,0,0,0.45)] md:shadow-[12px_8px_36px_-22px_rgba(0,0,0,0.065)] dark:md:shadow-[12px_8px_40px_-20px_rgba(0,0,0,0.38)]">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <span className="min-w-0 truncate text-sm font-semibold text-foreground md:text-base">
          {translate("common.brandShort")}
        </span>
        <select
          value={locale}
          aria-label={translate("header.languageSelectAria")}
          onChange={(e) => {
            setLocale(e.target.value as AppLocale);
          }}
          className="h-8 min-w-[3.25rem] shrink-0 cursor-pointer rounded-md bg-transparent px-1.5 py-0 text-center text-xs font-medium tabular-nums text-muted shadow-none outline-none ring-0 transition hover:bg-surface/50 hover:text-foreground focus-visible:bg-surface/50 focus-visible:text-foreground focus-visible:ring-1 focus-visible:ring-ring/30 dark:hover:bg-surface/30 dark:focus-visible:bg-surface/30"
        >
          <option value="pt">PT</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  );
}
