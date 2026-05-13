import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";

const maxAgeSeconds = 60 * 60 * 24 * 30;

export async function setAuthTokenCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAuthTokenCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(AUTH_TOKEN_COOKIE);
}
