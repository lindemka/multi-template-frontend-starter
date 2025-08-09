"use client"
export const dynamic = 'force-dynamic'
import { useState } from 'react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch(`/api/auth/forgot-password`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
            })
            const data = await res.json().catch(() => ({}))
            setMessage(data.message || data.error || (res.ok ? 'Check your email' : 'Error'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6" suppressHydrationWarning>
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button type="submit" className="bg-black text-white px-4 py-2" disabled={loading}>{loading ? 'Sending…' : 'Send reset link'}</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}


