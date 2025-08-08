import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
        const res = await fetch(`${backend}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (e) {
        return NextResponse.json({ error: 'Backend unavailable' }, { status: 502 })
    }
}


