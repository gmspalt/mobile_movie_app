import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import CustomButton from '@/components/auth/CustomButton'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system/legacy'
import { supabase } from '@/lib/supabase'
import { decode } from 'base64-arraybuffer'

const Profile = () => {
  const { session, signOut } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', session?.user?.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      console.error('Exception fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library to upload a profile picture.')
      return
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    })

    if (!result.canceled && result.assets[0]) {
      uploadAvatar(result.assets[0].uri)
    }
  }

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true)

      // Create file name
      const fileExt = uri.split('.').pop()
      const fileName = `${session?.user?.id}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64)

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: session?.user?.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })

      if (updateError) {
        throw updateError
      }

      setAvatarUrl(publicUrl)
      Alert.alert('Success', 'Profile picture updated!')
    } catch (error: any) {
      console.log('ERROR:', error)
      Alert.alert('Error', error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <View className="flex-1 px-5 pt-20">
        <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />

        <Text className="text-white text-2xl font-bold text-center mb-2">
          Profile
        </Text>

        {/* Profile Picture */}
        <TouchableOpacity
          onPress={pickImage}
          disabled={uploading}
          className="self-center mt-6 mb-4"
        >
          <View className="relative">
            {loading ? (
              <View className="w-32 h-32 rounded-full bg-[#1A1A2E] items-center justify-center border-2 border-[#2D2D44]">
                <ActivityIndicator color="#6C63FF" />
              </View>
            ) : avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                className="w-32 h-32 rounded-full border-2 border-[#6C63FF]"
              />
            ) : (
              <View className="w-32 h-32 rounded-full bg-[#1A1A2E] items-center justify-center border-2 border-dashed border-[#2D2D44]">
                <Text className="text-[#6C63FF] text-4xl mb-2">+</Text>
                <Text className="text-[#A8B5DB] text-xs text-center px-4">
                  Tap to add{'\n'}profile picture
                </Text>
              </View>
            )}

            {uploading && (
              <View className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 items-center justify-center">
                <ActivityIndicator color="#FFFFFF" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View className="bg-[#0F0D23]/80 p-6 rounded-2xl border border-[#2D2D44] mt-4">
          <View className="mb-6">
            <Text className="text-[#A8B5DB] text-sm mb-2">Email</Text>
            <Text className="text-white text-lg font-semibold">
              {session?.user?.email}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-[#A8B5DB] text-sm mb-2">User ID</Text>
            <Text className="text-white text-xs font-mono">
              {session?.user?.id}
            </Text>
          </View>

          <View className="mt-6">
            <CustomButton
              title="Sign Out"
              onPress={signOut}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    </View>
  )
}

export default Profile