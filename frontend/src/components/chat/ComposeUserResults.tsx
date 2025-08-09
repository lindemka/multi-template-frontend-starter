"use client"
import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'

type UserItem = { username: string; name: string }

export default function ComposeUserResults({ query, onPick }: { query: string; onPick: (username: string) => void }) {
    const [items, setItems] = useState<UserItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const controller = new AbortController()
        const run = async () => {
            const q = query.trim()
            if (!q) { setItems([]); return }
            setLoading(true)
            try {
                const res = await fetch(`/api/chat/users/search?q=${encodeURIComponent(q)}`, { signal: controller.signal, credentials: 'include' })
                if (res.ok) {
                    const data = await res.json()
                    setItems(Array.isArray(data) ? data : [])
                } else {
                    setItems([])
                }
            } catch {
                if (!controller.signal.aborted) setItems([])
            } finally {
                if (!controller.signal.aborted) setLoading(false)
            }
        }
        const t = setTimeout(run, 200)
        return () => { clearTimeout(t); controller.abort() }
    }, [query])

    if (!query.trim()) return null
    if (loading && !items.length) return <div className="px-2 py-2 text-xs text-muted-foreground">Searching…</div>
    if (!items.length) return <div className="px-2 py-2 text-xs text-muted-foreground">No users found</div>

    return (
        <div className="space-y-1">
            {items.map((u: UserItem) => (
                <button key={u.username} className="w-full px-2 py-2 hover:bg-accent rounded-md text-left flex items-center gap-2" onClick={() => onPick(u.username)}>
                    <Avatar className="h-7 w-7" />
                    <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{u.name || u.username}</div>
                        <div className="text-[11px] text-muted-foreground truncate">@{u.username}</div>
                    </div>
                </button>
            ))}
        </div>
    )
}


