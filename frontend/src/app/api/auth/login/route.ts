import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
        const res = await fetch(`${backend}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        // Backend may send empty body for some errors (e.g., 403). Try parse JSON safely.
        let data: any = null
        try {
            data = await res.json()
        } catch {
            data = null
        }
        if (!res.ok) {
            const payload = data ?? { error: res.status === 403 ? 'Email not verified' : 'Request failed' }
            return NextResponse.json(payload, { status: res.status })
        }
        const response = NextResponse.json({ ok: true })
        const isSecure = process.env.NODE_ENV === 'production'
        response.cookies.set('accessToken', data.accessToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 15 })
        response.cookies.set('refreshToken', data.refreshToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
        return response
    } catch (e) {
        return NextResponse.json({ error: 'Backend unavailable' }, { status: 502 })
    }
}


