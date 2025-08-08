import { NextRequest, NextResponse } from 'next/server'

// Public, unauthenticated pages
const PUBLIC_PATHS: string[] = [
    '/',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/test',
]

function isPublicPath(pathname: string): boolean {
    if (pathname.startsWith('/_next') || pathname.startsWith('/favicon') || pathname.startsWith('/assets')) return true
    return PUBLIC_PATHS.includes(pathname)
}

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl

    // Never guard API routes
    if (pathname.startsWith('/api')) return NextResponse.next()

    // Allow public pages
    if (isPublicPath(pathname)) return NextResponse.next()

    // For all other pages, require auth
    const access = req.cookies.get('accessToken')?.value
    const refresh = req.cookies.get('refreshToken')?.value
    if (access) return NextResponse.next()

    if (refresh) {
        // Perform refresh against backend directly and set cookies here
        const backend = process.env.BACKEND_ORIGIN || 'http://localhost:8080'
        try {
            const beRes = await fetch(`${backend}/api/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: refresh })
            })
            if (beRes.ok) {
                const data = await beRes.json() as any
                const res = NextResponse.next()
                const isSecure = process.env.NODE_ENV === 'production'
                res.cookies.set('accessToken', data.accessToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 15 })
                res.cookies.set('refreshToken', data.refreshToken, { httpOnly: true, secure: isSecure, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 })
                return res
            }
        } catch {
            // fall through to redirect
        }
    }

    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: ['/:path*']
}


