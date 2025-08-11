import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    
    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const res = await fetch(`${backend}/api/chat/conversations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    } as RequestInit)
    
    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: res.status })
    }
    
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}


