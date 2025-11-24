import { View, Text, TextInput, TextInputProps } from 'react-native';
import React from 'react';

interface CustomInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'none',
  ...props
}: CustomInputProps) => {
  return (
    <View className="mb-4">
      <Text className="text-white text-base font-semibold mb-2">{label}</Text>
      <TextInput
        className="bg-[#1A1A2E] text-white px-4 py-3 rounded-lg border border-[#2D2D44]"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B6B8C"
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        {...props}
      />
    </View>
  );
};

export default CustomInput;
