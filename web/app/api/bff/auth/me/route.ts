import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getServerTranslate } from "@/i18n/server";

/**
 * BFF: espelha GET /me da API usando apenas o cookie HttpOnly (não aceita Bearer no cliente).
 */
export async function GET(): Promise<NextResponse> {
  const { translate } = await getServerTranslate();
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { message: translate("api.unauthenticated") },
      { status: 401 },
    );
  }
  return NextResponse.json({ data: { user } });
}
