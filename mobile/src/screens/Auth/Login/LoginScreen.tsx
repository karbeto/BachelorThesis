import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useLoginLogic } from './logic'
import { CustomInput } from '../../../components/ui/CustomInput' // Adjust path as needed

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    email,
    password,
    loading,
    handleLogin,
    goToRegister,
  } = useLoginLogic(navigation)

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
        {/* Logo Section */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.title}>Граѓански Активизам</Text>
          <Text style={styles.subtitle}>Пријави се во твојот акаунт</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <CustomInput
            label="Е-пошта"
            iconName="mail-outline"
            placeholder="vasiot@email.mk"
            value={email.value}
            onChangeText={email.onChange}
            error={email.error}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            theme={theme}
            styles={styles}
          />

          <CustomInput
            label="Лозинка"
            iconName="lock-closed-outline"
            placeholder="••••••••"
            value={password.value}
            onChangeText={password.onChange}
            error={password.error}
            autoComplete="password"
            isPassword={true}
            theme={theme}
            styles={styles}
          />

          {/* Submit Button */}
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

        {/* Footer Section */}
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