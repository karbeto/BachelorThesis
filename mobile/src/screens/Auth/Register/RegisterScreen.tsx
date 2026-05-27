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
import { useRegisterLogic } from './logic'
import { CustomInput } from '../../../components/ui/CustomInput'

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
    handleRegister,
    goToLogin,
  } = useRegisterLogic(navigation)

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
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <View style={styles.logoInner} />
          </View>
          <Text style={styles.title}>Креирај акаунт</Text>
          <Text style={styles.subtitle}>Придружи се и пријавувај проблеми</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <CustomInput
            label="Име и презиме"
            iconName="person-outline"
            value={fullName.value}
            onChangeText={fullName.onChange}
            error={fullName.error}
            placeholder="Кристијан Карбевски"
            autoCapitalize="words"
            autoComplete="name"
            theme={theme}
            styles={styles}
          />

          <CustomInput
            label="Е-пошта"
            iconName="mail-outline"
            value={email.value}
            onChangeText={email.onChange}
            error={email.error}
            placeholder="vasiot@email.mk"
            keyboardType="email-address"
            autoComplete="email"
            theme={theme}
            styles={styles}
          />

          <CustomInput
            label="Телефон"
            optional
            iconName="call-outline"
            value={phone.value}
            onChangeText={phone.onChange}
            error={phone.error}
            placeholder="+389 70 000 000"
            keyboardType="phone-pad"
            autoComplete="tel"
            theme={theme}
            styles={styles}
          />

          <CustomInput
            label="Лозинка"
            iconName="lock-closed-outline"
            value={password.value}
            onChangeText={password.onChange}
            error={password.error}
            placeholder="••••••••"
            autoComplete="new-password"
            isPassword={true}
            theme={theme}
            styles={styles}
          />

          <CustomInput
            label="Потврди лозинка"
            iconName="lock-closed-outline"
            value={confirmPassword.value}
            onChangeText={confirmPassword.onChange}
            error={confirmPassword.error}
            placeholder="••••••••"
            autoComplete="new-password"
            isPassword={true}
            theme={theme}
            styles={styles}
          />

          {/* Submit Button */}
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

        {/* Footer Section */}
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