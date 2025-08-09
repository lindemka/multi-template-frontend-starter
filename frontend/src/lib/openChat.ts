export function openChatWith(username: string) {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('open-chat', { detail: { username } }))
}

export async function resolveUsernameForProfileId(profileId: number): Promise<string | null> {
    try {
        const res = await fetch(`/api/members/${profileId}/username`)
        if (!res.ok) return null
        const data = await res.json()
        return data?.username || null
    } catch {
        return null
    }
}


