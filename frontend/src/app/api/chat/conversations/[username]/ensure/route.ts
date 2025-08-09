import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest, { params }: { params: { username: string } }) {
  const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
  const accessToken = req.cookies.get('accessToken')?.value
  const res = await fetch(`${backend}/api/chat/conversations/${params.username}/ensure`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) },
  } as RequestInit)
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}


