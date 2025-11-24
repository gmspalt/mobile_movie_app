# Profile Picture Feature

User profile picture upload and display system.

---

## Overview

Allows users to upload and display profile pictures from their device's photo library.

**Location:** `/app/(tabs)/profile.tsx`

---

## Features

- 📸 Select images from photo library
- ✂️ Square crop editor (1:1 aspect ratio)
- ☁️ Upload to Supabase Storage
- 🔄 Automatic compression (50% quality)
- 💾 Persistent storage (survives app restarts)
- 🔄 Update anytime by tapping existing picture

---

## Data Flow

```
User taps profile picture
    ↓
Request photo library permission
    ↓
Open image picker
    ↓
User selects and crops photo
    ↓
Read file as base64
    ↓
Convert to ArrayBuffer
    ↓
Upload to Supabase Storage (avatars bucket)
    ↓
Get public URL
    ↓
Update profiles table with avatar_url
    ↓
Display uploaded image
```

---

## UI States

### 1. Empty State (No Picture)
```
┌─────────────┐
│   ┌─ ─ ─┐  │
│   │  +  │  │  Dashed border
│   │ Tap │  │  Dark background
│   │ to  │  │  "+ Tap to add profile picture"
│   │ add │  │
│   └─ ─ ─┘  │
└─────────────┘
```

### 2. Loading State (Fetching)
```
┌─────────────┐
│   ┌─────┐   │
│   │  ⟳  │   │  Spinner
│   └─────┘   │
└─────────────┘
```

### 3. With Picture
```
┌─────────────┐
│   ┌─────┐   │
│   │[IMG]│   │  Circular image
│   └─────┘   │  Purple border
│             │  Tappable to change
└─────────────┘
```

### 4. Uploading State
```
┌─────────────┐
│   ┌─────┐   │
│   │[IMG]│   │  Semi-transparent overlay
│   │  ⟳  │   │  with spinner
│   └─────┘   │
└─────────────┘
```

---

## Implementation Details

### 1. Fetch Existing Avatar

```typescript
useEffect(() => {
  if (session) {
    fetchProfile()
  }
}, [session])

const fetchProfile = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', session?.user?.id)
    .single()

  if (data?.avatar_url) {
    setAvatarUrl(data.avatar_url)
  }
}
```

### 2. Image Selection

```typescript
import * as ImagePicker from 'expo-image-picker'

const pickImage = async () => {
  // Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (status !== 'granted') {
    Alert.alert('Permission needed')
    return
  }

  // Open picker with square crop
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],      // Square crop
    quality: 0.5,        // 50% compression
  })

  if (!result.canceled) {
    uploadAvatar(result.assets[0].uri)
  }
}
```

### 3. Upload Process

```typescript
import * as FileSystem from 'expo-file-system/legacy'
import { decode } from 'base64-arraybuffer'

const uploadAvatar = async (uri: string) => {
  // Create unique filename
  const fileExt = uri.split('.').pop()
  const fileName = `${session?.user?.id}-${Date.now()}.${fileExt}`

  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  })

  // Convert to ArrayBuffer (required by Supabase)
  const arrayBuffer = decode(base64)

  // Upload to storage
  const { error } = await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, {
      contentType: 'image/jpeg',
      upsert: false,
    })

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // Update database
  await supabase
    .from('profiles')
    .upsert({
      id: session?.user?.id,
      avatar_url: publicUrl,
      updated_at: new Date().toISOString(),
    })

  setAvatarUrl(publicUrl)
}
```

---

## File Naming Convention

```
{user_id}-{timestamp}.{extension}

Example:
5ab8ac07-667f-4555-8167-f3e8f362d54a-1764006017169.jpg
```

**Benefits:**
- Unique filenames (no collisions)
- Can identify which user uploaded
- Chronological sorting

---

## Storage Details

### Bucket Configuration
- **Bucket name**: `avatars`
- **Public**: Yes
- **Location**: Supabase Storage

### File Processing
1. User selects image
2. Image picker crops to 1:1 aspect ratio
3. Quality reduced to 50% (saves bandwidth and storage)
4. Uploaded as JPEG
5. Public URL generated

### URL Format
```
https://gmmzprdlvtmbkmegscqv.supabase.co/storage/v1/object/public/avatars/{filename}
```

---

## Database Update

After successful upload, the `profiles` table is updated:

```typescript
{
  id: user_id,
  avatar_url: publicUrl,
  updated_at: new Date().toISOString(),
}
```

Using `upsert()` which:
- Updates existing row if found
- Inserts new row if not found

---

## Dependencies

```json
{
  "expo-image-picker": "^version",
  "expo-file-system": "^version",
  "base64-arraybuffer": "^version",
  "@supabase/supabase-js": "^version"
}
```

---

## Permissions

### iOS
Requires photo library access permission:
- Automatically requested on first use
- User can deny (handled gracefully with alert)

### Android
Similar permission handling

---

## Error Handling

### Common Errors

1. **Permission Denied**
   ```typescript
   Alert.alert('Permission needed', 'Please allow access...')
   ```

2. **Upload Failed**
   ```typescript
   Alert.alert('Error', error.message || 'Failed to upload image')
   ```

3. **Database Update Failed**
   - Shows error alert
   - Image uploaded but not linked to profile
   - Can retry by uploading again

---

## Known Issues / Future Enhancements

- ⚠️ Old avatars not deleted when user updates (storage accumulates)
- ⚠️ No image validation (file size, dimensions)
- ⚠️ No avatar deletion option
- 💡 Consider adding image filters/effects
- 💡 Consider adding camera option (not just library)
- 💡 Consider automatic cleanup of old avatars
- 💡 Consider image optimization on server side

---

## Testing

**Test cases:**
1. ✅ Upload first profile picture
2. ✅ Update existing profile picture
3. ✅ Close and reopen app (picture persists)
4. ✅ Sign out and sign in (picture persists)
5. ✅ Deny permission (graceful error)
6. ✅ Cancel image picker (no error)

---

## Security

- ✅ RLS policies protect profile updates
- ✅ Users can only update their own avatar
- ✅ Storage bucket policies allow public read
- ✅ Files stored with user ID in filename for traceability
