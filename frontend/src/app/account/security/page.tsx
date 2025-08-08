"use client"
import { useState } from 'react'

export default function SecurityPage() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [message, setMessage] = useState('')
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/account/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) })
        const data = await res.json()
        setMessage(data.message || data.error || (res.ok ? 'Updated' : 'Error'))
    }
    return (
        <div className="p-6">
            <h2 className="font-semibold mb-4">Change password</h2>
            <form onSubmit={onSubmit} className="space-y-3">
                <input className="border p-2" placeholder="Current password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <input className="border p-2" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                <button className="bg-black text-white px-4 py-2">Save</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    )
}


