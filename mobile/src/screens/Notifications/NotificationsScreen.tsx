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
import { NotificationItem } from '../../components/ui/NotificationItem'

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
      {/* Header Container Layout */}
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
                  <Ionicons name="checkmark-done-outline" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.markAllText}>Сите прочитани</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Dynamic Filter Action Row Selector */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterChip, !unreadOnly && styles.filterChipActive]}
            onPress={() => setUnreadOnly(false)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, !unreadOnly && styles.filterChipTextActive]}>
              Сите
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterChip, unreadOnly && styles.filterChipActive]}
            onPress={() => setUnreadOnly(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterChipText, unreadOnly && styles.filterChipTextActive]}>
              Непрочитани
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications Dynamic Data Feed List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, notifications?.length === 0 && { flex: 1 }]}
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
              <Ionicons name="notifications-outline" size={32} color={theme.colors.textSecondary} />
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