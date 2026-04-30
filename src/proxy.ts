import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_CMS_PATHS = ['/cms/login', '/cms/register']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_CMS_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const { supabaseResponse, user } = await updateSession(request)

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/cms/login'
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/cms/:path*'],
}
