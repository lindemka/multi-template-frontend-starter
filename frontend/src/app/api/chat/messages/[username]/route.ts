import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
    const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const accessToken = req.cookies.get('accessToken')?.value

    console.log('Messages API called for username:', params.username)
    console.log('Access token exists:', !!accessToken)

    if (accessToken) {
        try {
            console.log('Testing backend call with token')
            const res = await fetch(`${backend}/api/chat/messages/${params.username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            console.log('Backend response status:', res.status)

            if (res.ok) {
                const data = await res.json()
                console.log('Backend response successful, returning data')
                return NextResponse.json(data)
            } else {
                console.log('Backend response failed:', res.status)
                const errorText = await res.text()
                console.log('Backend error text:', errorText)
                return NextResponse.json([], { status: res.status })
            }
        } catch (error) {
            console.log('Exception in backend call:', error)
            return NextResponse.json([], { status: 502 })
        }
    } else {
        console.log('No access token available')
        return NextResponse.json([], { status: 401 })
    }
}


