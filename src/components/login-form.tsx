'use client'

import * as React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginAction } from '@/app/login/actions'
import Link from 'next/link'

type Props = React.ComponentProps<'div'> & { next?: string }

export function LoginForm({ className, next = '', ...props }: Props) {
  const [state, formAction] = useFormState(loginAction, { error: undefined })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Apple or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: wire OAuth buttons to Supabase signInWithOAuth if desired */}
          <div className="grid gap-6">
            <div className="flex flex-col gap-4">
              <Button type="button" variant="outline" className="w-full">Login with Apple</Button>
              <Button type="button" variant="outline" className="w-full">Login with Google</Button>
            </div>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">Or continue with</span>
            </div>

            <form action={formAction} className="grid gap-6">
              {state?.error && (
                <div className="rounded-md border border-red-300 bg-red-50 p-2 text-sm text-red-700">
                  {state.error}
                </div>
              )}

              <input type="hidden" name="next" value={next} />

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required autoComplete="email" />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>

              <SubmitButton />
            </form>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href={next ? `/pricing?next=${encodeURIComponent(next)}` : '/pricing'}
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Signing in…' : 'Login'}
    </Button>
  )
}
