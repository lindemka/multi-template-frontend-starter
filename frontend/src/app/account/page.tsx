"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import EditProfileModal from '@/components/profile/EditProfileModal'
import { Loader2, Mail, Shield, User, Hash } from 'lucide-react'

type CurrentUser = {
    id: number
    username: string
    email: string
    firstName?: string
    lastName?: string
    role?: string
}

export default function AccountPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<CurrentUser | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            try {
                const res = await fetch('/api/account/me', { cache: 'no-store' })
                if (!res.ok) throw new Error('Failed to load account data')
                const data = await res.json()
                if (!cancelled) setUser(data)
            } catch (e) {
                if (!cancelled) setError((e as Error).message)
            } finally {
                if (!cancelled) setIsLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    return (
        <ProtectedRoute>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Account</h1>
                    <p className="text-muted-foreground">Manage your profile and security settings</p>
                </div>

                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Profile</CardTitle>
                                <CardDescription>View and edit your basic profile information</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Name</div>
                                    <div className="font-medium">{[user?.firstName, user?.lastName].filter(Boolean).join(' ') || '—'}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Username</div>
                                    <div className="font-medium">{user?.username}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">Role</div>
                                    <div className="font-medium">{user?.role || '—'}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsEditOpen(true)}>Edit profile</Button>
                                    <Button asChild variant="outline">
                                        <Link href="/dashboard/profile">Open profile</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email</CardTitle>
                                    <CardDescription>Change your account email address</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Current email</div>
                                        <div className="font-medium">{user?.email}</div>
                                    </div>
                                    <Button asChild>
                                        <Link href="/account/email">Change email</Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security</CardTitle>
                                    <CardDescription>Update your password and security settings</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Password</div>
                                        <div className="font-medium">Last changed: —</div>
                                    </div>
                                    <Button asChild>
                                        <Link href="/account/security">Change password</Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><Hash className="h-5 w-5" /> Username</CardTitle>
                                    <CardDescription>Change your public username</CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Current username</div>
                                        <div className="font-medium">{user?.username}</div>
                                    </div>
                                    <Button asChild>
                                        <Link href="/account/username">Change username</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <Button asChild variant="link" className="px-0">
                        <Link href="/dashboard/account">Open advanced settings</Link>
                    </Button>
                </div>
            </div>

            <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
        </ProtectedRoute>
    )
}

