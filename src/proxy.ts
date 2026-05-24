import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_CMS_PATHS = ["/cms/login", "/cms/register"];
const PUBLIC_STUDENT_PATHS = ["/login", "/cadastro", "/recuperar-senha"];
const PROTECTED_STUDENT_PATHS = ["/minha-area"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabaseResponse, user } = await updateSession(request);

  // 1. Proteção das rotas do CMS
  if (pathname.startsWith("/cms")) {
    const isCmsPublic = PUBLIC_CMS_PATHS.some((p) => pathname.startsWith(p));

    if (user && isCmsPublic) {
      return NextResponse.redirect(new URL("/cms/dashboard", request.url));
    }
    if (!user && !isCmsPublic) {
      return NextResponse.redirect(new URL("/cms/login", request.url));
    }
    return supabaseResponse;
  }

  // 2. Proteção das rotas da Área do Aluno
  const isStudentPublic = PUBLIC_STUDENT_PATHS.some((p) =>
    pathname.startsWith(p),
  );
  const isStudentProtected = PROTECTED_STUDENT_PATHS.some((p) =>
    pathname.startsWith(p),
  );

  if (user && isStudentPublic) {
    return NextResponse.redirect(new URL("/minha-area", request.url));
  }
  if (!user && isStudentProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Aplica o middleware em todas as rotas EXCETO arquivos estáticos (.css, imagens, etc)
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
