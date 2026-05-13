"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PrivateNavItem } from "@/lib/navigation/private-nav-config";
import { PrivateSidebarUserPanel } from "@/components/layout/private-sidebar-user-panel";
import { useTranslate } from "@/i18n/use-translate";

type PrivateMobileNavBarProps = {
  items: PrivateNavItem[];
  /**
   * Ícones ou ações adicionais à direita da barra inferior (só mobile).
   */
  trailingSlot?: ReactNode;
};

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
      className="text-foreground"
    >
      {open ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

export function PrivateMobileNavBar({
  items,
  trailingSlot,
}: PrivateMobileNavBarProps) {
  const { translate } = useTranslate();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const titleId = useId();

  const closeMenu = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    const onClose = () => setMenuOpen(false);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (!dialog.open) {
      dialog.showModal();
      setMenuOpen(true);
    }
  };

  const linkClass = (href: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    return [
      "rounded-lg px-3 py-3 text-left text-sm font-medium transition",
      active
        ? "bg-primary/15 text-primary"
        : "text-foreground hover:bg-surface",
    ].join(" ");
  };

  return (
    <div className="md:hidden">
      <div className="fixed bottom-0 left-0 right-0 z-30 flex flex-col bg-background/95 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-6px_28px_-8px_rgba(0,0,0,0.1)] backdrop-blur-md supports-backdrop-filter:bg-background/85 dark:shadow-[0_-8px_32px_-6px_rgba(0,0,0,0.5)]">
        <div className="flex h-14 items-center gap-2 px-2">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-foreground outline-none transition hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-expanded={menuOpen}
            aria-controls={titleId}
            aria-label={
              menuOpen
                ? translate("nav.closeMenu")
                : translate("nav.openMenu")
            }
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
          <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
            {trailingSlot}
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        id={titleId}
        aria-labelledby={`${titleId}-heading`}
        className="fixed inset-0 z-40 m-0 flex h-full max-h-dvh w-full max-w-none flex-col justify-end border-none bg-transparent p-0 text-foreground shadow-none open:flex backdrop:bg-black/45"
      >
        <div
          className="flex min-h-0 flex-1 flex-col justify-end bg-transparent"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeMenu();
            }
          }}
        >
          <div
            className="flex max-h-[min(72dvh,26rem)] flex-col overflow-hidden rounded-t-2xl bg-surface-elevated shadow-[0_-12px_48px_-8px_rgba(0,0,0,0.18)] dark:shadow-[0_-12px_48px_-6px_rgba(0,0,0,0.55)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 bg-background/40 px-4 py-3 dark:bg-background/25">
              <h2
                id={`${titleId}-heading`}
                className="text-base font-semibold tracking-tight"
              >
                {translate("nav.drawerTitle")}
              </h2>
              <button
                type="button"
                className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg text-sm font-medium text-muted outline-none transition hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                onClick={closeMenu}
              >
                {translate("nav.closeDrawer")}
              </button>
            </div>
            <div className="px-4 pb-3">
              <PrivateSidebarUserPanel onLogout={closeMenu} />
            </div>
            <nav
              className="flex flex-col gap-1 overflow-y-auto p-2"
              aria-label={translate("nav.linksAria")}
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={linkClass(item.href)}
                  onClick={closeMenu}
                  aria-current={
                    item.href === "/"
                      ? pathname === "/"
                        ? "page"
                        : undefined
                      : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`)
                        ? "page"
                        : undefined
                  }
                >
                  {translate(item.labelKey)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </dialog>
    </div>
  );
}
