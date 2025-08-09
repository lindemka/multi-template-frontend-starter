import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    const refreshToken = req.cookies.get('refreshToken')?.value

    const fetchMessages = async (token?: string) => {
        const res = await fetch(`${backend}/api/chat/messages/${params.username}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        } as RequestInit)
        let data: any = []
        try { data = await res.json() } catch { data = [] }
        return { res, data }
    }

    try {
        // First attempt with current access token (if present)
        let { res, data } = await fetchMessages(accessToken)
        if (res.status !== 401) {
            return NextResponse.json(data, { status: res.status })
        }
        // If unauthorized and we have a refresh token, try refreshing then retry
        if (refreshToken) {
            const refreshRes = await fetch(`${backend}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            })
            if (refreshRes.ok) {
                const refreshed = await refreshRes.json() as any
                const retry = await fetchMessages(refreshed.accessToken)
                const response = NextResponse.json(retry.data, { status: retry.res.status })
                const isSecure = process.env.NODE_ENV === 'production'
                response.cookies.set('accessToken', refreshed.accessToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 15 })
                response.cookies.set('refreshToken', refreshed.refreshToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
                return response
            }
        }
        // Still unauthorized or refresh failed
        return NextResponse.json([], { status: 401 })
    } catch {
        return NextResponse.json([], { status: 502 })
    }
}


