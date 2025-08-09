"use client"
import ChatDock from '@/components/chat/ChatDock'

export default function ChatDockHost() {
    if (process.env.NODE_ENV === 'test') return null
    return <ChatDock />
}


