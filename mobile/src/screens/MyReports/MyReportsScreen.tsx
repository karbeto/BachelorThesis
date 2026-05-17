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
import {
  useMyReportsLogic,
  STATUS_MK,
  STATUS_COLORS,
} from './logic'

function StatusBadge({ status, styles }: { status: string; styles: any }) {
  const s = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#64748B' }
  return (
    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.statusText, { color: s.color }]}>
        {STATUS_MK[status] || status}
      </Text>
    </View>
  )
}

function ReportCard({
  report,
  onPress,
  styles,
  theme,
}: {
  report: any
  onPress: () => void
  styles: any
  theme: any
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {report.title}
        </Text>
        <StatusBadge status={report.status} styles={styles} />
      </View>

      {report.description ? (
        <Text style={styles.cardDesc} numberOfLines={2}>
          {report.description}
        </Text>
      ) : null}

      <View style={styles.cardBottom}>
        <View style={styles.cardMeta}>
          <Ionicons
            name="calendar-outline"
            size={12}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.cardMetaText}>
            {new Date(report.created_at).toLocaleDateString('mk-MK')}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {report.is_duplicate && (
            <View style={styles.dupBadge}>
              <Ionicons name="copy-outline" size={11} color={theme.colors.error} />
              <Text style={styles.dupText}>Дупликат</Text>
            </View>
          )}
          <View style={styles.votePill}>
            <Ionicons
              name="thumbs-up-outline"
              size={12}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.voteText}>{report.vote_count ?? 0}</Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={theme.colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  )
}

function EmptyState({
  onPress,
  styles,
  theme,
}: {
  onPress: () => void
  styles: any
  theme: any
}) {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="document-text-outline"
          size={32}
          color={theme.colors.textSecondary}
        />
      </View>
      <Text style={styles.emptyTitle}>Немате пријави</Text>
      <Text style={styles.emptySubtitle}>
        Пријавете урбан проблем во вашата околина и придонесете за подобар град.
      </Text>
      <TouchableOpacity
        style={styles.emptyBtn}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={18} color="#FFFFFF" />
        <Text style={styles.emptyBtnText}>Поднеси пријава</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function MyReportsScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    reports,
    isLoading,
    refetch,
    isRefetching,
    handleReportPress,
    handleSubmitPress,
  } = useMyReportsLogic()

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
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Мои пријави</Text>
          <Text style={styles.headerSubtitle}>
            {reports?.length ?? 0} вкупно
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleSubmitPress}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          reports?.length === 0 && { flex: 1 },
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
          <EmptyState
            onPress={handleSubmitPress}
            styles={styles}
            theme={theme}
          />
        }
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => handleReportPress(item)}
            styles={styles}
            theme={theme}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: theme.spacing.sm }} />
        )}
      />
    </View>
  )
}