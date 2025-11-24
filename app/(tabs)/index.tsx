import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps'
import { fetchEvents } from '@/services/eventsApi'
import { Event } from '@/types/event'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

export default function Index() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    const data = await fetchEvents()

    if (data) {
      setEvents(data)
      setError(null)
    } else {
      setError('Failed to load events')
    }

    setLoading(false)
  }

  // Calculate the center point of all events for initial map region
  const getMapRegion = () => {
    if (events.length === 0) {
      // Default to NYC if no events
      return {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      }
    }

    const avgLat = events.reduce((sum, event) => sum + Number(event.latitude), 0) / events.length
    const avgLng = events.reduce((sum, event) => sum + Number(event.longitude), 0) / events.length

    return {
      latitude: avgLat,
      longitude: avgLng,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <View className="flex-1 bg-primary justify-center items-center">
        <Image source={images.bg} className="absolute w-full h-full z-0" />
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text className="text-white mt-4">Loading events...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 bg-primary justify-center items-center px-5">
        <Image source={images.bg} className="absolute w-full h-full z-0" />
        <Text className="text-white text-lg">{error}</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />

      {/* Header */}
      <View className="px-5 pt-20 pb-4 z-10">
        <Image source={icons.logo} className="w-12 h-10 mb-3 mx-auto" />
        <Text className="text-white text-2xl font-bold text-center">Events Map</Text>
        <Text className="text-[#A8B5DB] text-sm text-center mt-1">
          {events.length} {events.length === 1 ? 'event' : 'events'} nearby
        </Text>
      </View>

      {/* Map */}
      <View className="flex-1 mx-5 mb-24 rounded-2xl overflow-hidden border-2 border-[#2D2D44]">
        <MapView
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          initialRegion={getMapRegion()}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {events.map((event) => (
            <Marker
              key={event.id}
              coordinate={{
                latitude: Number(event.latitude),
                longitude: Number(event.longitude),
              }}
              pinColor="#6C63FF"
            >
              <Callout>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{event.title}</Text>
                  <Text style={styles.calloutDate}>{formatDateTime(event.date_time)}</Text>
                  <Text style={styles.calloutLocation}>{event.location}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 8,
    minWidth: 200,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutDate: {
    fontSize: 14,
    color: '#6C63FF',
    marginBottom: 2,
  },
  calloutLocation: {
    fontSize: 12,
    color: '#666',
  },
})
