import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { formatRelativeDate } from '../../utils/date'

interface NotificationItemProps {
  notification: any
  onPress: () => void
  styles: any
  theme: any
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  styles,
  theme,
}) => {
  const isUnread = !notification.is_read
  const isClickable = !!notification.report_id || !!notification.idea_id
  const isReport = !!notification.report_id

  const bgIconColor = isReport ? theme.colors.accent + '20' : theme.colors.info + '20'
  const iconColor = isReport ? theme.colors.accent : theme.colors.info
  const iconName = isReport ? 'document-text' : 'bulb'

  return (
    <TouchableOpacity
      style={[styles.item, isUnread && styles.itemUnread]}
      onPress={onPress}
      activeOpacity={isClickable ? 0.7 : 1}
      disabled={!isClickable}
    >
      <View style={[styles.iconWrap, { backgroundColor: bgIconColor }]}>
        <Ionicons name={iconName as any} size={18} color={iconColor} />
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemMessage, isUnread && styles.itemMessageUnread]}>
          {notification.message}
        </Text>
        <Text style={styles.itemDate}>
          {formatRelativeDate(notification.created_at)}
        </Text>
      </View>

      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )
}