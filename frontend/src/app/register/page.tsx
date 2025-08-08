"use client"
import { useState } from 'react'

export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' })
    const [message, setMessage] = useState<string | null>(null)
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        const data = await res.json()
        setMessage(data.message || data.error || 'Done')
    }
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <form onSubmit={onSubmit} className="max-w-md w-full space-y-3">
                <input className="border p-2 w-full" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <input className="border p-2 w-full" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <input className="border p-2 w-full" placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                <button className="bg-black text-white px-4 py-2">Register</button>
                {message && <p className="text-sm">{message}</p>}
            </form>
        </div>
    )
}


