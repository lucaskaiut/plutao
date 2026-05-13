"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useTranslate } from "@/i18n/use-translate";

function displayInitial(name: string, email: string): string {
  const source = (name.trim() || email.trim() || "?")[0];
  if (!source) {
    return "?";
  }
  return source.toLocaleUpperCase(undefined);
}

type PrivateSidebarUserPanelProps = {
  /** Ex.: fechar a gaveta mobile antes do fluxo de logout. */
  onLogout?: () => void;
};

export function PrivateSidebarUserPanel({
  onLogout,
}: PrivateSidebarUserPanelProps) {
  const { user, logout } = useAuth();
  const { translate } = useTranslate();

  const displayName =
    user?.name?.trim() || user?.email || translate("common.userFallback");
  const initial = user
    ? displayInitial(user.name, user.email)
    : "?";

  const handleLogout = () => {
    onLogout?.();
    logout();
  };

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        aria-hidden
      >
        {initial}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-foreground">
          {displayName}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="self-start text-left text-sm font-medium text-primary underline-offset-2 transition hover:underline"
        >
          {translate("dashboard.logout")}
        </button>
      </div>
    </div>
  );
}
