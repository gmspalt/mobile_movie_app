# Project Structure

File and folder organization for the mobile_movie_app (events platform).

---

## Root Directory Structure

```
mobile_movie_app/
├── app/                      # Expo Router screens
│   ├── (tabs)/              # Tab navigation screens
│   ├── movies/              # Movie detail screens (legacy)
│   ├── _layout.tsx          # Root layout with auth routing
│   └── auth.tsx             # Sign in/sign up screen
├── assets/                   # Static assets
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/              # Reusable UI components
│   ├── auth/               # Authentication components
│   ├── MovieCard.tsx
│   └── SearchBar.tsx
├── constants/              # App constants
│   ├── icons.ts
│   └── images.ts
├── contexts/               # React Contexts
│   └── AuthContext.tsx    # Global auth state
├── interfaces/            # TypeScript interfaces
│   └── interfaces.d.ts
├── lib/                   # Libraries and configs
│   └── supabase.ts       # Supabase client
├── services/             # API services
│   ├── api.ts           # Movie API
│   ├── eventsApi.ts     # Events API
│   └── useFetch.ts      # Custom hook
├── types/               # TypeScript types
│   ├── event.ts
│   └── images.d.ts
├── 01-setup/           # Documentation
├── 02-database/
├── 03-authentication/
├── 04-features/
├── 05-architecture/
├── 06-api/
├── app.json            # Expo config
├── package.json        # Dependencies
├── tailwind.config.js  # TailwindCSS config
└── tsconfig.json       # TypeScript config
```

---

## Key Directories Explained

### `/app` - Expo Router Screens

Expo Router uses file-based routing. File names become routes.

```
app/
├── (tabs)/              # Groups tabs together
│   ├── _layout.tsx     # Tab navigation config
│   ├── index.tsx       # Home tab (Events Map)
│   ├── search.tsx      # Search tab
│   ├── saved.tsx       # Saved tab (Movies)
│   └── profile.tsx     # Profile tab
├── movies/
│   └── [id].tsx        # Dynamic route: /movies/123
├── _layout.tsx         # Root layout (auth routing)
├── auth.tsx            # Authentication screen
└── globals.css         # Global styles
```

**Route mapping:**
- `/` → `app/(tabs)/index.tsx`
- `/search` → `app/(tabs)/search.tsx`
- `/auth` → `app/auth.tsx`
- `/movies/123` → `app/movies/[id].tsx`

---

### `/components` - Reusable Components

```
components/
├── auth/
│   ├── CustomButton.tsx    # Styled button (primary/secondary)
│   └── CustomInput.tsx     # Styled text input
├── MovieCard.tsx           # Movie grid item
└── SearchBar.tsx           # Search input with icon
```

**Naming convention:** PascalCase for component files

---

### `/contexts` - React Context

Global state management using React Context API.

```
contexts/
└── AuthContext.tsx    # Authentication state
```

**Usage:**
```typescript
const { session, signIn, signOut } = useAuth()
```

---

### `/lib` - External Library Configs

```
lib/
└── supabase.ts    # Supabase client initialization
```

Contains configuration for external services.

---

### `/services` - API Layer

Business logic and data fetching.

```
services/
├── api.ts          # Movie API functions
├── eventsApi.ts    # Events API functions
└── useFetch.ts     # Custom React hook for data fetching
```

**Pattern:**
```typescript
// Service function
export async function fetchEvents() {
  return await supabase.from('events').select('*')
}

// Usage in component
const { data, loading, error } = useFetch(fetchEvents)
```

---

### `/types` - TypeScript Definitions

```
types/
├── event.ts       # Event interface
└── images.d.ts    # Image import types
```

**Example:**
```typescript
export interface Event {
  id: string;
  title: string;
  date_time: string;
  location: string;
  latitude: number;
  longitude: number;
}
```

---

## Import Aliases

Configured in `tsconfig.json`:

```json
{
  "paths": {
    "@/*": ["./*"]
  }
}
```

**Usage:**
```typescript
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { icons } from '@/constants/icons'
```

Benefits:
- Cleaner imports
- No relative path hell (`../../../`)
- Easy refactoring

---

## Styling Approach

### NativeWind (TailwindCSS)

```tsx
<View className="flex-1 bg-primary px-5">
  <Text className="text-white text-2xl font-bold">
    Hello World
  </Text>
</View>
```

### Traditional StyleSheet (where needed)

```tsx
import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  }
})
```

---

## Navigation Structure

```
Auth Flow:
  ├── auth.tsx (Sign in/Sign up)
  └── (Authenticated) → Tabs

Tab Navigation:
  ├── index.tsx      (Home - Events Map)
  ├── search.tsx     (Search Movies)
  ├── saved.tsx      (Saved - Movies List)
  └── profile.tsx    (Profile & Settings)
```

**Implementation:** Expo Router with file-based routing

---

## Data Flow Pattern

```
Component
    ↓ (calls)
Service Function
    ↓ (queries)
Supabase
    ↓ (returns)
Service Function
    ↓ (returns)
Component (updates state)
```

**Example:**
```typescript
// Component
const { data: events } = useFetch(fetchEvents)

// Service
export async function fetchEvents() {
  const { data } = await supabase.from('events').select('*')
  return data
}
```

---

## State Management

### Local State
```typescript
const [loading, setLoading] = useState(false)
```

### Global State (Context)
```typescript
// AuthContext provides:
- session
- loading
- signIn()
- signUp()
- signOut()
```

### Server State
```typescript
// Managed by Supabase + custom hooks
const { data, loading, error } = useFetch(fetchFunction)
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `MovieCard.tsx` |
| Screens | lowercase | `index.tsx`, `profile.tsx` |
| Services | camelCase | `eventsApi.ts` |
| Types | lowercase | `event.ts` |
| Contexts | PascalCase | `AuthContext.tsx` |

---

## Configuration Files

### `app.json`
Expo app configuration (name, slug, version)

### `package.json`
Dependencies and scripts

### `tsconfig.json`
TypeScript compiler options

### `tailwind.config.js`
TailwindCSS/NativeWind theme configuration

---

## Environment Variables

Currently hardcoded in `lib/supabase.ts`:
- Supabase URL
- Supabase Anon Key

**Future:** Move to `.env` file (not committed to git)

---

## Key Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "expo-router": "~6.x",
  "react-native-maps": "^version",
  "expo-image-picker": "^version",
  "nativewind": "^4.x"
}
```

See [dependencies.md](../01-setup/dependencies.md) for full list.

---

## Build/Deploy Structure

```
Development:
  npm start → Expo Dev Server

Production:
  npm run build → Native builds
```

See [getting-started.md](../01-setup/getting-started.md) for details.
