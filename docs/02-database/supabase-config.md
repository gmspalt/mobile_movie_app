# Supabase Configuration

Connection details and setup for the Supabase backend.

---

## Project Details

- **Project URL**: `https://gmmzprdlvtmbkmegscqv.supabase.co`
- **Project ID**: `gmmzprdlvtmbkmegscqv`
- **Region**: Auto (closest to user)

---

## Authentication Configuration

### Providers Enabled
- ✅ Email/Password authentication

### Email Settings
- Email confirmation: Enabled (users receive verification email)
- Password requirements: Default Supabase settings

---

## Client Configuration

Location: `/lib/supabase.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gmmzprdlvtmbkmegscqv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdtbXpwcmRsdnRtYmttZWdzY3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NzQyNDUsImV4cCI6MjA3OTA1MDI0NX0.xCvahAlh_HRicWlQrhxrwIVd3pUqhSjvMgDkRu1GMFE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `storage` | AsyncStorage | Persists auth session locally |
| `autoRefreshToken` | true | Automatically refreshes expired tokens |
| `persistSession` | true | Keeps user logged in across app restarts |
| `detectSessionInUrl` | false | Disabled for mobile (web feature) |

---

## Security Keys

### Anon Key (Public)
- Safe to expose in client-side code
- Used for all authenticated requests
- RLS policies protect data access

### Service Role Key (Private)
- **DO NOT** include in client-side code
- Only for server-side operations
- Bypasses RLS policies

---

## Database Access

### Direct SQL Access
- Available in Supabase Dashboard → SQL Editor
- Use for schema changes, data seeding, debugging

### Via Client (from app)

```typescript
// Query example
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('date_time', { ascending: true })

// Insert example
const { error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    avatar_url: newAvatarUrl,
    updated_at: new Date().toISOString(),
  })
```

---

## Storage Access

### From App

```typescript
// Upload
await supabase.storage
  .from('avatars')
  .upload(filePath, fileData)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath)
```

---

## Important Notes

- ⚠️ **Anon key is hardcoded** - Consider moving to environment variables
- ✅ RLS policies protect all tables
- ✅ Storage buckets have proper access policies
- 📝 Check Supabase dashboard for usage limits (free tier)
