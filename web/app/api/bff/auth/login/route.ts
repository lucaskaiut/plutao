import { NextResponse } from "next/server";
import { setAuthTokenCookie } from "@/lib/auth/cookies-server";
import { laravelLogin } from "@/lib/auth/laravel-auth";
import { getServerTranslate } from "@/i18n/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { translate } = await getServerTranslate();

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    return NextResponse.json(
      { message: translate("errors.invalidJson") },
      { status: 400 },
    );
  }

  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!email || !password) {
    return NextResponse.json(
      { message: translate("actions.login.emailPasswordRequired") },
      { status: 422 },
    );
  }

  const result = await laravelLogin(email, password);
  if (!result.ok) {
    return NextResponse.json(
      {
        message:
          result.status === 401
            ? translate("errors.invalidCredentials")
            : result.message,
      },
      { status: result.status },
    );
  }

  await setAuthTokenCookie(result.token);
  return NextResponse.json({ data: { user: result.user } });
}
