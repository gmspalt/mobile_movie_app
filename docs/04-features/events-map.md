# Events Map Feature

Interactive map displaying events from the database.

---

## Overview

The events map is the **primary feature** of the app, displayed on the Home tab after authentication.

**Location:** `/app/(tabs)/index.tsx`

---

## Features

- 📍 Interactive map with pan and zoom
- 📌 Purple markers for each event location
- 💬 Tap markers to see event details
- 📊 Automatic centering on average event location
- 🔄 Real-time data from Supabase
- 📱 Shows user's current location

---

## Data Flow

```
App Launch
    ↓
Load events from Supabase
    ↓
Calculate map center point
    ↓
Render MapView with markers
    ↓
User taps marker
    ↓
Show Callout with event details
```

---

## Database Query

```typescript
// From /services/eventsApi.ts
export async function fetchEvents(): Promise<Event[] | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date_time', { ascending: true });

  return data;
}
```

---

## Event Data Structure

```typescript
interface Event {
  id: string;
  title: string;
  date_time: string;        // ISO 8601 format
  location: string;         // Address/place name
  latitude: number;         // GPS coordinate
  longitude: number;        // GPS coordinate
  created_at: string;
  user_id: string | null;
}
```

---

## Map Configuration

### Initial Region

```typescript
const getMapRegion = () => {
  if (events.length === 0) {
    // Default to NYC
    return {
      latitude: 40.7128,
      longitude: -74.0060,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }
  }

  // Calculate average position of all events
  const avgLat = events.reduce((sum, event) =>
    sum + Number(event.latitude), 0) / events.length
  const avgLng = events.reduce((sum, event) =>
    sum + Number(event.longitude), 0) / events.length

  return {
    latitude: avgLat,
    longitude: avgLng,
    latitudeDelta: 0.5,  // Zoom level (lower = more zoomed in)
    longitudeDelta: 0.5,
  }
}
```

### Map Properties

```typescript
<MapView
  provider={PROVIDER_DEFAULT}
  initialRegion={getMapRegion()}
  showsUserLocation={true}      // Blue dot for user
  showsMyLocationButton={true}  // Zoom to user location
>
```

---

## Markers

### Marker Display

```typescript
{events.map((event) => (
  <Marker
    key={event.id}
    coordinate={{
      latitude: Number(event.latitude),
      longitude: Number(event.longitude),
    }}
    pinColor="#6C63FF"  // Purple markers
  >
```

### Callout (Info Popup)

```typescript
<Callout>
  <View>
    <Text style={styles.calloutTitle}>{event.title}</Text>
    <Text style={styles.calloutDate}>
      {formatDateTime(event.date_time)}
    </Text>
    <Text style={styles.calloutLocation}>{event.location}</Text>
  </View>
</Callout>
```

---

## Date Formatting

```typescript
const formatDateTime = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  return date.toLocaleString('en-US', {
    month: 'short',    // "Nov"
    day: 'numeric',    // "20"
    hour: 'numeric',   // "8"
    minute: '2-digit', // "00"
  })
}
// Example output: "Nov 20, 8:00 PM"
```

---

## Loading States

```typescript
// While fetching events
if (loading) {
  return (
    <View className="flex-1 bg-primary justify-center items-center">
      <ActivityIndicator size="large" color="#6C63FF" />
      <Text className="text-white mt-4">Loading events...</Text>
    </View>
  )
}

// If fetch failed
if (error) {
  return (
    <View className="flex-1 bg-primary justify-center items-center px-5">
      <Text className="text-white text-lg">{error}</Text>
    </View>
  )
}
```

---

## UI Layout

```
┌─────────────────────────────────┐
│         [Logo]                  │
│      Events Map                 │
│     4 events nearby             │
├─────────────────────────────────┤
│                                 │
│   ┌────────────────────┐       │
│   │                    │       │
│   │   📍 Map View     │       │
│   │   with markers    │       │
│   │                    │       │
│   │                    │       │
│   └────────────────────┘       │
│                                 │
└─────────────────────────────────┘
      [Tab Navigation]
```

---

## Dependencies

- `react-native-maps` - Map component
- `@/services/eventsApi` - Data fetching
- `@/types/event` - TypeScript definitions

---

## Adding New Events

Currently events are added manually via Supabase Dashboard or SQL:

```sql
insert into events (title, date_time, location, latitude, longitude, user_id)
values (
  'Event Name',
  '2025-11-20 20:00:00+00',
  'Venue Name, City',
  40.7308,
  -73.9973,
  auth.uid()
);
```

**Future Enhancement:** Add event creation form in the app.

---

## Getting Coordinates

To add events with correct map positioning:

1. Go to Google Maps
2. Right-click on the location
3. Click the coordinates (they copy automatically)
4. First number = latitude, second = longitude

Example: `40.7308, -73.9973`

---

## Known Issues / Future Enhancements

- ⚠️ No event filtering (date, category, etc.)
- ⚠️ No search within map
- ⚠️ No clustering for nearby events
- 💡 Consider adding event creation UI
- 💡 Consider adding event details screen (tap to see full info)
- 💡 Consider adding directions/navigation
