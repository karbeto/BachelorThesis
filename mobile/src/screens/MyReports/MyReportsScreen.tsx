import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { createStyles } from './style'
import { useMyReportsLogic} from './logic'
import { STATUS_MK, STATUS_COLORS } from '../../constants/statusConfig'
import { DataCard } from '../../components/ui/DataCard'
import { GenericEmptyState } from '../../components/GenericEmptyState'

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
      {/* Dynamic Header Block */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Мои пријави</Text>
          <Text style={styles.headerSubtitle}>{reports?.length ?? 0} вкупно</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleSubmitPress} activeOpacity={0.85}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Data Feed */}
      <FlatList
        data={reports}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, reports?.length === 0 && { flex: 1 }]}
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
          <GenericEmptyState
            icon="document-text-outline"
            title="Немате пријави"
            subtitle="Пријавете урбан проблем во вашата околина и придонесете за подобар град."
            btnText="Поднеси пријава"
            onPress={handleSubmitPress}
            style={styles}
            theme={theme}
          />
        }
        renderItem={({ item }) => (
          <DataCard
            title={item.title}
            description={item.description}
            status={item.status}
            statusLabel={STATUS_MK[item.status] || item.status}
            statusColors={STATUS_COLORS[item.status] || { bg: '#F1F5F9', color: '#64748B' }}
            createdAt={item.created_at}
            voteCount={item.vote_count ?? 0}
            isDuplicate={item.is_duplicate}
            onPress={() => handleReportPress(item)}
            styles={styles}
            theme={theme}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
      />
    </View>
  )
}