# Authentication System Overview

Complete authentication architecture using Supabase Auth.

---

## Architecture

```
┌─────────────────┐
│   App Starts    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthProvider   │ ← Wraps entire app
│   (Context)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Session   │ ← Load from AsyncStorage
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ Found │ │ None  │
└───┬───┘ └───┬───┘
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│ Tabs  │ │ Auth  │
│Screen │ │Screen │
└───────┘ └───────┘
```

---

## Key Components

### 1. AuthContext (`/contexts/AuthContext.tsx`)

Manages global authentication state and provides auth functions.

```typescript
interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

**Responsibilities:**
- Check for existing session on app launch
- Listen for auth state changes
- Provide sign in/up/out functions
- Manage loading states

### 2. Root Layout (`/app/_layout.tsx`)

Controls navigation based on auth state.

```typescript
function RootLayoutNav() {
  const { session, loading } = useAuth()

  // Redirect logic:
  // - If loading: Show spinner
  // - If no session: Show /auth
  // - If session exists: Show /(tabs)
}
```

### 3. Auth Screen (`/app/auth.tsx`)

Sign in/sign up UI with tab switcher.

**Features:**
- Toggle between sign in and sign up modes
- Email and password inputs
- Form validation
- Loading states
- Error alerts

---

## Authentication Flow

### Sign Up Flow

```
1. User enters email + password
2. Tap "Sign Up"
3. Call supabase.auth.signUp()
4. If successful:
   - Supabase sends verification email
   - Profile row created (via trigger)
   - User sees "Check inbox" alert
5. User clicks email verification link
6. Account activated
7. User can now sign in
```

### Sign In Flow

```
1. User enters email + password
2. Tap "Sign In"
3. Call supabase.auth.signInWithPassword()
4. If successful:
   - Session stored in AsyncStorage
   - AuthContext updates session state
   - Root layout detects session
   - Auto-redirect to /(tabs)
```

### Sign Out Flow

```
1. User taps "Sign Out" (in Profile tab)
2. Call supabase.auth.signOut()
3. Session cleared from AsyncStorage
4. AuthContext updates session to null
5. Root layout detects no session
6. Auto-redirect to /auth
```

---

## Session Management

### Persistence
- Sessions stored in **AsyncStorage** (React Native's local storage)
- Survives app restarts
- Automatically refreshed when expired

### Token Refresh
- `autoRefreshToken: true` in Supabase config
- Tokens refreshed automatically before expiration
- User stays logged in seamlessly

### Session Structure

```typescript
{
  access_token: string,
  refresh_token: string,
  expires_at: number,
  user: {
    id: string,
    email: string,
    ...
  }
}
```

---

## Protected Routes

All tabs require authentication:
- Home (Events Map)
- Search
- Saved (Movies)
- Profile

**Implementation:**
- Root layout checks `session` before rendering tabs
- No session → Redirect to `/auth`
- Session exists → Allow access to tabs

---

## Auth State Listener

```typescript
supabase.auth.onAuthStateChange((_event, session) => {
  setSession(session)
})
```

**Events tracked:**
- `SIGNED_IN` - User logged in
- `SIGNED_OUT` - User logged out
- `TOKEN_REFRESHED` - Token auto-refreshed
- `USER_UPDATED` - User profile updated

---

## Security Features

- ✅ Passwords hashed by Supabase (never stored in plaintext)
- ✅ Sessions use JWT tokens
- ✅ Auto token refresh prevents session expiration
- ✅ RLS policies protect user data
- ✅ Email verification required (configurable)

---

## Error Handling

Common errors and handling:
- **Invalid credentials**: Show alert to user
- **Network error**: Show generic error message
- **Email already exists**: Alert user to use sign in
- **Weak password**: Show validation error

All handled in `AuthContext` with `Alert.alert()`.

---

## Files Involved

```
/lib/supabase.ts              # Supabase client config
/contexts/AuthContext.tsx     # Auth state management
/app/_layout.tsx              # Navigation/routing logic
/app/auth.tsx                 # Sign in/up UI
/app/(tabs)/profile.tsx       # Sign out button
/components/auth/CustomInput.tsx   # Input component
/components/auth/CustomButton.tsx  # Button component
```
