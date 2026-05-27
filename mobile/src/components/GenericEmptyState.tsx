import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface GenericEmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap
  title: string
  subtitle: string
  btnText: string
  onPress: () => void
  styles: any
  theme: any
}

export const GenericEmptyState: React.FC<GenericEmptyStateProps> = ({
  icon,
  title,
  subtitle,
  btnText,
  onPress,
  styles,
  theme,
}) => {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={32} color={theme.colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptySubtitle}>{subtitle}</Text>
      <TouchableOpacity style={styles.emptyBtn} onPress={onPress} activeOpacity={0.85}>
        <Ionicons name="add" size={18} color="#FFFFFF" />
        <Text style={styles.emptyBtnText}>{btnText}</Text>
      </TouchableOpacity>
    </View>
  )
}