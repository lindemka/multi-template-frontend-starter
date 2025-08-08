"use client"
import { useState } from 'react'

export default function EmailPage() {
    const [newEmail, setNewEmail] = useState('')
    const [message, setMessage] = useState('')
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/account/change-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newEmail }) })
        const data = await res.json()
        setMessage(data.message || data.error || (res.ok ? 'Sent' : 'Error'))
    }
    return (
        <div className="p-6">
            <h2 className="font-semibold mb-4">Change email</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="border p-2" placeholder="New email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
                <button className="bg-black text-white px-4 py-2">Send confirmation</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}


