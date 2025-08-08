"use client"
import { useState } from 'react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const backend = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:8080'
        const res = await fetch(`${backend}/api/auth/forgot-password`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
        })
        const data = await res.json()
        setMessage(data.message || data.error || (res.ok ? 'Check your email' : 'Error'))
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <button className="bg-black text-white px-4 py-2">Send reset link</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}


