# Getting Started

Quick start guide for running the mobile_movie_app project.

---

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

---

## Installation

### 1. Clone the Repository

```bash
cd /Users/georgespalt/Desktop/App_Development
# (Repository already exists locally as mobile_movie_app)
```

### 2. Install Dependencies

```bash
cd mobile_movie_app
npm install
```

### 3. Start Development Server

```bash
npm start
```

This will:
- Start Metro bundler
- Open Expo Dev Tools in browser
- Display QR code for mobile testing

---

## Running on Device/Simulator

### iOS Simulator (Mac only)

```bash
npm run ios
```

### Android Emulator

```bash
npm run android
```

### Physical Device

1. Install **Expo Go** app from App Store or Play Store
2. Scan QR code from terminal
3. App will load on your device

---

## Project Commands

```bash
npm start          # Start dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in web browser (experimental)
npm run lint       # Run ESLint
```

---

## First Run Experience

### 1. App Opens to Authentication Screen

You'll see the sign in/sign up screen because no user is logged in yet.

### 2. Create an Account

- Tap "Sign Up" tab
- Enter email and password
- Tap "Create Account"
- Check your email for verification link (if email confirmation enabled)

### 3. Sign In

- Enter credentials
- Tap "Sign In"
- Redirected to Home tab (Events Map)

### 4. Explore Features

- **Home Tab**: View events on interactive map
- **Search Tab**: Search for movies (legacy feature)
- **Saved Tab**: Browse movie listings
- **Profile Tab**: Upload profile picture, sign out

---

## Development Workflow

### Making Changes

1. Edit code in your IDE (VSCode recommended)
2. Save file
3. App hot-reloads automatically
4. See changes instantly

### TypeScript

- Project uses TypeScript for type safety
- Type errors show in IDE and terminal
- Restart TypeScript server if needed:
  - `Cmd+Shift+P` → "TypeScript: Restart TS Server"

### Styling

- Uses NativeWind (TailwindCSS for React Native)
- Write styles with className prop:
  ```tsx
  <View className="flex-1 bg-primary px-5">
  ```

---

## Common Issues

### Issue: "Metro bundler failed to start"

**Solution:**
```bash
rm -rf .expo
rm -rf node_modules/.cache
npm start --clear
```

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules
npm install
```

### Issue: TypeScript errors after git operations

**Solution:**
1. Close all files in VSCode
2. `Cmd+Shift+P` → "TypeScript: Restart TS Server"
3. `Cmd+Shift+P` → "Developer: Reload Window"

### Issue: Map not displaying

**Solution:**
- Ensure events exist in Supabase database
- Check internet connection
- Verify Supabase config is correct

---

## Environment Setup

### Supabase Configuration

Currently hardcoded in `/lib/supabase.ts`:

```typescript
const supabaseUrl = 'https://gmmzprdlvtmbkmegscqv.supabase.co'
const supabaseAnonKey = 'your-anon-key'
```

**For production:** Move to environment variables

---

## Testing Authentication

### Test User Creation

1. Sign up with any email
2. Password must meet Supabase requirements
3. Verify email (if confirmation enabled)
4. Sign in with credentials

### Test Profile Picture

1. Go to Profile tab
2. Tap profile picture placeholder
3. Grant photo library permission
4. Select and crop image
5. Upload succeeds → Image displays

### Test Events Map

1. Ensure events exist in database
2. Go to Home tab
3. Map loads with purple markers
4. Tap marker to see event details

---

## Project URLs

- **GitHub**: https://github.com/gmspalt/mobile_movie_app
- **Supabase Dashboard**: https://supabase.com/dashboard (Project: gmmzprdlvtmbkmegscqv)

---

## Next Steps

1. ✅ Run the app and explore features
2. ✅ Create a test account
3. ✅ Upload a profile picture
4. ✅ View events on the map
5. 📖 Read documentation in numbered folders (01-06)
6. 🔨 Start building new features!

---

## Getting Help

- Check documentation in project folders (01-06)
- Review code comments
- Check Supabase dashboard for data issues
- Restart dev server if hot reload stops working
