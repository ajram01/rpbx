import 'server-only'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

type RequestCookie = { name: string; value: string }
type CookieToSet = { name: string; value: string; options: CookieOptions }

// ---------- RSC: read-only ----------
export async function createClientRSC() {
  const store = await cookies() // Next 15: async
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async (): Promise<RequestCookie[]> =>
          store.getAll().map(({ name, value }) => ({ name, value })),
        // Never write cookies from RSC (no-op)
        setAll: async (_cookiesToSet: CookieToSet[]) => { /* no-op */ },
      },
    }
  )
}

// ---------- Server Action / Route Handler: writable ----------
export async function createClientWritable() {
  const store = await cookies() // in actions/routes: .set is allowed
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async (): Promise<RequestCookie[]> =>
          store.getAll().map(({ name, value }) => ({ name, value })),
        setAll: async (cookiesToSet: CookieToSet[]) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            store.set(name, value, options)
          })
        },
      },
    }
  )
}
