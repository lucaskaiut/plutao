import { getCurrentUser } from "@/lib/auth/session";
import { DashboardLogoutButton } from "@/components/auth/dashboard-logout-button";
import { getServerTranslate } from "@/i18n/server";

export default async function DashboardHomePage() {
  const user = await getCurrentUser();
  const { translate } = await getServerTranslate();

  const displayName = user?.name ?? translate("common.userFallback");

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-5 py-10 md:px-8 md:py-14">
      <header className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="inline-block rounded-lg bg-primary px-3 py-1 text-sm font-medium text-primary-foreground">
            {translate("dashboard.badge")}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight md:text-3xl">
            {translate("dashboard.greeting", { name: displayName })}
          </h1>
          <p className="mt-2 text-sm text-muted md:text-base">{user?.email}</p>
        </div>
        <DashboardLogoutButton />
      </header>

      <section className="rounded-2xl border border-border bg-surface-elevated p-6 shadow-sm md:p-8">
        <h2 className="text-lg font-semibold text-foreground">
          {translate("dashboard.sessionTitle")}
        </h2>
        <p className="mt-2 text-sm text-muted md:text-base">
          {translate("dashboard.sessionDescription")}
        </p>
      </section>
    </div>
  );
}
