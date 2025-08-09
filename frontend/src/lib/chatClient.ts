import { Client, IMessage, StompConfig } from '@stomp/stompjs'

let client: Client | null = null

export function getChatClient() {
    return client
}

export async function connectChat(onMessage: (msg: unknown) => void) {
    if (client && client.active) return client

    let token: string | null = null
    try {
        const res = await fetch('/api/chat/ws-ticket', { credentials: 'include' })
        if (!res.ok) {
            return null
        }
        const data = await res.json().catch(() => null)
        token = data?.token ?? null
    } catch {
        return null
    }
    if (!token) return null

    // Determine backend WS URL (supports reverse proxies and production)
    const backend = process.env.NEXT_PUBLIC_BACKEND_WS_ORIGIN || process.env.BACKEND_ORIGIN || 'http://localhost:8080'
    const wsUrl = backend.replace(/^http/, 'ws') + '/ws'

    client = new Client({
        brokerURL: wsUrl,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 1000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
            client!.subscribe('/user/queue/messages', (message: IMessage) => {
                try {
                    onMessage(JSON.parse(message.body))
                } catch {
                    onMessage(message.body)
                }
            })
            // Also receive acks of our own sent messages so we can show them immediately
            client!.subscribe('/user/queue/ack', (message: IMessage) => {
                try {
                    // Signal to the UI that a WS send was acknowledged by the server
                    ; (window as any).__wsSent = true
                    // Reset shortly after to avoid leaking state across sends
                    setTimeout(() => { try { delete (window as any).__wsSent } catch { /* noop */ } }, 250)
                } catch { /* noop */ }
                try {
                    onMessage(JSON.parse(message.body))
                } catch {
                    onMessage(message.body)
                }
            })
        },
    } as StompConfig)

    client.activate()
    return client
}

export async function sendChat(toUsername: string, content: string): Promise<any | null> {
    // Prefer websocket if connected
    if (client && client.connected) {
        client.publish({ destination: `/app/chat.send/${toUsername}`, body: JSON.stringify({ content }) })
        return null
    }
    // Fallback to REST BFF so messages persist even if WS is not connected
    try {
        const res = await fetch('/api/chat/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ to: toUsername, content }),
        })
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}


