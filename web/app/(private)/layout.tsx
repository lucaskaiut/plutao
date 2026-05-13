import { AuthedAppHeader } from "@/components/layout/authed-app-header";
import { PrivateAuthSync } from "@/components/auth/private-auth-sync";
import { assertAuthenticatedLayout } from "@/lib/auth/guard";

export default async function PrivateGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await assertAuthenticatedLayout();
  return (
    <div className="flex flex-1 flex-col">
      <AuthedAppHeader />
      <PrivateAuthSync />
      {children}
    </div>
  );
}
