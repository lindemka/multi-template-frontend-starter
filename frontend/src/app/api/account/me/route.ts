import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    
    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    try {
        const res = await fetch(`${backend}/api/account/me`, { 
            headers: { 'Authorization': `Bearer ${accessToken}` } 
        })
        
        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch user data' }, { status: res.status })
        }
        
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        console.error('Error in /api/account/me:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}


