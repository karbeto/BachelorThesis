import React, { useState } from 'react'
import { View, Text, TextInput, TextInputProps } from 'react-native'

interface FormInputProps extends TextInputProps {
  label: string
  fieldState: {
    value: string
    onChange: (text: string) => void
    error?: string
  }
  styles: any
  theme: any
  isTextArea?: boolean
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  fieldState,
  styles,
  theme,
  isTextArea = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          isTextArea && styles.textAreaWrap,
          isFocused && styles.inputRowFocused,
          fieldState.error && styles.inputRowError,
        ]}
      >
        <TextInput
          style={[styles.input, isTextArea && styles.textArea]}
          value={fieldState.value}
          onChangeText={fieldState.onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={theme.colors.textSecondary}
          {...rest}
        />
      </View>
      {fieldState.error && <Text style={styles.errorText}>{fieldState.error}</Text>}
    </View>
  )
}