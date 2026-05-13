import { NextResponse } from "next/server";
import { setAuthTokenCookie } from "@/lib/auth/cookies-server";
import { laravelRegister } from "@/lib/auth/laravel-auth";
import { getServerTranslate } from "@/i18n/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { translate } = await getServerTranslate();

  let body: { name?: string; email?: string; password?: string };
  try {
    body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };
  } catch {
    return NextResponse.json(
      { message: translate("errors.invalidJson") },
      { status: 400 },
    );
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: translate("actions.register.allFieldsRequired") },
      { status: 422 },
    );
  }

  const result = await laravelRegister(name, email, password);
  if (!result.ok) {
    return NextResponse.json(
      { message: result.message, errors: result.fieldErrors },
      { status: result.status },
    );
  }

  await setAuthTokenCookie(result.token);
  return NextResponse.json({ data: { user: result.user } });
}
