"use client"

import { useState } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function UsernamePage() {
    const [username, setUsername] = useState('')
    const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' })
    const [saving, setSaving] = useState(false)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage({ type: '', text: '' })
        try {
            const res = await fetch('/api/account/change-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
                setMessage({ type: 'error', text: data.error || data.message || 'Failed to change username' })
            } else {
                setMessage({ type: 'success', text: data.message || 'Username updated successfully' })
                // Update local storage user cache
                try {
                    const userStr = localStorage.getItem('user')
                    if (userStr) {
                        const user = JSON.parse(userStr)
                        localStorage.setItem('user', JSON.stringify({ ...user, username }))
                    }
                } catch { }
            }
        } catch {
            setMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <ProtectedRoute>
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Change Username</CardTitle>
                        <CardDescription>Choose a unique public username</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={onSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">New Username</Label>
                                <Input id="username" value={username} onChange={e => setUsername(e.target.value)} placeholder="yourname" required />
                            </div>
                            {message.text && (
                                <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                                    <AlertDescription>{message.text}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    )
}


