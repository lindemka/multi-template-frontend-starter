"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { resolveAvatarUrl } from '@/lib/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ChevronDown, MoreHorizontal, SquareArrowOutUpRight, X, ArrowDown } from 'lucide-react'

export type ChatMessage = {
    id: number
    content: string
    sender: { username: string; avatar?: string | null }
    recipient: { username: string; avatar?: string | null }
    createdAt: string
}

export default function ChatWindow({
    username,
    headerAvatar,
    messages,
    me,
    meAvatar,
    onSend,
    onClose,
    onMinimize,
}: {
    username: string
    headerAvatar?: string | null
    messages: ChatMessage[]
    me: string | null
    meAvatar?: string | null
    onSend: (text: string) => void
    onClose: () => void
    onMinimize: () => void
}) {
    const imageOrNull = (url?: string | null) => (url && url.trim() ? url : undefined)

    const initialsFromUsername = (u: string | null | undefined) => {
        if (!u) return 'U'
        const parts = u.split(/[^a-zA-Z0-9]+/).filter(Boolean)
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    const [input, setInput] = useState('')
    const endRef = useRef<HTMLDivElement | null>(null)
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const [autoStick, setAutoStick] = useState(true)

    const groups = useMemo(() => groupMessagesByDay(messages), [messages])

    useEffect(() => {
        if (autoStick) endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, autoStick])

    useEffect(() => {
        // Initial stick to bottom on mount
        endRef.current?.scrollIntoView({ behavior: 'instant' as any })
    }, [])

    const onScroll = () => {
        const el = viewportRef.current
        if (!el) return
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24
        setAutoStick(atBottom)
    }

    const handleSend = () => {
        const text = input.trim()
        if (!text) return
        onSend(text)
        setInput('')
    }

    return (
        <Card className="w-[95vw] max-w-[420px] h-[70vh] max-h-[560px] md:w-[380px] md:h-[520px] p-0 flex flex-col shadow-2xl rounded-xl overflow-hidden" data-testid="chat-window" data-thread="true">
            <div className="flex items-center gap-2 p-3 border-b bg-muted/20">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Avatar className="h-7 w-7">
                        {(() => { const src = resolveAvatarUrl(headerAvatar); return imageOrNull(src) ? (<AvatarImage src={src!} alt={username} />) : null })()}
                        <AvatarFallback delayMs={0}>{initialsFromUsername(username)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium truncate">{username}</div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open full">
                    <SquareArrowOutUpRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Minimize" onClick={onMinimize}>
                    <ChevronDown className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Close" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex-1 flex flex-col min-h-0" data-testid="chat-thread">
                <div
                    ref={viewportRef}
                    onScroll={onScroll}
                    className="flex-1 p-3 overflow-y-auto overscroll-contain"
                    data-testid="chat-scroll"
                >
                    <div className="space-y-3">
                        {groups.map((group) => (
                            <div key={group.date} className="space-y-2">
                                <div className="text-[11px] text-muted-foreground text-center sticky top-0 z-10">
                                    {new Date(group.date + 'T00:00:00').toLocaleDateString()}
                                </div>
                                {group.items.map((m) => {
                                    const mine = m.sender?.username === me
                                    return (
                                        <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'} items-end gap-2`} data-testid="chat-msg" data-username={m.sender?.username}>
                                            {!mine && (
                                                <Avatar className="h-6 w-6">
                                                    {(() => { const src = resolveAvatarUrl(m.sender?.avatar); return imageOrNull(src) ? (<AvatarImage src={src!} alt={m.sender?.username || 'User'} />) : null })()}
                                                    <AvatarFallback delayMs={0}>{initialsFromUsername(m.sender?.username)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${mine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                                                <div className="whitespace-pre-wrap break-words">{m.content}</div>
                                                <div className={`text-[10px] mt-1 ${mine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(m.createdAt)}</div>
                                            </div>
                                            {mine && (
                                                <Avatar className="h-6 w-6">
                                                    {(() => { const src = resolveAvatarUrl(meAvatar); return imageOrNull(src) ? (<AvatarImage src={src!} alt={me || 'Me'} />) : null })()}
                                                    <AvatarFallback delayMs={0}>{initialsFromUsername(me)}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                        <div ref={endRef} />
                        {/* Jump to latest button when scrolled up */}
                        {!autoStick && (
                            <div className="sticky bottom-3 flex justify-center">
                                <Button size="sm" variant="secondary" onClick={() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); setAutoStick(true) }}>
                                    <ArrowDown className="h-4 w-4 mr-1" /> Jump to latest
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-2 border-t">
                    <div className="flex items-end gap-2">
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSend(); return }
                                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                            }}
                            placeholder="Write a message"
                            className="min-h-10 max-h-32"
                        />
                        <Button onClick={handleSend} disabled={!input.trim()}>Send</Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}

function groupMessagesByDay(items: ChatMessage[]) {
    const groups: { date: string; items: ChatMessage[] }[] = []
    for (const m of items) {
        const d = new Date(m.createdAt)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const last = groups[groups.length - 1]
        if (!last || last.date !== key) groups.push({ date: key, items: [m] })
        else last.items.push(m)
    }
    return groups
}

function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}


