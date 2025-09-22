// app/auth/sign-out/route.ts (or wherever your signout route lives)
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  // Prepare the redirect response up front so we can set cookies on it
  const response = NextResponse.redirect(new URL('/', request.url), { status: 302 })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...(options as CookieOptions) })
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...(options as CookieOptions), maxAge: 0 })
        },
      },
    }
  )

  // No need to call getUser(); just sign out (idempotent)
  // Default scope revokes the refresh token server-side and clears cookies.
  await supabase.auth.signOut()

  // (Optional) Revalidate anything that depends on auth
  revalidatePath('/', 'layout')

  return response
}
