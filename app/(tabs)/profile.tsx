import { View, Text, Image } from 'react-native'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import CustomButton from '@/components/auth/CustomButton'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'

const Profile = () => {
  const { session, signOut } = useAuth()

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <View className="flex-1 px-5 pt-20">
        <Image source={icons.logo} className="w-12 h-10 mb-5 mx-auto" />

        <Text className="text-white text-2xl font-bold text-center mb-2">
          Profile
        </Text>

        <View className="bg-[#0F0D23]/80 p-6 rounded-2xl border border-[#2D2D44] mt-8">
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