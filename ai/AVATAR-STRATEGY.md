# Avatar Strategy - Single Source of Truth

## Current State (PROBLEM)
- Multiple avatar fields exist in different places
- Inconsistent avatar display across the application
- Some users see initials while others see photos
- No single source of truth for user avatars

## Solution Architecture

### Database Schema
1. **Primary Avatar Storage**: `user_profile.avatar_url` (VARCHAR 500)
   - This is the SINGLE SOURCE OF TRUTH for user avatars
   - Stores the full URL to the user's avatar image
   - Should be a persistent photo URL (e.g., pravatar.cc), NOT initials-based

2. **Deprecated/Legacy Fields**:
   - `user_profile.avatar` - OLD field, should migrate data to `avatar_url`
   - Any avatar fields in other tables should reference `user_profile.avatar_url`

### Avatar URL Generation Strategy
For consistency, all users get a deterministic photo avatar based on their username:
```
https://i.pravatar.cc/150?img={deterministic_number}
```
Where `deterministic_number` is calculated from username hash (1-70).

### Backend Implementation
1. **UserProfile Entity** (`UserProfile.java`):
   - Map `avatar` field to `avatar_url` column using `@Column(name = "avatar_url")`
   - Always return this URL in API responses

2. **API Endpoints**:
   - `/api/account/me` - Include `avatar` field from `user_profile.avatar_url`
   - `/api/members/{id}` - Include `avatar` field from `user_profile.avatar_url`
   - `/api/chat/*` - Include avatar URLs in message/conversation responses

### Frontend Implementation
1. **Never generate avatars on frontend** - Always use the URL from backend
2. **Components to update**:
   - `nav-user.tsx` - Use `data.avatar` directly
   - `ChatDock.tsx` - Use `meData.avatar` directly
   - `profile-view.tsx` - Use `profile.avatar` directly
   - All other components - Use avatar URL from API response

### Migration Steps
1. ✅ Add `avatar_url` column to database
2. ✅ Populate existing users with deterministic photo URLs
3. 🔄 Update UserProfile entity to map to `avatar_url`
4. 🔄 Ensure all API endpoints return the avatar URL
5. 🔄 Update frontend components to use avatar from API
6. 🔄 Test consistency across all pages

### Testing Checklist
- [ ] Nav user menu shows Sarah Chen's photo
- [ ] Chat dock "Nachrichten" header shows Sarah Chen's photo
- [ ] Profile page shows Sarah Chen's photo
- [ ] Members list shows correct photos for all users
- [ ] Chat messages show correct sender/recipient photos
- [ ] Profile drawer shows correct photos

## Key Principle
**Database is the single source of truth for avatars. Frontend should NEVER generate or calculate avatar URLs.**