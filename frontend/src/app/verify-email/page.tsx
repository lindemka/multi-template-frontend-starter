"use client"
import { useEffect, useState } from 'react'

export default function VerifyEmailPage() {
    const [status, setStatus] = useState('Verifying...')
    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        if (!token) { setStatus('Missing token'); return }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_ORIGIN || 'http://localhost:8080'}/api/auth/verify-email?token=${encodeURIComponent(token)}`, { method: 'POST' })
            .then(async r => { const d = await r.json(); setStatus(d.message || d.error || (r.ok ? 'Verified' : 'Error')) })
            .catch(() => setStatus('Error'))
    }, [])
    return <div className="min-h-screen flex items-center justify-center"><p>{status}</p></div>
}


