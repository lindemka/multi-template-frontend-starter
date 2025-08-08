import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const refreshToken = req.cookies.get('refreshToken')?.value
    await fetch(`${backend}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
    })
    const res = NextResponse.json({ ok: true })
    const isSecure = process.env.NODE_ENV === 'production'
    res.cookies.set('accessToken', '', { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 0 })
    res.cookies.set('refreshToken', '', { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 0 })
    return res
}


