// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  // Start a response we can mutate
  const res = NextResponse.next({ request: { headers: req.headers } })

  // Build a Supabase client that reads cookies from the request
  // and writes cookies onto the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () =>
          req.cookies.getAll().map(({ name, value }) => ({ name, value })),
        setAll: (cookiesToSet: { name: string; value: string; options: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  // Trigger a session check/refresh; if refresh happens, cookies are added to `res`
  await supabase.auth.getUser()

  return res
}

export const config = {
  // Limit scope if you want to reduce overhead
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}
