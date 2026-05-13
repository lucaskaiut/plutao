import { redirect } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getServerTranslate } from "@/i18n/server";
import { getCurrentUser } from "@/lib/auth/session";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  const { translate } = await getServerTranslate();

  return (
    <AuthSplitShell
      brandLabel={translate("common.brandShort")}
      title={translate("pages.register.title")}
      subtitle={translate("pages.register.subtitle")}
    >
      <RegisterForm />
    </AuthSplitShell>
  );
}
