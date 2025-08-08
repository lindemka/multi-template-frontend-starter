"use client"

import Link from 'next/link'
import { ProtectedRoute } from '@/components/protected-route'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccountHelpPage() {
    return (
        <ProtectedRoute>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Account Manual</h1>
                    <p className="text-muted-foreground">How to manage your account settings</p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Email</CardTitle>
                            <CardDescription>Update the email address associated with your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">Go to the email settings page to send a confirmation link to your new address.</p>
                            <Link href="/account/email" className="underline text-blue-600">Open Email Settings</Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>Keep your account secure by changing your password regularly</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">Use the security page to change your password. You will need your current password.</p>
                            <Link href="/account/security" className="underline text-blue-600">Open Security Settings</Link>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Username</CardTitle>
                            <CardDescription>Update how your name appears publicly</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-3 text-sm text-muted-foreground">Choose a unique username. This is used in mentions and links.</p>
                            <Link href="/account/username" className="underline text-blue-600">Open Username Settings</Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    )
}


