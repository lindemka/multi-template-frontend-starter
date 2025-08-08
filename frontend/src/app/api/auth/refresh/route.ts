import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const refreshToken = req.cookies.get('refreshToken')?.value
    if (!refreshToken) return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const res = await fetch(`${backend}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    })
    const data = await res.json()
    if (!res.ok) return NextResponse.json(data, { status: res.status })
    const response = NextResponse.json({ ok: true })
    const isSecure = process.env.NODE_ENV === 'production'
    response.cookies.set('accessToken', data.accessToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 15 })
    response.cookies.set('refreshToken', data.refreshToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
    return response
}


