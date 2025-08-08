"use client"
import { useEffect, useState } from 'react'

export default function ResetPasswordPage() {
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        setToken(params.get('token') || '')
    }, [])
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const backend = process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:8080'
        const res = await fetch(`${backend}/api/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, newPassword }) })
        const data = await res.json()
        setMessage(data.message || data.error || (res.ok ? 'Password updated' : 'Error'))
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="border p-2" type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button className="bg-black text-white px-4 py-2">Set new password</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}


