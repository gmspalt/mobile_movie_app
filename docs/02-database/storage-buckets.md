# Storage Buckets Configuration

Supabase Storage buckets used in the project.

---

## Bucket: `avatars`

Stores user profile pictures.

### Configuration

```sql
-- Create bucket
insert into storage.buckets (id, name)
  values ('avatars', 'avatars');
```

**Note:** Bucket was manually set to **public** via Supabase Dashboard after creation to allow image display.

### Properties
- **Bucket ID**: `avatars`
- **Public**: Yes (images are publicly accessible)
- **File Types**: Images (JPEG, PNG, etc.)
- **Naming Convention**: `{user_id}-{timestamp}.{extension}`

### Storage Policies

```sql
-- Public read access
create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

-- Anyone can upload
create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');
```

### Usage Example

#### Upload Avatar (from app)

```typescript
import { supabase } from '@/lib/supabase'
import * as FileSystem from 'expo-file-system/legacy'
import { decode } from 'base64-arraybuffer'

// Read file as base64
const base64 = await FileSystem.readAsStringAsync(uri, {
  encoding: FileSystem.EncodingType.Base64,
})

// Convert to ArrayBuffer
const arrayBuffer = decode(base64)

// Upload to storage
const { error } = await supabase.storage
  .from('avatars')
  .upload(filePath, arrayBuffer, {
    contentType: 'image/jpeg',
  })

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('avatars')
  .getPublicUrl(filePath)
```

#### Public URL Format

```
https://gmmzprdlvtmbkmegscqv.supabase.co/storage/v1/object/public/avatars/{filename}
```

Example:
```
https://gmmzprdlvtmbkmegscqv.supabase.co/storage/v1/object/public/avatars/5ab8ac07-667f-4555-8167-f3e8f362d54a-1764006017169.jpg
```

---

## File Management

### Current Files
- Profile pictures are stored with unique filenames
- Format: `{user_id}-{timestamp}.jpg`
- Old avatars are NOT automatically deleted (manual cleanup needed)

### Storage Limits
- Check Supabase dashboard for current storage usage
- Free tier: 1GB storage
- Files are compressed before upload (50% quality)

---

## Important Notes

- ✅ Bucket must be set to **public** for images to display
- ✅ Images are resized/compressed before upload to save space
- ⚠️ Old avatars remain in storage after user updates (consider cleanup strategy)
- ⚠️ No automatic image optimization on server side
