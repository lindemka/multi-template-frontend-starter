import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { img: string } }) {
    const idx = String(params.img || '1').replace(/[^0-9]/g, '') || '1'
    const target = `https://i.pravatar.cc/150?img=${idx}`
    try {
        const res = await fetch(target, { cache: 'no-store' })
        const buf = await res.arrayBuffer()
        return new Response(buf, {
            status: res.status,
            headers: {
                'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'no-store',
            },
        })
    } catch {
        return new Response(null, { status: 502 })
    }
}


