import { NextResponse } from "next/server";
import { clearAuthTokenCookie } from "@/lib/auth/cookies-server";

export async function POST(): Promise<NextResponse> {
  await clearAuthTokenCookie();
  return NextResponse.json({ ok: true });
}
