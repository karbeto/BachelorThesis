import React from 'react'
import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useIdeasLogic, FILTER_OPTIONS } from './logic'
import { IdeaCard } from './components/IdeaCard'
import { GenericEmptyState } from '../../../components/GenericEmptyState'

export default function IdeasScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  
  const {
    ideas,
    isLoading,
    refetch,
    isRefetching,
    filterStatus,
    setFilterStatus,
    votedIds,
    handleVote,
    handleSubmitIdea,
  } = useIdeasLogic()

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingWrap]}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header Context Layout */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Идеи за маалото</Text>
          <Text style={styles.headerSubtitle}>{ideas?.length ?? 0} предлози</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleSubmitIdea} activeOpacity={0.85}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Selection Filter chips */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterChip, filterStatus === opt.value && styles.filterChipActive]}
              onPress={() => setFilterStatus(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterChipText, filterStatus === opt.value && styles.filterChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Primary Ideas Data Stream Feed */}
      <FlatList
        data={ideas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[styles.list, ideas?.length === 0 && { flex: 1 }]}
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
            icon="bulb-outline"
            title="Нема идеи"
            subtitle="Предложете подобрување за вашето маало и гласајте за идеите на другите."
            btnText="Додај идеја"
            onPress={handleSubmitIdea}
            style={styles}
            theme={theme}
          />
        }
        renderItem={({ item }) => (
          <IdeaCard
            idea={item}
            voted={votedIds.has(item.id)}
            onVote={() => handleVote(item)}
            styles={styles}
            theme={theme}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
      />
    </View>
  )
}