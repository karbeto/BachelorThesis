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
import { useLoginLogic } from './logic'

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    email,
    password,
    loading,
    showPassword,
    setShowPassword,
    handleLogin,
    goToRegister,
  } = useLoginLogic(navigation)

  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

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
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.title}>Граѓански Активизам</Text>
          <Text style={styles.subtitle}>Пријави се во твојот акаунт</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Е-пошта</Text>
            <View style={[
              styles.inputRow,
              emailFocused && styles.inputRowFocused,
              email.error && styles.inputRowError,
            ]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color={email.error ? theme.colors.error : theme.colors.textSecondary}
                style={{ marginRight: theme.spacing.sm }}
              />
              <TextInput
                style={styles.input}
                placeholder="vasiot@email.mk"
                placeholderTextColor={theme.colors.textSecondary}
                value={email.value}
                onChangeText={email.onChange}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>
            {email.error && (
              <Text style={styles.errorText}>{email.error}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={styles.label}>Лозинка</Text>
            <View style={[
              styles.inputRow,
              passwordFocused && styles.inputRowFocused,
              password.error && styles.inputRowError,
            ]}>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={password.error ? theme.colors.error : theme.colors.textSecondary}
                style={{ marginRight: theme.spacing.sm }}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={theme.colors.textSecondary}
                value={password.value}
                onChangeText={password.onChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
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
            </View>
            {password.error && (
              <Text style={styles.errorText}>{password.error}</Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Најави се</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Немаш акаунт?</Text>
          <TouchableOpacity onPress={goToRegister} activeOpacity={0.7}>
            <Text style={styles.footerLink}>Регистрирај се</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}