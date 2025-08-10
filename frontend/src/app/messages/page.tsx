"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import MobileNavMessages from '@/components/chat/MobileNavMessages'
import ChatDock from '@/components/chat/ChatDock'

// Full-page messages view: conversations left, thread right
export const dynamic = 'force-dynamic'

export default function MessagesPage() {
    // The dock already provides the conversations + thread behavior
    // For full-page, we simply mount the dock in an always-open state using a wrapper
    // This page is hidden on small screens in favor of the dock
    return (
        <div className="p-4">
            <MobileNavMessages />
            <h1 className="text-xl font-semibold mb-4">Nachrichten</h1>
            <div className="hidden md:block">
                <ChatDock />
            </div>
            <div className="md:hidden text-sm text-muted-foreground">
                Use the Nachrichten dock at the bottom-right to access your messages on mobile.
            </div>
        </div>
    )
}


