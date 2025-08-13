"use client"
import { useEffect, useMemo, useRef, useState } from 'react'
import { connectChat } from '@/lib/chatClient'
import { auth } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { resolveAvatarUrl } from '@/lib/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, ChevronDown, ChevronLeft, MoreHorizontal, SquareArrowOutUpRight, SquarePen, Send } from 'lucide-react'
import ComposeUserResults from './ComposeUserResults'
import ChatWindow from './ChatWindow'
import { chatService, type Message, type Conversation } from '@/lib/chatService'

declare global {
    interface Window { __wsSent?: boolean }
}

export default function ChatDock() {
    const pathname = usePathname()
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [active, setActive] = useState<string | null>(null)
    const [messages, setMessages] = useState<Record<string, Message[]>>({})
    const [filter, setFilter] = useState('')
    const [composeOpen, setComposeOpen] = useState(false)
    const [composeQuery, setComposeQuery] = useState('')
    const [messageInput, setMessageInput] = useState('')
    const initialized = useRef(false)
    const [me, setMe] = useState<{ username: string | null; avatar: string | null }>({ username: null, avatar: null })
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const meRef = useRef<string | null>(null)
    const meAvatarRef = useRef<string | null>(null)
    const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null)
    // Popout windows: one expanded window and an ordered list of minimized chips (max 3)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [minimized, setMinimized] = useState<string[]>([])
    const totalUnread = useMemo(() => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0), [conversations])

    // No generic photo placeholders; rely on real profile avatar when present.

    const initialsFromUsername = (u: string | null | undefined) => {
        if (!u) return 'U'
        const parts = u.split(/[^a-zA-Z0-9]+/).filter(Boolean)
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
        return (parts[0][0] + parts[1][0]).toUpperCase()
    }

    const displayNameFromUsername = (u: string) => {
        if (!u) return 'User'
        const parts = u.split(/[^a-zA-Z0-9]+/).filter(Boolean)
        return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || u
    }

    // Check if mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768) // md breakpoint
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        let checkInterval: NodeJS.Timeout | null = null

        const initializeChat = async () => {
            try {
                // First check if user is authenticated
                const meRes = await fetch('/api/account/me', { credentials: 'include' })
                if (!meRes.ok) {
                    // User is not authenticated - don't initialize chat
                    console.log('ChatDock - User not authenticated, chat disabled')
                    setIsAuthenticated(false)

                    // Set up polling to check for authentication
                    if (!checkInterval) {
                        checkInterval = setInterval(() => {
                            initializeChat()
                        }, 2000)
                    }
                    return
                }

                const meData = await meRes.json()
                if (!meData || meData.error) {
                    // Invalid user data - don't initialize chat
                    console.log('ChatDock - Invalid user data, chat disabled')
                    setIsAuthenticated(false)
                    return
                }

                // User is authenticated - clear polling interval
                if (checkInterval) {
                    clearInterval(checkInterval)
                    checkInterval = null
                }

                // Check if we're already initialized
                if (initialized.current) {
                    setIsAuthenticated(true)
                    return
                }

                // Mark as initialized
                initialized.current = true
                setIsAuthenticated(true)

                // Store the username first - this is critical for fallback
                if (meData?.username) {
                    meRef.current = meData.username
                    console.log('ChatDock - username set to:', meData.username)
                }

                // Use consistent avatar resolution - same as other components
                let avatarUrl = null
                if (meData?.username) {
                    avatarUrl = resolveAvatarUrl(meData.profileAvatar)
                    meAvatarRef.current = avatarUrl
                    console.log('ChatDock - avatar resolved:', avatarUrl)
                }

                // Update state to trigger re-render
                setMe({
                    username: meData?.username || null,
                    avatar: avatarUrl
                })

                // Set auth user for legacy code
                try {
                    const authUser = auth.getUser()
                    if (!authUser && meData?.username) {
                        // If auth is not set, we might need to set it from the backend data
                        // This is a safety measure
                    }
                } catch { }

                // Only proceed with chat initialization if authenticated
                // Restore persisted UI state (LinkedIn-like behavior)
                try {
                    const savedOpen = typeof window !== 'undefined' ? window.localStorage.getItem('chat.open') : null
                    if (savedOpen === '1') setOpen(true)
                    const savedActive = typeof window !== 'undefined' ? window.localStorage.getItem('chat.active') : null
                    if (savedActive) setActive(savedActive)
                } catch { /* noop */ }
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
                const data = await chatService.getConversations()
                setConversations(data)
                // Don't auto-select first conversation - let user see the list first
                // Only auto-select if there was a previously saved active conversation
                const savedActive = typeof window !== 'undefined' ? window.localStorage.getItem('chat.active') : null
                if (data.length && savedActive && data.some(c => c.otherUsername === savedActive)) {
                    setActive(savedActive)
                    await loadThread(savedActive)
                }
            } catch (e) {
                console.error('Chat init failed', e)
                setIsAuthenticated(false)
            }
        }

        // Start initialization
        initializeChat()

        // Cleanup
        return () => {
            if (checkInterval) {
                clearInterval(checkInterval)
            }
        }
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
                            await openWindow(u)
                            return
                        }
                        const conv = await resp.json()
                        setConversations((prev) => {
                            const exists = prev.find((c) => c.otherUsername === u)
                            if (exists) return prev
                            return [{ id: conv.id ?? Date.now(), otherUsername: u, updatedAt: conv.updatedAt ?? new Date().toISOString() }, ...prev]
                        })
                        await openWindow(u)
                    } catch {
                        // As a last resort, allow opening the thread UI; backend will enforce permissions
                        setConversations((prev) => prev.some(c => c.otherUsername === u) ? prev : [{ id: Date.now(), otherUsername: u, updatedAt: new Date().toISOString() }, ...prev])
                        await openWindow(u)
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
                    // Don't auto-select first conversation when polling
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

    const sendTo = async (username: string, content: string) => {
        if (!username || !content.trim()) return
        const me = meRef.current || 'me'
        const optimistic: Message = { id: Date.now(), content: content.trim(), sender: { username: me }, recipient: { username }, createdAt: new Date().toISOString() }
        setMessages((prev) => ({ ...prev, [username]: [...(prev[username] || []), optimistic] }))
        setConversations((prev) => {
            const exists = prev.some((c) => c.otherUsername === username)
            const updatedAt = optimistic.createdAt
            if (exists) return prev.map((c) => c.otherUsername === username ? { ...c, updatedAt } : c)
            return [{ id: Date.now(), otherUsername: username, updatedAt }, ...prev]
        })
        try {
            const res = await chatService.sendMessage(username, content.trim())
            // Don't show error - message will be delivered when connection is restored
            // The optimistic update already shows the message to the user
        } catch (error) {
            // Keep the optimistic message but mark it as pending/failed
            console.error('Failed to send message:', error)
            // You could add a retry mechanism here or mark the message as failed
            // For now, we'll keep the message and try to sync later
        }
        // Add a small delay before loading the thread to ensure the message is saved
        setTimeout(async () => {
            await loadThread(username)
        }, 500)
    }

    const filteredConversations = conversations.filter(c =>
        !filter.trim() || c.otherUsername.toLowerCase().includes(filter.toLowerCase())
    )

    const openWindow = async (username: string) => {
        setOpen(true)
        setExpanded((curr) => {
            if (curr === username) return curr
            if (curr) {
                setMinimized((prev) => {
                    const withoutNew = prev.filter((u) => u !== username && u !== curr)
                    return [curr, ...withoutNew].slice(0, 3)
                })
            }
            return username
        })
        setActive(username)
        await loadThread(username)
    }

    const fetchMessagesWithFallback = async (username: string): Promise<Message[] | null> => {
        return await chatService.fetchMessagesWithFallback(username);
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

    // Don't render anything if user is not authenticated or on mobile messages page
    if (!isAuthenticated || (isMobile && pathname?.startsWith('/dashboard/messages'))) {
        return null
    }

    return (
        <div className="fixed bottom-3 right-3 md:bottom-4 md:right-4 z-50">
            {open && (
                <>
                    <Card className="w-[95vw] max-w-[380px] h-[70vh] max-h-[480px] md:w-[360px] md:h-[560px] p-0 flex flex-col shadow-xl rounded-xl overflow-hidden" data-testid="chat-dock">
                        {/* Header - LinkedIn style */}
                        <div className="flex items-center gap-2 p-3 border-b bg-muted/20 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Avatar className="h-6 w-6">
                                    {me.avatar && (
                                        <AvatarImage src={me.avatar} alt={displayNameFromUsername(me.username || '')} />
                                    )}
                                    <AvatarFallback delayMs={0}>{initialsFromUsername(me.username)}</AvatarFallback>
                                </Avatar>
                                <div className="font-semibold text-base truncate">Nachrichten</div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="New message" onClick={() => { setComposeOpen(true); setComposeQuery('') }}>
                                <SquarePen className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="More options">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Open in full"
                                onClick={() => router.push('/dashboard/messages' + (active ? `?user=${active}` : ''))}
                            >
                                <SquareArrowOutUpRight className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Minimize" onClick={() => setOpen(false)}>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex-1 flex overflow-hidden min-h-0">
                            {/* Always show conversation list in the Nachrichten box */}
                            <div className="flex-1 flex flex-col min-h-0 overflow-hidden" data-testid="chat-conversations">
                                <div className="p-2 flex-shrink-0">
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
                                <Separator className="flex-shrink-0" />
                                <ScrollArea className="flex-1 overflow-hidden" type="hover">
                                    <div className="py-1 px-1">
                                        {filteredConversations.map((c) => (
                                            <button
                                                key={c.id}
                                                className={`w-full px-3 py-2 hover:bg-accent/70 transition text-left rounded-md ${active === c.otherUsername ? 'bg-accent' : ''}`}
                                                onClick={async () => {
                                                    await openWindow(c.otherUsername);
                                                }}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <Avatar className="h-10 w-10 shrink-0">
                                                        {(() => {
                                                            const src = resolveAvatarUrl(c.otherAvatar)
                                                            return src ? (<AvatarImage src={src} alt={c.otherUsername} />) : null
                                                        })()}
                                                        <AvatarFallback delayMs={0}>{initialsFromUsername(c.otherUsername)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className={`truncate ${c.unreadCount ? 'font-semibold' : 'font-medium'}`}>
                                                                {displayNameFromUsername(c.otherUsername)}
                                                                <span className="ml-1 text-xs text-muted-foreground">@{c.otherUsername}</span>
                                                            </div>
                                                            <div className="text-[11px] text-muted-foreground whitespace-nowrap pt-0.5">
                                                                {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="truncate text-sm text-muted-foreground max-w-[200px]">{c.lastMessage || ''}</div>
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
                    <Avatar className="h-8 w-8">
                        {meAvatarRef.current && (
                            <AvatarImage src={meAvatarRef.current} alt={meRef.current || 'Me'} />
                        )}
                        <AvatarFallback delayMs={0}>{initialsFromUsername(meRef.current)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold leading-tight truncate">Nachrichten</div>
                    </div>
                    {totalUnread ? (
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-primary-foreground text-[10px]">{totalUnread}</span>
                    ) : null}
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    <SquareArrowOutUpRight
                        className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={(e) => {
                            e.stopPropagation()
                            router.push('/dashboard/messages')
                        }}
                    />
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
            )}
            {/* Popout windows - hidden on small screens */}
            {/* Minimized chips list to the left of the dock */}
            <div className="hidden md:flex fixed bottom-3 right-[calc(0.75rem+360px+0.75rem)] gap-3 z-50">
                {minimized.map((u) => (
                    <button
                        key={u}
                        className="h-12 w-[220px] rounded-xl shadow-lg border bg-background flex items-center px-3 gap-2"
                        onClick={async () => {
                            // Promote this chip to expanded; demote current expanded to chips
                            const prevExpanded = expanded
                            setExpanded(u)
                            setMinimized((prev) => {
                                const others = prev.filter((x) => x !== u)
                                return prevExpanded ? [prevExpanded, ...others].slice(0, 3) : others
                            })
                            setActive(u)
                            await loadThread(u)
                        }}
                    >
                        <Avatar className="h-8 w-8">
                            {(() => {
                                const conv = conversations.find(c => c.otherUsername === u)
                                const src = resolveAvatarUrl(conv?.otherAvatar)
                                return src ? (<AvatarImage src={src} alt={u} />) : null
                            })()}
                            <AvatarFallback delayMs={0}>{initialsFromUsername(u)}</AvatarFallback>
                        </Avatar>
                        <div className="truncate font-medium">{u}</div>
                    </button>
                ))}
            </div>
            {/* Expanded window sits left of the dock (dock width: 360px) */}
            <div className="hidden md:block fixed bottom-3 right-[calc(0.75rem+360px+0.75rem)] z-50">
                {expanded && (
                    <ChatWindow
                        username={expanded}
                        headerAvatar={(conversations.find(c => c.otherUsername === expanded))?.otherAvatar || null}
                        messages={messages[expanded] || []}
                        me={meRef.current}
                        meAvatar={meAvatarRef.current}
                        onSend={(text) => sendTo(expanded, text)}
                        onClose={() => {
                            // Close expanded and promote the first chip, if any
                            setMinimized((prev) => {
                                const [next, ...rest] = prev
                                if (next) {
                                    setExpanded(next)
                                    setActive(next)
                                } else {
                                    setExpanded(null)
                                    setActive(null)
                                }
                                return rest
                            })
                        }}
                        onMinimize={() => {
                            const toMin = expanded
                            if (!toMin) return
                            setMinimized((prev) => [toMin, ...prev].slice(0, 3))
                            setExpanded(null)
                            setActive(null)
                        }}
                    />
                )}
            </div>
        </div>
    )
}


