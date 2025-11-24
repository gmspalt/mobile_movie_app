# Image Picker API

Using Expo Image Picker for selecting and uploading images.

---

## Overview

**Package:** `expo-image-picker`
**Documentation:** https://docs.expo.dev/versions/latest/sdk/imagepicker/

Used for selecting profile pictures from the device's photo library.

---

## Installation

```bash
npx expo install expo-image-picker
```

---

## Basic Usage

### 1. Import

```typescript
import * as ImagePicker from 'expo-image-picker'
```

---

### 2. Request Permissions

**Required before accessing photo library:**

```typescript
const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

if (status !== 'granted') {
  Alert.alert('Permission needed', 'Please allow access to your photo library')
  return
}
```

**Permission States:**
- `'granted'` - User allowed access
- `'denied'` - User denied access
- `'undetermined'` - Not yet requested

---

### 3. Launch Image Picker

```typescript
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ['images'],      // Only allow images
  allowsEditing: true,         // Enable crop editor
  aspect: [1, 1],             // Square crop (1:1 ratio)
  quality: 0.5,               // 50% compression
})
```

---

## Configuration Options

### Media Types

```typescript
mediaTypes: ['images']           // Only images
mediaTypes: ['videos']           // Only videos
mediaTypes: ['images', 'videos'] // Both
```

---

### Editing

```typescript
allowsEditing: true   // Enable crop/edit screen
allowsEditing: false  // Direct selection only
```

---

### Aspect Ratio

```typescript
aspect: [1, 1]    // Square (for profile pictures)
aspect: [4, 3]    // Standard photo
aspect: [16, 9]   // Widescreen
aspect: [9, 16]   // Portrait video
```

**Note:** Only applies when `allowsEditing: true`

---

### Quality

```typescript
quality: 0.5   // 50% quality (smaller file size)
quality: 1.0   // 100% quality (original)
quality: 0.8   // 80% quality (good balance)
```

**Compression:**
- Lower quality = smaller file size = faster upload
- Higher quality = larger file size = better image

---

### Other Options

```typescript
{
  allowsMultipleSelection: true,   // Select multiple images
  selectionLimit: 5,               // Max number of images
  exif: true,                      // Include EXIF data
  base64: true,                    // Include base64 string
}
```

---

## Result Object

### Cancelled

```typescript
if (result.canceled) {
  console.log('User cancelled picker')
  return
}
```

### Success

```typescript
if (!result.canceled) {
  const asset = result.assets[0]

  console.log('URI:', asset.uri)
  console.log('Width:', asset.width)
  console.log('Height:', asset.height)
  console.log('Type:', asset.type)
}
```

### Asset Properties

```typescript
interface ImagePickerAsset {
  uri: string;              // Local file URI
  width: number;            // Image width in pixels
  height: number;           // Image height in pixels
  type?: 'image' | 'video';
  fileName?: string;        // Original filename
  fileSize?: number;        // File size in bytes
  base64?: string;          // Base64 encoded string (if requested)
  exif?: object;            // EXIF metadata (if requested)
}
```

---

## Complete Implementation Example

From `/app/(tabs)/profile.tsx`:

```typescript
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { decode } from 'base64-arraybuffer'
import { supabase } from '@/lib/supabase'

const pickImage = async () => {
  // 1. Request permission
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

  if (status !== 'granted') {
    Alert.alert('Permission needed', 'Please allow access...')
    return
  }

  // 2. Launch picker
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  })

  // 3. Handle result
  if (!result.canceled && result.assets[0]) {
    uploadImage(result.assets[0].uri)
  }
}

const uploadImage = async (uri: string) => {
  // 4. Read file
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  })

  // 5. Convert for upload
  const arrayBuffer = decode(base64)

  // 6. Upload to Supabase
  const fileName = `${userId}-${Date.now()}.jpg`

  await supabase.storage
    .from('avatars')
    .upload(fileName, arrayBuffer, {
      contentType: 'image/jpeg',
    })
}
```

---

## Camera Access

### Take Photo with Camera

```typescript
const result = await ImagePicker.launchCameraAsync({
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.5,
})
```

**Permissions:**

```typescript
const { status } = await ImagePicker.requestCameraPermissionsAsync()
```

---

## Platform Differences

### iOS
- Shows native photo picker
- Crop editor is native iOS UI
- Requires `NSPhotoLibraryUsageDescription` in app.json

### Android
- Shows Android photo picker
- Crop editor may vary by device
- Requires permissions in AndroidManifest.xml

### Web
- Opens file input dialog
- Crop editor is web-based
- No permissions needed

---

## Permissions in app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos",
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera"
        }
      ]
    ]
  }
}
```

---

## File System Integration

### Reading Files

After picking an image, you need to read it for upload:

```typescript
import * as FileSystem from 'expo-file-system/legacy'

// Read as base64
const base64 = await FileSystem.readAsStringAsync(uri, {
  encoding: FileSystem.EncodingType.Base64,
})
```

**Why base64?**
- React Native doesn't support direct file blobs
- Base64 can be converted to ArrayBuffer
- ArrayBuffer is what Supabase Storage accepts

---

### Converting for Upload

```typescript
import { decode } from 'base64-arraybuffer'

// Convert base64 string to ArrayBuffer
const arrayBuffer = decode(base64)

// Now can upload to Supabase
await supabase.storage.from('avatars').upload(path, arrayBuffer)
```

---

## Error Handling

```typescript
try {
  const result = await ImagePicker.launchImageLibraryAsync({...})

  if (result.canceled) {
    console.log('User cancelled')
    return
  }

  // Process image

} catch (error) {
  console.error('Image picker error:', error)
  Alert.alert('Error', 'Failed to select image')
}
```

**Common Errors:**
- Permission denied
- Device storage full
- Corrupted image file
- Network error during upload

---

## Best Practices

### 1. Always Request Permission First

```typescript
const { status } = await requestMediaLibraryPermissionsAsync()
if (status !== 'granted') return
```

### 2. Compress Images

```typescript
quality: 0.5  // Reduces file size by ~50%
```

Benefits:
- Faster uploads
- Less storage used
- Better UX on slow connections

### 3. Validate File Size

```typescript
if (asset.fileSize && asset.fileSize > 5_000_000) {
  Alert.alert('Error', 'Image too large (max 5MB)')
  return
}
```

### 4. Show Loading State

```typescript
const [uploading, setUploading] = useState(false)

const handleUpload = async (uri: string) => {
  setUploading(true)
  try {
    await uploadImage(uri)
  } finally {
    setUploading(false)
  }
}
```

### 5. Handle Cancellation

```typescript
if (result.canceled) {
  // User backed out - this is normal
  return
}
```

---

## Testing

### Test Scenarios

1. ✅ Permission granted → Select image
2. ✅ Permission denied → Show error
3. ✅ User cancels → No error
4. ✅ Large image → Compression works
5. ✅ Square crop → Aspect ratio correct
6. ✅ Upload success → Image displays

---

## Troubleshooting

### Image Not Displaying After Upload

**Issue:** URI is local file path, not network URL

**Solution:** Use Supabase public URL:
```typescript
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(fileName)
```

---

### Permission Already Requested

**Issue:** Can't request permission again after denial

**Solution:** Direct user to settings:
```typescript
if (status === 'denied') {
  Alert.alert(
    'Permission Required',
    'Please enable photo library access in Settings',
    [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
  )
}
```

---

### iOS Simulator Issues

**Issue:** Simulator has limited photos

**Solution:**
- Drag images into simulator
- Or use physical device for testing

---

## Resources

- **Expo Image Picker Docs**: https://docs.expo.dev/versions/latest/sdk/imagepicker/
- **Expo File System Docs**: https://docs.expo.dev/versions/latest/sdk/filesystem/
- **Base64 ArrayBuffer**: https://www.npmjs.com/package/base64-arraybuffer
