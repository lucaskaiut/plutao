"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import type { AuthActionState } from "@/lib/auth/auth-action-state";
import { useTranslate } from "@/i18n/use-translate";

const initial: AuthActionState = { status: "idle" };

export function LoginForm() {
  const { translate } = useTranslate();
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {translate("auth.login.heading")}
        </h1>
        <p className="text-sm text-muted md:text-base">
          {translate("auth.login.lead")}
        </p>
      </div>

      {state.status === "error" ? (
        <div
          role="alert"
          className="rounded-lg bg-danger-muted px-4 py-3 text-sm text-danger shadow-md dark:shadow-[0_6px_24px_-6px_rgba(0,0,0,0.45)]"
        >
          {state.message}
        </div>
      ) : null}

      <div className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">
            {translate("auth.login.emailLabel")}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input-field"
            placeholder={translate("auth.login.emailPlaceholder")}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">
            {translate("auth.login.passwordLabel")}
          </span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="input-field"
            placeholder={translate("auth.login.passwordPlaceholder")}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="btn-primary"
      >
        {pending
          ? translate("auth.login.submitPending")
          : translate("auth.login.submit")}
      </button>

      <p className="text-center text-sm text-muted">
        {translate("auth.login.noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {translate("auth.login.createAccountLink")}
        </Link>
      </p>
    </form>
  );
}
