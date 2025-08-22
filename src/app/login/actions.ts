'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/../utils/supabase/server'

type State = { error?: string }

export async function loginAction(_: State, formData: FormData): Promise<State> {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const userId = data.user?.id
  if (!userId) return { error: 'Login failed. No user returned.' }

  // If a next param is provided (e.g. /onboarding/business/basics), honor it.
  if (next && next.startsWith('/')) redirect(next)

  // Smart default: send users to the right place based on role + drafts
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', userId)
    .maybeSingle()
  const role = (profile?.user_type ?? 'member') as 'business' | 'investor' | 'member'

  if (role === 'business') {
    const { data: listing } = await supabase
      .from('business_listings')
      .select('id,status')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!listing || listing.status === 'draft') redirect('/onboarding/business/basics')
    redirect('/dashboard')
  }

  if (role === 'investor') {
    const { data: inv } = await supabase
      .from('investor_profiles')
      .select('id,status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!inv || inv.status === 'draft') redirect('/onboarding/investor/basics')
    redirect('/dashboard')
  }

  redirect('/dashboard')
}
