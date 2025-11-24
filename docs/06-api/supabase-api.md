# Supabase API Usage Patterns

Common patterns for interacting with Supabase in the app.

---

## Client Instance

The Supabase client is initialized once and exported from `/lib/supabase.ts`:

```typescript
import { supabase } from '@/lib/supabase'
```

---

## Query Patterns

### 1. Select All Records

```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
```

**Returns:** Array of all events

---

### 2. Select with Filters

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('avatar_url')
  .eq('id', userId)
  .single()
```

**Filters:**
- `.eq('column', value)` - Equals
- `.neq('column', value)` - Not equals
- `.gt('column', value)` - Greater than
- `.gte('column', value)` - Greater than or equal
- `.lt('column', value)` - Less than
- `.lte('column', value)` - Less than or equal
- `.like('column', pattern)` - Pattern matching
- `.in('column', [values])` - In array

---

### 3. Select with Order

```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('date_time', { ascending: true })
```

---

### 4. Select Single Record

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()  // Returns object instead of array
```

---

## Insert Patterns

### 1. Insert Single Record

```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: 'New Event',
    date_time: '2025-11-20 20:00:00+00',
    location: 'Venue Name',
    latitude: 40.7308,
    longitude: -73.9973,
    user_id: userId
  })
```

---

### 2. Insert Multiple Records

```typescript
const { data, error } = await supabase
  .from('events')
  .insert([
    { title: 'Event 1', ... },
    { title: 'Event 2', ... },
  ])
```

---

## Update Patterns

### 1. Update with Filter

```typescript
const { data, error } = await supabase
  .from('profiles')
  .update({ avatar_url: newUrl })
  .eq('id', userId)
```

---

### 2. Upsert (Insert or Update)

```typescript
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    avatar_url: newUrl,
    updated_at: new Date().toISOString(),
  })
```

**Behavior:**
- If record with `id` exists → Update
- If record doesn't exist → Insert

---

## Delete Patterns

```typescript
const { data, error } = await supabase
  .from('events')
  .delete()
  .eq('id', eventId)
```

---

## Storage Patterns

### 1. Upload File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filePath, fileData, {
    contentType: 'image/jpeg',
    upsert: false,  // Fail if file exists
  })
```

---

### 2. Get Public URL

```typescript
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath)
```

**Note:** No `await` needed - returns URL immediately

---

### 3. Download File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .download(filePath)
```

---

### 4. Delete File

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .remove([filePath])
```

**Note:** Takes an array of file paths

---

### 5. List Files

```typescript
const { data, error } = await supabase.storage
  .from('avatars')
  .list()
```

---

## Authentication Patterns

### 1. Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
})
```

---

### 2. Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
})
```

---

### 3. Sign Out

```typescript
const { error } = await supabase.auth.signOut()
```

---

### 4. Get Session

```typescript
const { data: { session } } = await supabase.auth.getSession()
```

---

### 5. Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser()
```

---

### 6. Listen for Auth Changes

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    console.log('Auth event:', event)
    console.log('Session:', session)
  }
)

// Cleanup
subscription.unsubscribe()
```

**Events:**
- `SIGNED_IN`
- `SIGNED_OUT`
- `TOKEN_REFRESHED`
- `USER_UPDATED`

---

## Error Handling

All Supabase methods return `{ data, error }`:

```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  // Handle error
} else {
  console.log('Data:', data)
  // Use data
}
```

**Common Error Properties:**
- `error.message` - Human-readable error
- `error.code` - Error code
- `error.details` - Additional details

---

## TypeScript Types

### Typed Queries

```typescript
import { Event } from '@/types/event'

const { data, error } = await supabase
  .from('events')
  .select('*')
  .returns<Event[]>()
```

---

### Generate Types from Database

```bash
npx supabase gen types typescript --project-id "gmmzprdlvtmbkmegscqv" > types/database.ts
```

This generates TypeScript types from your Supabase schema.

---

## Real-time Subscriptions

### Listen to Table Changes

```typescript
const channel = supabase
  .channel('events-changes')
  .on(
    'postgres_changes',
    {
      event: '*',        // INSERT, UPDATE, DELETE, or '*'
      schema: 'public',
      table: 'events',
    },
    (payload) => {
      console.log('Change detected:', payload)
    }
  )
  .subscribe()

// Cleanup
channel.unsubscribe()
```

---

## Performance Tips

### 1. Select Only Needed Columns

```typescript
// Bad - Gets all columns
.select('*')

// Good - Gets only needed columns
.select('id, title, date_time')
```

---

### 2. Use Indexes

Create indexes on frequently queried columns:

```sql
CREATE INDEX events_date_time_idx ON events(date_time);
CREATE INDEX profiles_user_id_idx ON profiles(user_id);
```

---

### 3. Limit Results

```typescript
const { data } = await supabase
  .from('events')
  .select('*')
  .limit(10)
```

---

### 4. Use Pagination

```typescript
const pageSize = 20
const page = 1

const { data } = await supabase
  .from('events')
  .select('*')
  .range((page - 1) * pageSize, page * pageSize - 1)
```

---

## Security - Row Level Security (RLS)

All queries automatically respect RLS policies.

**Authenticated user ID:**
```sql
auth.uid()  -- Returns current user's ID
```

**Example policy:**
```sql
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

This means:
```typescript
// User can only update their own profile
await supabase
  .from('profiles')
  .update({ avatar_url: newUrl })
  .eq('id', auth.uid())  // RLS enforces this automatically
```

---

## Common Patterns in This App

### Pattern 1: Fetch and Display

```typescript
// In component
useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')

  if (data) setEvents(data)
}
```

---

### Pattern 2: Using Custom Hook

```typescript
// Using useFetch hook
const { data: events, loading, error } = useFetch(fetchEvents)

// Where fetchEvents is:
export async function fetchEvents() {
  const { data } = await supabase.from('events').select('*')
  return data
}
```

---

### Pattern 3: Protected Update

```typescript
const updateProfile = async () => {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: session?.user?.id,  // Only current user
      avatar_url: newUrl,
    })
}
```

---

## Debugging

### Enable Logging

```typescript
// In lib/supabase.ts
export const supabase = createClient(url, key, {
  auth: { ... },
  global: {
    headers: { 'x-my-custom-header': 'my-value' },
  },
  // Enable logging
  db: {
    schema: 'public',
  },
})
```

### Check Network Tab

- Open React Native Debugger
- Check network requests to Supabase
- Look for failed requests

---

## Resources

- **Supabase JS Docs**: https://supabase.com/docs/reference/javascript
- **Database Functions**: https://supabase.com/docs/guides/database/functions
- **Storage Guide**: https://supabase.com/docs/guides/storage
