import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value
    const body = await req.json()

    const res = await fetch(`${backend}/api/account/change-username`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify(body),
    })
    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
}


