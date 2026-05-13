"use client";

import { logoutAction } from "@/app/actions/auth";
import { useTranslate } from "@/i18n/use-translate";

export function DashboardLogoutButton() {
  const { translate } = useTranslate();

  return (
    <button
      type="button"
      onClick={() => {
        void logoutAction();
      }}
      className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground shadow-sm transition hover:bg-surface"
    >
      {translate("dashboard.logout")}
    </button>
  );
}
