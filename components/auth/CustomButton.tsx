import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import React from 'react';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

const CustomButton = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}: CustomButtonProps) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      className={`py-4 rounded-lg items-center justify-center mb-3 ${
        isPrimary ? 'bg-[#6C63FF]' : 'bg-transparent border border-[#6C63FF]'
      } ${disabled ? 'opacity-50' : 'opacity-100'}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#6C63FF'} />
      ) : (
        <Text
          className={`text-base font-semibold ${
            isPrimary ? 'text-white' : 'text-[#6C63FF]'
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
