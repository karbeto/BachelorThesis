import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TextInputProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  error?: string;
  theme: any;
  styles: any;
  isPassword?: boolean;
  optional?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  iconName,
  error,
  theme,
  styles,
  isPassword = false,
  optional = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <View style={styles.fieldWrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && (
          <Text style={styles.optionalLabel}>опционално</Text>
        )}
      </View>
      
      <View
        style={[
          styles.inputRow,
          isFocused && styles.inputRowFocused,
          error && styles.inputRowError,
        ]}
      >
        <Ionicons
          name={iconName}
          size={18}
          color={error ? theme.colors.error : theme.colors.textSecondary}
          style={{ marginRight: theme.spacing.sm }}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={theme.colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}