import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { createStyles } from './style'
import { useNotificationsLogic } from './logic'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Пред момент'
  if (mins < 60) return `Пред ${mins} мин`
  if (hours < 24) return `Пред ${hours} ч`
  if (days === 1) return 'Вчера'
  return date.toLocaleDateString('mk-MK')
}

function NotificationIcon({
  notification,
  theme,
  styles,
}: {
  notification: any
  theme: any
  styles: any
}) {
  const isReport = !!notification.report_id
  const bg = isReport
    ? theme.colors.accent + '20'
    : theme.colors.info + '20'
  const color = isReport ? theme.colors.accent : theme.colors.info
  const icon = isReport ? 'document-text' : 'bulb'

  return (
    <View style={[styles.iconWrap, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
  )
}

function NotificationItem({
  notification,
  onPress,
  styles,
  theme,
}: {
  notification: any
  onPress: () => void
  styles: any
  theme: any
}) {
  const isUnread = !notification.is_read
  const isClickable = !!notification.report_id || !!notification.idea_id

  return (
    <TouchableOpacity
      style={[styles.item, isUnread && styles.itemUnread]}
      onPress={onPress}
      activeOpacity={isClickable ? 0.7 : 1}
      disabled={!isClickable}
    >
      <NotificationIcon
        notification={notification}
        theme={theme}
        styles={styles}
      />

      <View style={styles.itemContent}>
        <Text style={[styles.itemMessage, isUnread && styles.itemMessageUnread]}>
          {notification.message}
        </Text>
        <Text style={styles.itemDate}>
          {formatDate(notification.created_at)}
        </Text>
      </View>

      {isUnread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )
}

export default function NotificationsScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    notifications,
    isLoading,
    refetch,
    isRefetching,
    unreadOnly,
    setUnreadOnly,
    unreadCount,
    handleNotificationPress,
    handleMarkAll,
    isMarkingAll,
  } = useNotificationsLogic()

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingWrap]}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm }}>
            <Text style={styles.headerTitle}>Известувања</Text>
            {unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>

          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markAllBtn}
              onPress={handleMarkAll}
              disabled={isMarkingAll}
              activeOpacity={0.7}
            >
              {isMarkingAll ? (
                <ActivityIndicator size="small" color={theme.colors.textSecondary} />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.markAllText}>Сите прочитани</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, !unreadOnly && styles.filterChipActive]}
            onPress={() => setUnreadOnly(false)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterChipText,
              !unreadOnly && styles.filterChipTextActive,
            ]}>
              Сите
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, unreadOnly && styles.filterChipActive]}
            onPress={() => setUnreadOnly(true)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.filterChipText,
              unreadOnly && styles.filterChipTextActive,
            ]}>
              Непрочитани
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          notifications?.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-outline"
                size={32}
                color={theme.colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>Нема известувања</Text>
            <Text style={styles.emptySubtitle}>
              {unreadOnly
                ? 'Немате непрочитани известувања.'
                : 'Кога ќе се промени статусот на вашата пријава, ќе добиете известување тука.'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={() => handleNotificationPress(item)}
            styles={styles}
            theme={theme}
          />
        )}
      />
    </View>
  )
}