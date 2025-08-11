import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    
    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    const res = await fetch(`${backend}/api/chat/ws-ticket`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    } as RequestInit)
    
    if (!res.ok) {
        return NextResponse.json({ error: 'Failed to get WebSocket ticket' }, { status: res.status })
    }
    
    let data: unknown = null
    try { 
        data = await res.json() 
    } catch { 
        data = { error: 'Invalid response format' } 
    }
    return NextResponse.json(data, { status: res.status })
}


