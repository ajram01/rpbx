'use client'
import { requestReset } from './actions'
import { useFormState } from 'react-dom'
import Button from "@/app/components/Button"

const initialState = { ok: false, message: ''}

export default function ForgotPasswordPage() {
    const [state, formAction] = useFormState(requestReset, initialState)

    return (
        <form action={ formAction } className="space-y-4 max-w-sm">
            <label className="block">
                <span>Email</span>
                <input name="email" type="email" required className="border p-2 w-full"/>
            </label>
            <Button type="submit">
                Send reset link
            </Button>
            {state.message && <p>{state.message}</p>}
        </form>
    )
}