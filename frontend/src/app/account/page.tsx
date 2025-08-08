import { ProtectedRoute } from '@/components/protected-route'

export default function AccountPage() {
    return (
        <ProtectedRoute>
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Account</h1>
                <p>Profile, Security, Email</p>
            </div>
        </ProtectedRoute>
    )
}


