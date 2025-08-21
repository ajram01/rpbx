'use server'
import { redirect } from 'next/navigation'
import { createClient } from '../../../../utils/supabase/server'

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const full_name = String(formData.get('full_name') ?? '')
  const username = String(formData.get('username') ?? '')
  const next = String(formData.get('next') ?? '/pricing')

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, username },
      // set in Supabase Auth settings or override here:
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })
  if (error) throw new Error(error.message)

  // If email confirmation is ON, user must confirm before session exists.
  // Send them to a "Check your email" page, or straight to pricing if you disabled confirmations.
  redirect('/check-email') // or redirect(next)
}