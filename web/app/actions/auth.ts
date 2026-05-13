"use server";

import { redirect } from "next/navigation";
import type { AuthActionState } from "@/lib/auth/auth-action-state";
import { clearAuthTokenCookie, setAuthTokenCookie } from "@/lib/auth/cookies-server";
import { laravelLogin, laravelRegister } from "@/lib/auth/laravel-auth";
import { getServerTranslate } from "@/i18n/server";

export type { AuthActionState } from "@/lib/auth/auth-action-state";

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { translate } = await getServerTranslate();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      status: "error",
      message: translate("actions.login.emailPasswordRequired"),
    };
  }

  const result = await laravelLogin(email, password);
  if (!result.ok) {
    return {
      status: "error",
      message:
        result.status === 401
          ? translate("errors.invalidCredentials")
          : result.message,
    };
  }

  await setAuthTokenCookie(result.token);
  redirect("/");
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { translate } = await getServerTranslate();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return {
      status: "error",
      message: translate("actions.register.allFieldsRequired"),
    };
  }

  const result = await laravelRegister(name, email, password);
  if (!result.ok) {
    const first =
      result.fieldErrors &&
      Object.values(result.fieldErrors).flat()[0];
    return {
      status: "error",
      message: first ?? result.message,
    };
  }

  await setAuthTokenCookie(result.token);
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearAuthTokenCookie();
  redirect("/login");
}
