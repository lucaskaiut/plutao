import { cookies } from "next/headers";
import { cache } from "react";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";
import { clearAuthTokenCookie } from "@/lib/auth/cookies-server";
import { laravelMe } from "@/lib/auth/laravel-auth";
import type { AuthUser } from "@/lib/auth/types";

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const jar = await cookies();
  const token = jar.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) {
    return null;
  }

  const me = await laravelMe(token);
  if (!me.ok) {
    if (me.status === 401) {
      await clearAuthTokenCookie();
    }
    return null;
  }

  return me.user;
});

export async function readAuthToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}
