'use server'
import { createClient } from '@/../utils/supabase/server'

export async function signUp(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const full_name = String(formData.get('full_name') ?? '')
  const username = String(formData.get('username') ?? '')

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

}