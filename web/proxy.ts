import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN_COOKIE } from "@/lib/auth/constants";

/**
 * Borda da app (Next.js 16+): verificação **barata** — só a presença do cookie de sessão.
 * Validar o token (GET /me, etc.) fica no layout e no resto do servidor da app.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/proxy
 */
export function proxy(request: NextRequest): NextResponse {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/login") || path.startsWith("/register")) {
    return NextResponse.next();
  }

  if (path === "/" && !request.cookies.get(AUTH_TOKEN_COOKIE)?.value) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclui BFF/API, estáticos e metadados — alinhado à documentação de autenticação do Next.js.
     * Rotas internas como `/_next/data/*` continuam a ser cobertas quando aplicável.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
