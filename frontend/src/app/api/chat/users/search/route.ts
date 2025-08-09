import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const res = await fetch(`${backend}/api/chat/users/search?q=${encodeURIComponent(q)}`, {
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    } as RequestInit)
    const data = await res.json().catch(() => [])
    return NextResponse.json(data, { status: res.status })
}


