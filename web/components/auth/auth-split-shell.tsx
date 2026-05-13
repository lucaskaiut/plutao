import type { ReactNode } from "react";

type AuthSplitShellProps = {
  brandLabel: string;
  title: string;
  subtitle: string;
  children: ReactNode;
};

/**
 * Shell responsivo: painel primário + área do formulário.
 * Em mobile o painel fica no topo; em md+ fica à esquerda.
 */
export function AuthSplitShell({
  brandLabel,
  title,
  subtitle,
  children,
}: AuthSplitShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface md:flex-row">
      <aside
        data-testid="auth-brand-panel"
        className="relative flex min-h-[32vh] flex-col items-center justify-center overflow-hidden bg-primary px-8 py-10 text-primary-foreground md:min-h-dvh md:w-[60%] md:shrink-0 md:py-16 lg:px-14"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          aria-hidden
        >
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-primary-foreground/30 blur-3xl" />
          <div className="absolute -bottom-24 -left-12 size-72 rounded-full bg-primary-foreground/20 blur-3xl" />
        </div>
        <div className="relative z-10 flex w-full max-w-lg flex-col items-center space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
            {brandLabel}
          </p>
          <h2 className="text-balance text-2xl font-semibold leading-tight text-primary-foreground md:text-3xl lg:text-4xl">
            {title}
          </h2>
          <p className="max-w-sm text-sm text-primary-foreground/85 md:text-base">
            {subtitle}
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-col items-center justify-center px-5 py-10 md:w-[40%] md:max-w-lg md:shrink-0 md:px-8 md:py-16 lg:px-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
