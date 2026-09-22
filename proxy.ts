import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * pt-br é o locale padrão e não tem prefixo visível na URL (`/article/x`),
 * en-us vive sob `/en-us/...`. Toda a árvore de rotas do app mora em
 * `app/[locale]/...` — então uma URL sem prefixo é reescrita aqui pra
 * `/pt-br/...` internamente, sem mudar o que o navegador mostra. URLs já
 * prefixadas com `/en-us` passam direto.
 *
 * Também propaga o pathname original via header `x-pathname`, porque o root
 * layout (`app/layout.tsx`) fica ACIMA do segmento `[locale]` e não recebe
 * `params.locale` — precisa dele pra decidir o `<html lang>`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname === "/en-us" || pathname.startsWith("/en-us/")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = `/pt-br${pathname}`;
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|slice-simulator|opengraph-image|.*\\..*).*)",
  ],
};
