'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClientRSC } from '@/../utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClientRSC()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '') // add hidden input in your form

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    // bounce back to login with a message instead of /error
    redirect(`/login?error=${encodeURIComponent(error.message)}${next ? `&next=${encodeURIComponent(next)}` : ''}`)
  }

  // optional: revalidate paths that show user state
  revalidatePath('/', 'layout')
  redirect(next || '/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClientRSC()
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // If email confirmations are on, the user may not be "signed in" yet.
  // Redirect to a "check your email" or back to login with a success notice.
  redirect('/login?info=check_email')
}
