export function isLikelyInitialsAvatar(url?: string | null): boolean {
    if (!url) return true
    const u = url.trim().toLowerCase()
    if (!u) return true
    // Common generators that render initials, not photos
    return u.includes('ui-avatars.com') || u.includes('gravatar.com/avatar?d=identicon')
}

export function deterministicPhotoUrl(seedRaw?: string | null): string | undefined {
    // Normalize so "Alex Johnson" and "alex.johnson" map to the same stable seed
    const seed = (seedRaw || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')
    if (!seed) return undefined
    const total = 70
    const hash = Array.from(seed).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7)
    const idx = (hash % total) + 1
    return `https://i.pravatar.cc/150?img=${idx}`
}

export function resolveAvatarUrl(primaryUrl?: string | null, seed?: string | null): string | undefined {
    if (primaryUrl && !isLikelyInitialsAvatar(primaryUrl)) return primaryUrl
    return deterministicPhotoUrl(seed)
}


