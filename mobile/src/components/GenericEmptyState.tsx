import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

interface GenericEmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
  btnText?: string 
  onPress?: () => void
  style?: any
  theme: any 
}

export const GenericEmptyState: React.FC<GenericEmptyStateProps> = ({
  icon,
  title,
  subtitle,
  btnText,
  onPress,
  theme,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    iconWrapper: {
      width: 72,
      height: 72,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant || theme.colors.border + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: theme.spacing.lg,
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      gap: theme.spacing.xs,
      ...theme.shadows?.small,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  })

  return (
    <View style={styles.container}>
      {/* Centered Large Visual Icon Frame */}
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={36} color={theme.colors.accent} />
      </View>

      {/* Typography Hierarchy */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Action Trigger Component (Rendered conditionally) */}
      {btnText && onPress && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) 
            onPress()
          }} 
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>{btnText}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}