import { View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CustomInput from '@/components/auth/CustomInput';
import CustomButton from '@/components/auth/CustomButton';
import { images } from '@/constants/images';
import { icons } from '@/constants/icons';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      // Error is already handled in AuthContext
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full h-full z-0" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 }}
        >
          {/* Logo */}
          <View className="items-center mb-8">
            <Image source={icons.logo} className="w-16 h-14 mb-4" />
            <Text className="text-white text-3xl font-bold">Welcome</Text>
            <Text className="text-[#A8B5DB] text-base mt-2">
              {isSignUp ? 'Create an account to continue' : 'Sign in to continue'}
            </Text>
          </View>

          {/* Auth Form */}
          <View className="bg-[#0F0D23]/80 p-6 rounded-2xl border border-[#2D2D44]">
            {/* Tab Switcher */}
            <View className="flex-row mb-6">
              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-l-lg ${
                  !isSignUp ? 'bg-[#6C63FF]' : 'bg-[#1A1A2E]'
                }`}
                onPress={() => setIsSignUp(false)}
              >
                <Text className={`font-semibold ${!isSignUp ? 'text-white' : 'text-[#A8B5DB]'}`}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-3 items-center rounded-r-lg ${
                  isSignUp ? 'bg-[#6C63FF]' : 'bg-[#1A1A2E]'
                }`}
                onPress={() => setIsSignUp(true)}
              >
                <Text className={`font-semibold ${isSignUp ? 'text-white' : 'text-[#A8B5DB]'}`}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <CustomInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />

            {/* Submit Button */}
            <CustomButton
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={handleAuth}
              loading={loading}
              disabled={!email || !password}
            />

            {/* Info Text */}
            {isSignUp && (
              <Text className="text-[#A8B5DB] text-xs text-center mt-2">
                You'll receive a verification email after signing up
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
