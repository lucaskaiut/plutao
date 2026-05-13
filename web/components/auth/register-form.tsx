"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import type { AuthActionState } from "@/lib/auth/auth-action-state";
import { useTranslate } from "@/i18n/use-translate";

const initial: AuthActionState = { status: "idle" };

export function RegisterForm() {
  const { translate } = useTranslate();
  const [state, formAction, pending] = useActionState(registerAction, initial);

  return (
    <form action={formAction} className="flex w-full max-w-md flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {translate("auth.register.heading")}
        </h1>
        <p className="text-sm text-muted md:text-base">
          {translate("auth.register.lead")}
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
            {translate("auth.register.nameLabel")}
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            className="input-field"
            placeholder={translate("auth.register.namePlaceholder")}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">
            {translate("auth.register.emailLabel")}
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            className="input-field"
            placeholder={translate("auth.register.emailPlaceholder")}
          />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">
            {translate("auth.register.passwordLabel")}
          </span>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="input-field"
            placeholder={translate("auth.register.passwordPlaceholder")}
          />
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn-primary">
        {pending
          ? translate("auth.register.submitPending")
          : translate("auth.register.submit")}
      </button>

      <p className="text-center text-sm text-muted">
        {translate("auth.register.hasAccount")}{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {translate("auth.register.signInLink")}
        </Link>
      </p>
    </form>
  );
}
