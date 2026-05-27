import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface DataCardProps {
  title: string
  description?: string
  status: string
  statusLabel: string
  statusColors: { bg: string; color: string }
  createdAt: string
  voteCount: number
  isDuplicate?: boolean
  onPress: () => void
  styles: any
  theme: any
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  description,
  status,
  statusLabel,
  statusColors,
  createdAt,
  voteCount,
  isDuplicate,
  onPress,
  styles,
  theme,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
          <Text style={[styles.statusText, { color: statusColors.color }]}>
            {statusLabel}
          </Text>
        </View>
      </View>

      {description ? (
        <Text style={styles.cardDesc} numberOfLines={2}>
          {description}
        </Text>
      ) : null}

      <View style={styles.cardBottom}>
        <View style={styles.cardMeta}>
          <Ionicons name="calendar-outline" size={12} color={theme.colors.textSecondary} />
          <Text style={styles.cardMetaText}>
            {new Date(createdAt).toLocaleDateString('mk-MK')}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {isDuplicate && (
            <View style={styles.dupBadge}>
              <Ionicons name="copy-outline" size={11} color={theme.colors.error} />
              <Text style={styles.dupText}>Дупликат</Text>
            </View>
          )}
          <View style={styles.votePill}>
            <Ionicons name="thumbs-up-outline" size={12} color={theme.colors.textSecondary} />
            <Text style={voteCount > 0 ? styles.voteTextActive : styles.voteText}>{voteCount}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  )
}