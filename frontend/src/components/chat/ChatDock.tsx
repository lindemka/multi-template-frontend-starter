"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { connectChat, sendChat } from '@/lib/chatClient'
import { auth } from '@/lib/auth'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Paperclip, Smile, Search, ChevronDown, MoreHorizontal, SquareArrowOutUpRight, SquarePen } from 'lucide-react'
import ComposeUserResults from './ComposeUserResults'

type Message = {
    id: number
    content: string
    sender: { username: string }
    recipient: { username: string }
    createdAt: string
}

type Conversation = { id: number; otherUsername: string; updatedAt: string; lastMessage?: string; lastMessageAt?: string; unreadCount?: number }

declare global {
    interface Window { __wsSent?: boolean }
}

export default function ChatDock() {
    const [open, setOpen] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [active, setActive] = useState<string | null>(null)
    const [messages, setMessages] = useState<Record<string, Message[]>>({})
    const [input, setInput] = useState('')
    const [filter, setFilter] = useState('')
    const [composeOpen, setComposeOpen] = useState(false)
    const [composeQuery, setComposeQuery] = useState('')
    const initialized = useRef(false)
    const meRef = useRef<string | null>(null)
    const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const totalUnread = useMemo(() => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0), [conversations])

    useEffect(() => {
        if (initialized.current) return
        initialized.current = true
            ; (async () => {
                try {
                    // Restore persisted UI state (LinkedIn-like behavior)
                    try {
                        const savedOpen = typeof window !== 'undefined' ? window.localStorage.getItem('chat.open') : null
                        if (savedOpen === '1') setOpen(true)
                        const savedActive = typeof window !== 'undefined' ? window.localStorage.getItem('chat.active') : null
                        if (savedActive) setActive(savedActive)
                    } catch { /* noop */ }
                    try { meRef.current = auth.getUser()?.username || null } catch { }
                    const c = await connectChat(async (raw: unknown) => {
                        const msg = raw as Message
                        const sender = msg.sender?.username
                        const recipient = msg.recipient?.username
                        // Determine peer conservatively: prefer current active thread, else sender/recipient
                        const peer = (active && (sender === active || recipient === active)) ? active : (sender || recipient)
                        if (!peer) return
                        setMessages((prev) => ({ ...prev, [peer]: [...(prev[peer] || []), msg] }))
                        setConversations((prev) => {
                            const exists = prev.find((c) => c.otherUsername === peer)
                            if (exists) {
                                return prev.map((c) => {
                                    if (c.otherUsername !== peer) return c
                                    const unreadCount = (peer !== active) ? ((c.unreadCount || 0) + 1) : 0
                                    return { ...c, updatedAt: new Date().toISOString(), lastMessage: msg.content, lastMessageAt: msg.createdAt, unreadCount }
                                })
                            }
                            return [{ id: Date.now(), otherUsername: peer, updatedAt: new Date().toISOString(), lastMessage: msg.content, lastMessageAt: msg.createdAt, unreadCount: (peer !== active) ? 1 : 0 }, ...prev]
                        })
                        setActive((prev) => prev ?? peer)
                        setOpen(true)
                        // If message pertains to the active thread, mark as read and refresh from server
                        if (peer === active) {
                            try { await fetch(`/api/chat/conversations/${peer}/mark-read`, { method: 'POST', credentials: 'include' }) } catch { }
                            setConversations((prev) => prev.map(c => c.otherUsername === peer ? { ...c, unreadCount: 0 } : c))
                            await loadThread(peer)
                        }
                    })
                    if (!c) return
                    const convRes = await fetch('/api/chat/conversations', { credentials: 'include' })
                    if (convRes.ok) {
                        const data: Conversation[] = await convRes.json()
                        data.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        setConversations(data)
                        if (data.length && !active) {
                            setActive(data[0].otherUsername)
                            await loadThread(data[0].otherUsername)
                        }
                    }
                } catch (e) {
                    console.error('Chat init failed', e)
                }
            })()
    }, [])

    // Persist UI state
    useEffect(() => {
        try { window.localStorage.setItem('chat.open', open ? '1' : '0') } catch { /* noop */ }
    }, [open])
    useEffect(() => {
        if (!active) return
        try { window.localStorage.setItem('chat.active', active) } catch { /* noop */ }
    }, [active])

    // Global open-chat event: open thread with username
    useEffect(() => {
        const handler = (e: Event) => {
            const u = (e as CustomEvent<{ username: string }>).detail?.username
            if (!u) return
            setOpen(true)
                // Persist and select only if user is actually available
                ; (async () => {
                    try {
                        const resp = await fetch(`/api/chat/conversations/${u}/ensure`, { method: 'POST', credentials: 'include' })
                        if (!resp.ok) {
                            // Fallback: attempt to fetch messages anyway to create the thread lazily
                            const msgs = await fetch(`/api/chat/messages/${u}`, { credentials: 'include' }).then(r => r.ok ? r.json() : [])
                            setConversations((prev) => {
                                const exists = prev.find((c) => c.otherUsername === u)
                                if (exists) return prev
                                return [{ id: Date.now(), otherUsername: u, updatedAt: new Date().toISOString(), lastMessage: msgs.at?.(-1)?.content, lastMessageAt: msgs.at?.(-1)?.createdAt }, ...prev]
                            })
                            setActive(u)
                            await loadThread(u)
                            return
                        }
                        const conv = await resp.json()
                        setConversations((prev) => {
                            const exists = prev.find((c) => c.otherUsername === u)
                            if (exists) return prev
                            return [{ id: conv.id ?? Date.now(), otherUsername: u, updatedAt: conv.updatedAt ?? new Date().toISOString() }, ...prev]
                        })
                        setActive(u)
                        await loadThread(u)
                    } catch {
                        // As a last resort, allow opening the thread UI; backend will enforce permissions
                        setConversations((prev) => prev.some(c => c.otherUsername === u) ? prev : [{ id: Date.now(), otherUsername: u, updatedAt: new Date().toISOString() }, ...prev])
                        setActive(u)
                        await loadThread(u)
                    }
                })()
        }
        window.addEventListener('open-chat', handler as EventListener)
        return () => window.removeEventListener('open-chat', handler as EventListener)
    }, [])

    // When dock is open, briefly poll conversations to pick up new threads
    useEffect(() => {
        if (!open) {
            if (pollTimer.current) clearInterval(pollTimer.current)
            pollTimer.current = null
            return
        }
        let ticks = 0
        const poll = async () => {
            try {
                const res = await fetch('/api/chat/conversations', { credentials: 'include' })
                if (res.ok) {
                    const data: Conversation[] = await res.json()
                    setConversations(data)
                    if (!active && data.length) setActive(data[0].otherUsername)
                }
            } catch { }
            if (++ticks >= 10 && pollTimer.current) {
                clearInterval(pollTimer.current)
                pollTimer.current = null
            }
        }
        poll()
        pollTimer.current = setInterval(poll, 1000)
        return () => { if (pollTimer.current) clearInterval(pollTimer.current); pollTimer.current = null }
    }, [open])

    useEffect(() => {
        if (!active) return
            ; (async () => {
                const data = await fetchMessagesWithFallback(active)
                if (data) {
                    setMessages((prev) => ({ ...prev, [active]: data }))
                    // ensure left list contains this conversation and bump recency
                    setConversations((prev) => {
                        const exists = prev.find((c) => c.otherUsername === active)
                        const updatedAt = data.length ? data[data.length - 1].createdAt : new Date().toISOString()
                        if (exists) {
                            return prev.map((c) => c.otherUsername === active ? { ...c, updatedAt } : c)
                        }
                        // persist newly-opened conversation
                        return [{ id: Date.now(), otherUsername: active, updatedAt }, ...prev]
                    })
                    // mark as read
                    try { await fetch(`/api/chat/conversations/${active}/mark-read`, { method: 'POST', credentials: 'include' }) } catch { }
                }
            })()
    }, [active])

    const activeMessages = useMemo(() => (active ? messages[active] || [] : []), [active, messages])

    // autoscroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeMessages])

    const onSend = async () => {
        if (!active || !input.trim()) return
        const content = input.trim()
        setInput('')
        // optimistic append of my message
        const me = meRef.current || 'me'
        const optimistic: Message = { id: Date.now(), content, sender: { username: me }, recipient: { username: active }, createdAt: new Date().toISOString() }
        setMessages((prev) => ({ ...prev, [active]: [...(prev[active] || []), optimistic] }))
        // ensure conversation exists in the left list
        setConversations((prev) => {
            const exists = prev.some((c) => c.otherUsername === active)
            const updatedAt = optimistic.createdAt
            if (exists) {
                return prev.map((c) => c.otherUsername === active ? { ...c, updatedAt } : c)
            }
            return [{ id: Date.now(), otherUsername: active, updatedAt }, ...prev]
        })
        try {
            const res = await sendChat(active, content)
            if (!res && !(window as any).__wsSent) {
                // If neither REST nor WS acked, rollback
                setMessages((prev) => ({ ...prev, [active]: (prev[active] || []).filter((m) => m.id !== optimistic.id) }))
                window.alert('Message could not be delivered. The user might not be available for messaging.')
                return
            }
        } catch {
            setMessages((prev) => ({ ...prev, [active]: (prev[active] || []).filter((m) => m.id !== optimistic.id) }))
            window.alert('Message could not be delivered. The user might not be available for messaging.')
            return
        }
        // Force-refresh from server so right pane shows persisted history
        await loadThread(active)
    }

    const filteredConversations = conversations.filter(c =>
        !filter.trim() || c.otherUsername.toLowerCase().includes(filter.toLowerCase())
    )

    const groupMessagesByDay = (items: Message[]) => {
        const groups: { date: string; items: Message[] }[] = []
        for (const m of items) {
            const d = new Date(m.createdAt)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            const last = groups[groups.length - 1]
            if (!last || last.date !== key) {
                groups.push({ date: key, items: [m] })
            } else {
                last.items.push(m)
            }
        }
        return groups
    }

    const formatTime = (iso: string) => {
        const d = new Date(iso)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const fetchMessagesWithFallback = async (username: string): Promise<Message[] | null> => {
        try {
            const res = await fetch(`/api/chat/messages/${username}`, { credentials: 'include' })
            if (res.ok) {
                const data: Message[] = await res.json()
                return Array.isArray(data) ? data : []
            }
        } catch { }
        try {
            const ticketRes = await fetch('/api/chat/ws-ticket', { credentials: 'include' })
            if (!ticketRes.ok) return null
            const { token } = await ticketRes.json()
            const backend = (process.env.NEXT_PUBLIC_BACKEND_ORIGIN || process.env.BACKEND_ORIGIN || 'http://localhost:8080') as string
            const direct = await fetch(`${backend}/api/chat/messages/${username}`, { headers: { Authorization: `Bearer ${token}` } })
            if (!direct.ok) return null
            const data: Message[] = await direct.json()
            return Array.isArray(data) ? data : []
        } catch {
            return null
        }
    }

    // Explicit loader to fetch a thread on demand (even if active hasn't changed)
    const loadThread = async (username: string) => {
        if (!username) return
        try {
            // Ensure the conversation exists in the backend (idempotent)
            try { await fetch(`/api/chat/conversations/${username}/ensure`, { method: 'POST', credentials: 'include' }) } catch { }
            const data = await fetchMessagesWithFallback(username)
            if (!data) return
            setMessages((prev) => ({ ...prev, [username]: data }))
            setConversations((prev) => {
                const exists = prev.find((c) => c.otherUsername === username)
                const updatedAt = data.length ? data[data.length - 1].createdAt : new Date().toISOString()
                if (exists) {
                    return prev.map((c) => c.otherUsername === username ? { ...c, updatedAt, unreadCount: 0, lastMessage: data.at(-1)?.content ?? c.lastMessage, lastMessageAt: data.at(-1)?.createdAt ?? c.lastMessageAt } : c)
                }
                return [{ id: Date.now(), otherUsername: username, updatedAt, unreadCount: 0, lastMessage: data.at(-1)?.content, lastMessageAt: data.at(-1)?.createdAt }, ...prev]
            })
            try { await fetch(`/api/chat/conversations/${username}/mark-read`, { method: 'POST', credentials: 'include' }) } catch { }
        } catch { }
    }

    return (
        <div className="fixed bottom-3 right-3 md:bottom-4 md:right-4 z-50">
            {open && (
                <>
                    <Card className="w-[95vw] max-w-[420px] h-[70vh] max-h-[560px] md:w-[420px] md:h-[560px] p-0 flex flex-col shadow-xl rounded-xl overflow-hidden" data-testid="chat-dock">
                        {/* Header - LinkedIn style */}
                        <div className="flex items-center gap-2 p-3 border-b bg-muted/20 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Avatar className="h-6 w-6" />
                                <div className="font-semibold text-base truncate">Nachrichten</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="New message" onClick={() => { setComposeOpen(true); setComposeQuery('') }}>
                                <SquarePen className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Open in full">
                                <SquareArrowOutUpRight className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Minimize" onClick={() => setOpen(false)}>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex h-full overflow-hidden min-h-0">
                            {/* Left: conversations */}
                            <div className="w-56 border-r flex flex-col min-h-0" data-testid="chat-conversations">
                                <div className="p-2">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            placeholder="Search"
                                            className="h-8 pl-8"
                                        />
                                    </div>
                                </div>
                                <Separator />
                                <ScrollArea className="flex-1" type="hover">
                                    <div className="py-1">
                                        {filteredConversations.map((c) => (
                                            <button
                                                key={c.id}
                                                className={`w-full px-3 py-2 hover:bg-accent/70 transition text-left rounded-sm ${active === c.otherUsername ? 'bg-accent' : ''}`}
                                                onClick={async () => { setActive(c.otherUsername); await loadThread(c.otherUsername) }}
                                            >
                                                <div className="flex items-start gap-2">
                                                    <Avatar className="h-8 w-8" />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className={`truncate text-sm ${c.unreadCount ? 'font-semibold' : 'font-medium'}`}>{c.otherUsername}</div>
                                                            <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                                                                {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="truncate text-xs text-muted-foreground max-w-[150px]">{c.lastMessage || ''}</div>
                                                            {c.unreadCount ? (
                                                                <span className="ml-auto inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px]">{c.unreadCount}</span>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                        {!filteredConversations.length && (
                                            <div className="p-3 text-xs text-muted-foreground">No conversations</div>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                            {/* Right: thread */}
                            <div className="flex-1 flex flex-col min-h-0" data-testid="chat-thread">
                                <div className="h-11 flex items-center px-3 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40">
                                    <div className="font-medium text-sm truncate flex-1">{active || 'Select a conversation'}</div>
                                </div>
                                <ScrollArea className="flex-1 p-3" data-testid="chat-scroll" type="hover">
                                    <div className="space-y-3" style={{ minHeight: 0 }}>
                                        {groupMessagesByDay(activeMessages).map(group => (
                                            <div key={group.date} className="space-y-2">
                                                <div className="text-[11px] text-muted-foreground text-center sticky top-0 z-10">
                                                    {new Date(group.date + 'T00:00:00').toLocaleDateString()}
                                                </div>
                                                {group.items.map((m) => {
                                                    const me = meRef.current
                                                    const isMine = m.sender?.username === me
                                                    return (
                                                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`} data-testid="chat-msg" data-username={m.sender?.username}>
                                                            <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isMine ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                                                                <div className="whitespace-pre-wrap break-words">{m.content}</div>
                                                                <div className={`text-[10px] mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{formatTime(m.createdAt)}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </div>
                                </ScrollArea>
                                <div className="p-2 border-t">
                                    <div className="flex items-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Attach file">
                                            <Paperclip className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Insert emoji">
                                            <Smile className="h-4 w-4" />
                                        </Button>
                                        <Textarea
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                                    e.preventDefault()
                                                    onSend()
                                                    return
                                                }
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault()
                                                    onSend()
                                                }
                                            }}
                                            placeholder="Write a message"
                                            className="min-h-10 max-h-32"
                                        />
                                        <Button onClick={onSend} disabled={!input.trim()}>Send</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>New message</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-3">
                                <Input
                                    autoFocus
                                    placeholder="Search by name or username"
                                    value={composeQuery}
                                    onChange={(e) => setComposeQuery(e.target.value)}
                                />
                                <div className="max-h-60 overflow-y-auto space-y-1">
                                    <ComposeUserResults
                                        query={composeQuery}
                                        onPick={async (username) => {
                                            setActive(username)
                                            setComposeOpen(false)
                                            try {
                                                const res = await fetch(`/api/chat/messages/${username}`, { credentials: 'include' })
                                                if (res.ok) {
                                                    const data: Message[] = await res.json()
                                                    setMessages((prev) => ({ ...prev, [username]: data }))
                                                    setConversations((prev) => {
                                                        if (prev.some(c => c.otherUsername === username)) return prev
                                                        return [{ id: Date.now(), otherUsername: username, updatedAt: new Date().toISOString() }, ...prev]
                                                    })
                                                }
                                            } catch { }
                                        }}
                                    />
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            )}
            {!open && (
                <div
                    role="button"
                    aria-label="Messages"
                    tabIndex={0}
                    onClick={() => setOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
                    className="w-[95vw] max-w-[360px] md:w-[360px] h-12 md:h-14 rounded-xl overflow-hidden shadow-lg border bg-background flex items-center px-3 gap-3 cursor-pointer"
                >
                    <Avatar className="h-8 w-8" />
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold leading-tight truncate">Nachrichten</div>
                    </div>
                    {totalUnread ? (
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px]">{totalUnread}</span>
                    ) : null}
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    <SquareArrowOutUpRight className="h-4 w-4 text-muted-foreground" />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
        </div>
    )
}


