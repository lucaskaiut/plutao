import Link from "next/link";
import { PrivateMobileNavBar } from "@/components/layout/private-mobile-nav-bar";
import { PrivateSidebarUserPanel } from "@/components/layout/private-sidebar-user-panel";
import { getServerTranslate } from "@/i18n/server";
import { getPrivateNavItems } from "@/lib/navigation/private-nav-config";

type PrivateNavChromeProps = {
  /** Cabeçalho da área autenticada: fica só na coluna à direita do menu (desktop). */
  header: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Shell da área privada: menu (sidebar SSR em desktop) primeiro; cabeçalho e conteúdo ocupam o espaço restante.
 */
export async function PrivateNavChrome({
  header,
  children,
}: PrivateNavChromeProps) {
  const { translate } = await getServerTranslate();
  const items = getPrivateNavItems();

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <aside
        className="hidden w-60 shrink-0 flex-col gap-4 bg-background p-4 shadow-[4px_0_28px_-10px_rgba(0,0,0,0.08)] md:flex dark:shadow-[4px_0_32px_-8px_rgba(0,0,0,0.45)]"
        aria-label={translate("nav.sidebarAria")}
      >
        <PrivateSidebarUserPanel />
        <nav className="flex flex-col gap-1" aria-label={translate("nav.linksAria")}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-elevated"
            >
              {translate(item.labelKey)}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-surface/80 pb-[calc(3.5rem+env(safe-area-inset-bottom,0))] dark:bg-slate-800 md:pb-0">
          {children}
        </div>
      </div>
      <PrivateMobileNavBar items={items} />
    </div>
  );
}
