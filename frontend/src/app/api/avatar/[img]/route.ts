import { NextRequest } from 'next/server'

function fallbackSvg(seed: number): string {
  const colors = [
    ['#0ea5e9', '#22d3ee'],
    ['#8b5cf6', '#ec4899'],
    ['#10b981', '#84cc16'],
    ['#f59e0b', '#ef4444'],
    ['#6366f1', '#06b6d4'],
  ]
  const pair = colors[seed % colors.length]
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${pair[0]}"/>
      <stop offset="100%" stop-color="${pair[1]}"/>
    </linearGradient>
  </defs>
  <rect width="150" height="150" rx="24" fill="url(#g)"/>
  <circle cx="75" cy="62" r="30" fill="rgba(255,255,255,0.8)"/>
  <rect x="30" y="95" width="90" height="35" rx="18" fill="rgba(255,255,255,0.8)"/>
  <rect x="42" y="105" width="66" height="10" rx="5" fill="rgba(255,255,255,0.9)"/>
  <rect x="52" y="120" width="46" height="6" rx="3" fill="rgba(255,255,255,0.9)"/>
  <style>text{font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial}</style>
</svg>`
}

export async function GET(req: NextRequest, { params }: { params: { img: string } }) {
  const idxStr = String(params.img || '1').replace(/[^0-9]/g, '') || '1'
  const idx = Number(idxStr)
  const target = `https://i.pravatar.cc/150?img=${idxStr}`
  try {
    const res = await fetch(target, { cache: 'no-store' })
    if (!res.ok) throw new Error('upstream failed')
    const buf = await res.arrayBuffer()
    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch {
    const svg = fallbackSvg(idx)
    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }
}


