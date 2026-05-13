"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import type { AuthUser } from "@/lib/auth/types";
import { mergeLocaleHeaders } from "@/lib/http/bff-fetch";
import { messageBundles } from "@/i18n/messages";
import { translateKey } from "@/i18n/translate-core";
import { useTranslate } from "@/i18n/use-translate";

type AuthContextValue = {
  user: AuthUser | null;
  verifySession: () => Promise<boolean>;
  loginViaBff: (email: string, password: string) => Promise<void>;
  registerViaBff: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: AuthUser | null;
}) {
  const { translate, locale } = useTranslate();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  const verifySession = useCallback(async (): Promise<boolean> => {
    const res = await fetch("/api/bff/auth/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: mergeLocaleHeaders(locale),
    });
    if (res.status === 401) {
      setUser(null);
      return false;
    }
    if (!res.ok) {
      return false;
    }
    const json = (await res.json()) as { data: { user: AuthUser } };
    setUser(json.data.user);
    return true;
  }, [locale]);

  const loginViaBff = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/bff/auth/login", {
        method: "POST",
        credentials: "include",
        headers: mergeLocaleHeaders(locale, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(
          body.message ?? translate("errors.loginBffFail"),
        );
      }
      const json = (await res.json()) as { data: { user: AuthUser } };
      setUser(json.data.user);
      router.refresh();
    },
    [router, translate, locale],
  );

  const registerViaBff = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/bff/auth/register", {
        method: "POST",
        credentials: "include",
        headers: mergeLocaleHeaders(locale, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(
          body.message ?? translate("errors.registerBffFail"),
        );
      }
      const json = (await res.json()) as { data: { user: AuthUser } };
      setUser(json.data.user);
      router.refresh();
    },
    [router, translate, locale],
  );

  const logout = useCallback(() => {
    void logoutAction();
  }, []);

  const value = useMemo(
    () => ({
      user,
      verifySession,
      loginViaBff,
      registerViaBff,
      logout,
    }),
    [user, verifySession, loginViaBff, registerViaBff, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      translateKey("pt", messageBundles, "errors.useAuthMissing"),
    );
  }
  return ctx;
}
