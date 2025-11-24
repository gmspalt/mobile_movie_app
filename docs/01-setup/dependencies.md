# Dependencies

Complete list of project dependencies and their purposes.

---

## Core Dependencies

### React & React Native
```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-dom": "19.1.0"
}
```

**Purpose:** Core framework for building the mobile app

---

### Expo
```json
{
  "expo": "~54.0.23",
  "expo-router": "~6.0.14",
  "expo-constants": "~18.0.10",
  "expo-font": "~14.0.9",
  "expo-linking": "~8.0.8",
  "expo-splash-screen": "~31.0.10",
  "expo-status-bar": "~3.0.8",
  "expo-system-ui": "~6.0.8",
  "expo-web-browser": "~15.0.9"
}
```

**Purpose:** Expo framework and utilities for React Native development

---

## Authentication & Database

### Supabase
```json
{
  "@supabase/supabase-js": "^2.83.0",
  "@react-native-async-storage/async-storage": "2.2.0"
}
```

**Purpose:**
- `supabase-js`: Database and authentication client
- `async-storage`: Local storage for session persistence

**Files using:**
- `/lib/supabase.ts`
- `/contexts/AuthContext.tsx`
- `/services/eventsApi.ts`

---

## Navigation

### React Navigation & Expo Router
```json
{
  "@react-navigation/native": "^7.1.8",
  "@react-navigation/bottom-tabs": "^7.4.0",
  "@react-navigation/elements": "^2.6.3",
  "expo-router": "~6.0.14"
}
```

**Purpose:** File-based routing and tab navigation

**Files using:**
- `/app/_layout.tsx`
- `/app/(tabs)/_layout.tsx`
- All screen files

---

## UI Components & Styling

### NativeWind (TailwindCSS)
```json
{
  "nativewind": "^4.2.1",
  "tailwindcss": "^3.4.18"
}
```

**Purpose:** Utility-first CSS styling for React Native

**Config:** `tailwind.config.js`

---

## Maps

### React Native Maps
```json
{
  "react-native-maps": "latest"
}
```

**Purpose:** Interactive maps with markers

**Files using:**
- `/app/(tabs)/index.tsx` (Events Map)

---

## Image Handling

### Expo Image Picker & File System
```json
{
  "expo-image-picker": "latest",
  "expo-file-system": "latest",
  "base64-arraybuffer": "^version"
}
```

**Purpose:**
- Select images from photo library
- Read files for upload
- Convert base64 to ArrayBuffer

**Files using:**
- `/app/(tabs)/profile.tsx` (Profile picture upload)

---

## Other Expo Modules

### Media & Interactions
```json
{
  "expo-image": "~3.0.10",
  "expo-haptics": "~15.0.7",
  "@expo/vector-icons": "^15.0.3"
}
```

**Purpose:**
- `expo-image`: Optimized image component
- `expo-haptics`: Haptic feedback
- `vector-icons`: Icon library

### Gesture & Animation
```json
{
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1",
  "react-native-worklets": "0.5.1"
}
```

**Purpose:** Smooth animations and gestures

### Safe Areas & Screens
```json
{
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

**Purpose:** Handle device notches and navigation

---

## Development Dependencies

### TypeScript
```json
{
  "typescript": "~5.9.2",
  "@types/react": "~19.1.0",
  "@types/react-native": "^0.72.8"
}
```

**Purpose:** Type safety and better IDE support

**Config:** `tsconfig.json`

### Linting
```json
{
  "eslint": "^9.25.0",
  "eslint-config-expo": "~10.0.0"
}
```

**Purpose:** Code quality and consistency

**Config:** `eslint.config.js`

---

## Polyfills

```json
{
  "react-native-url-polyfill": "^3.0.0",
  "react-native-web": "~0.21.0"
}
```

**Purpose:**
- URL polyfill for Supabase
- Web compatibility layer

---

## Installation Commands

### Install all dependencies
```bash
npm install
```

### Install specific dependency
```bash
npm install <package-name>
```

### Install Expo-compatible version
```bash
npx expo install <package-name>
```

**Always use `npx expo install` for Expo packages** to ensure version compatibility!

---

## Updating Dependencies

### Check for updates
```bash
npx expo-doctor
```

### Update Expo SDK
```bash
npx expo install expo@latest
```

### Update all Expo packages
```bash
npx expo install --fix
```

---

## Version Compatibility

This project uses:
- **Expo SDK**: 54
- **React Native**: 0.81.5
- **React**: 19.1.0

When adding new packages, ensure they're compatible with Expo SDK 54.

---

## Package Scripts

From `package.json`:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  }
}
```

---

## Notes

- Some dependencies have peer dependency warnings (normal for React Native)
- Deprecated warnings for `glob`, `rimraf`, `inflight` (from sub-dependencies, safe to ignore)
- Always run `npm install` after pulling code changes
- Clear cache if having issues: `rm -rf node_modules && npm install`
