import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;

  const loggedInRestrictedRoutes = ["/login", "/cadastro", "/recuperar-senha"];
  if (user && loggedInRestrictedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/minha-area", request.url));
  }

  const privateRoutes = ["/minha-area"];
  if (!user && privateRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos, exceto:
     * - _next/static e _next/image
     * - favicon.ico e imagens estáticas
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
