import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useRegisterLogic } from './logic'

interface FieldProps {
  label: string
  optional?: boolean
  icon: string
  value: string
  onChange: (val: string) => void
  error?: string
  placeholder: string
  keyboardType?: any
  autoCapitalize?: any
  autoComplete?: any
  secureTextEntry?: boolean
  showToggle?: boolean
  onToggle?: () => void
  onFocus?: () => void
  onBlur?: () => void
  focused?: boolean
  theme: any
  styles: any
}

function Field({
  label,
  optional,
  icon,
  value,
  onChange,
  error,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  secureTextEntry = false,
  showToggle,
  onToggle,
  onFocus,
  onBlur,
  focused,
  theme,
  styles,
}: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && (
          <Text style={styles.optionalLabel}>опционално</Text>
        )}
      </View>
      <View style={[
        styles.inputRow,
        focused && styles.inputRowFocused,
        error && styles.inputRowError,
      ]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={error ? theme.colors.error : theme.colors.textSecondary}
          style={{ marginRight: theme.spacing.sm }}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
        />
        {showToggle && (
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={onToggle}
            activeOpacity={0.7}
          >
            <Ionicons
              name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
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

export default function RegisterScreen({ navigation }: any) {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    fullName,
    email,
    phone,
    password,
    confirmPassword,
    loading,
    showPassword,
    showConfirm,
    setShowPassword,
    setShowConfirm,
    handleRegister,
    goToLogin,
  } = useRegisterLogic(navigation)

  const [focused, setFocused] = useState<string | null>(null)
  const onFocus = (name: string) => () => setFocused(name)
  const onBlur = () => setFocused(null)

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.title}>Креирај акаунт</Text>
          <Text style={styles.subtitle}>Придружи се и пријавувај проблеми</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Field
            label="Име и презиме"
            icon="person-outline"
            value={fullName.value}
            onChange={fullName.onChange}
            error={fullName.error}
            placeholder="Кристијан Карбевски"
            autoCapitalize="words"
            autoComplete="name"
            focused={focused === 'name'}
            onFocus={onFocus('name')}
            onBlur={onBlur}
            theme={theme}
            styles={styles}
          />

          <Field
            label="Е-пошта"
            icon="mail-outline"
            value={email.value}
            onChange={email.onChange}
            error={email.error}
            placeholder="vasiot@email.mk"
            keyboardType="email-address"
            autoComplete="email"
            focused={focused === 'email'}
            onFocus={onFocus('email')}
            onBlur={onBlur}
            theme={theme}
            styles={styles}
          />

          <Field
            label="Телефон"
            optional
            icon="call-outline"
            value={phone.value}
            onChange={phone.onChange}
            error={phone.error}
            placeholder="+389 70 000 000"
            keyboardType="phone-pad"
            autoComplete="tel"
            focused={focused === 'phone'}
            onFocus={onFocus('phone')}
            onBlur={onBlur}
            theme={theme}
            styles={styles}
          />

          <Field
            label="Лозинка"
            icon="lock-closed-outline"
            value={password.value}
            onChange={password.onChange}
            error={password.error}
            placeholder="••••••••"
            autoComplete="new-password"
            secureTextEntry={!showPassword}
            showToggle
            onToggle={() => setShowPassword(!showPassword)}
            focused={focused === 'password'}
            onFocus={onFocus('password')}
            onBlur={onBlur}
            theme={theme}
            styles={styles}
          />

          <Field
            label="Потврди лозинка"
            icon="lock-closed-outline"
            value={confirmPassword.value}
            onChange={confirmPassword.onChange}
            error={confirmPassword.error}
            placeholder="••••••••"
            autoComplete="new-password"
            secureTextEntry={!showConfirm}
            showToggle
            onToggle={() => setShowConfirm(!showConfirm)}
            focused={focused === 'confirm'}
            onFocus={onFocus('confirm')}
            onBlur={onBlur}
            theme={theme}
            styles={styles}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Регистрирај се</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Веќе имаш профил?</Text>
          <TouchableOpacity onPress={goToLogin} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Најави се</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}