// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set(name, value, options as CookieOptions)
        },
        remove(name, options) {
          response.cookies.set(name, '', { ...(options as CookieOptions), maxAge: 0 })
        },
      },
    }
  )

  const { error } = await supabase.auth.getUser()
  // 400 = no refresh token (anonymous) => ignore
  if (error && error.status !== 400) console.error('middleware getUser:', error)

  return response
}

export const config = {
  matcher: [
    // exclude static & optionally '/login' and OAuth callback
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|login|auth/callback).*)',
  ],
}
