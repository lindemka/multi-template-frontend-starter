"use client"

import { useRouter } from 'next/navigation'

export default function MobileNavMessages() {
    const router = useRouter()
    
    return (
        <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur border-b">
            <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center justify-between">
                <a href="/" className="font-semibold">fbase</a>
                <button
                    type="button"
                    aria-label="Open messages"
                    onClick={() => {
                        router.push('/dashboard/messages')
                    }}
                    className="text-sm font-medium px-3 py-1 rounded-md border"
                >
                    Nachrichten
                </button>
            </div>
        </div>
    )
}


