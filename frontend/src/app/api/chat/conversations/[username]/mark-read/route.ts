import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    const res = await fetch(`${backend}/api/chat/conversations/${params.username}/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
    } as RequestInit)
    if (!res.ok) {
        return NextResponse.json({ error: 'failed' }, { status: res.status })
    }
    return new NextResponse(null, { status: 204 })
}


