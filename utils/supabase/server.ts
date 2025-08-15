import 'server-only'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

type RequestCookie = { name: string; value: string }
type CookieToSet = { name: string; value: string; options: CookieOptions }

// runtime type guard for environments where cookies() is writable (Server Actions / Route Handlers)
function canSetCookies(
  store: unknown
): store is { set: (name: string, value: string, options?: CookieOptions) => void } {
  return typeof (store as { set?: unknown })?.set === 'function'
}

export function createClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Next.js 15: cookies() is async
        getAll: async (): Promise<RequestCookie[]> => {
          const store = await cookies()
          // minimal shape to satisfy @supabase/ssr
          return store.getAll().map(({ name, value }) => ({ name, value }))
        },
        setAll: async (cookiesToSet: CookieToSet[]): Promise<void> => {
          const store = await cookies()
          if (canSetCookies(store)) {
            cookiesToSet.forEach(({ name, value, options }) => {
              store.set(name, value, options)
            })
          }
          // In Server Components store is read-only → no-op (middleware will persist refresh)
        },
      },
    }
  )
}
