import { redirect } from "next/navigation";
import { AuthSplitShell } from "@/components/auth/auth-split-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getServerTranslate } from "@/i18n/server";
import { getCurrentUser } from "@/lib/auth/session";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  const { translate } = await getServerTranslate();

  return (
    <AuthSplitShell
      brandLabel={translate("common.brandShort")}
      title={translate("pages.login.title")}
      subtitle={translate("pages.login.subtitle")}
    >
      <LoginForm />
    </AuthSplitShell>
  );
}
