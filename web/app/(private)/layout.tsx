import { AuthedAppHeader } from "@/components/layout/authed-app-header";
import { PrivateNavChrome } from "@/components/layout/private-nav-chrome";
import { PrivateAuthSync } from "@/components/auth/private-auth-sync";
import { assertAuthenticatedLayout } from "@/lib/auth/guard";

export default async function PrivateGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAuthenticatedLayout();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PrivateAuthSync />
      <PrivateNavChrome header={<AuthedAppHeader />}>
        {children}
      </PrivateNavChrome>
    </div>
  );
}
