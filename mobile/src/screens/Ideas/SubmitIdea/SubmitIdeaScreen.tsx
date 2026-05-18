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
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import { useTheme } from '../../../context/ThemeContext'
import { useSubmitIdeaLogic } from './logic'
import { Theme } from '../../../constants/theme'

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: 56,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
    },
    infoCard: {
      backgroundColor: theme.colors.accent + '15',
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'flex-start',
    },
    infoText: {
      ...theme.typography.caption,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 20,
    },
    fieldWrap: {
      gap: theme.spacing.xs,
    },
    label: {
      ...theme.typography.small,
      fontWeight: '500',
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      paddingHorizontal: theme.spacing.md,
      height: 52,
    },
    inputRowFocused: {
      borderColor: theme.colors.accent,
    },
    inputRowError: {
      borderColor: theme.colors.error,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: 0,
    },
    textAreaWrap: {
      height: 120,
      alignItems: 'flex-start',
      paddingTop: theme.spacing.sm,
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top',
    },
    errorText: {
      ...theme.typography.small,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
    },
    submitBtn: {
      height: 52,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
      ...theme.shadows.medium,
    },
    submitBtnDisabled: {
      opacity: 0.7,
    },
    submitBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  })

export default function SubmitIdeaScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    title,
    description,
    titleFocused,
    setTitleFocused,
    descFocused,
    setDescFocused,
    handleSubmit,
    isSubmitting,
    goBack,
  } = useSubmitIdeaLogic()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Нова идеја</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Info banner */}
        <View style={styles.infoCard}>
          <Ionicons name="bulb" size={18} color={theme.colors.accent} />
          <Text style={styles.infoText}>
            Предложете подобрување за вашето маало. Другите граѓани можат да гласаат за вашата идеја и општината ќе ги земе предвид најпопуларните предлози.
          </Text>
        </View>

        {/* Title */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Наслов *</Text>
          <View style={[
            styles.inputRow,
            titleFocused && styles.inputRowFocused,
            title.error && styles.inputRowError,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="пр. Лулашки во паркот на плоштадот"
              placeholderTextColor={theme.colors.textSecondary}
              value={title.value}
              onChangeText={title.onChange}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              maxLength={255}
            />
          </View>
          {title.error && (
            <Text style={styles.errorText}>{title.error}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Опис *</Text>
          <View style={[
            styles.inputRow,
            styles.textAreaWrap,
            descFocused && styles.inputRowFocused,
            description.error && styles.inputRowError,
          ]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Опишете ја вашата идеја подетално..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description.value}
              onChangeText={description.onChange}
              onFocus={() => setDescFocused(true)}
              onBlur={() => setDescFocused(false)}
              multiline
              numberOfLines={5}
              maxLength={2000}
            />
          </View>
          {description.error && (
            <Text style={styles.errorText}>{description.error}</Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Поднеси идеја</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}