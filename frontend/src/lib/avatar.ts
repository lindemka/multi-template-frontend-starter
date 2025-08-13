/**
 * IMPORTANT: Avatars are ALWAYS stored in the database as the single source of truth.
 * The frontend should NEVER generate avatars - it should only display what comes from the backend.
 * This ensures consistency across the entire application.
 */

export function resolveAvatarUrl(avatarUrl?: string | null): string | undefined {
    // Simply return the avatar URL from the backend
    // Never generate avatars on the frontend
    if (!avatarUrl || avatarUrl.trim() === '') {
        // Return undefined to let the Avatar component show its fallback
        return undefined
    }
    return avatarUrl
}


