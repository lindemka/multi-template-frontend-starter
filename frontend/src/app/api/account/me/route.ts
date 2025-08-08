import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    const res = await fetch(`${backend}/api/account/me`, { headers: { ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}) } })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}


