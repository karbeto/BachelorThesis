import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import {
  useIdeasLogic,
  STATUS_MK,
  STATUS_COLORS,
  FILTER_OPTIONS,
} from './logic'

function IdeaCard({
  idea,
  voted,
  onVote,
  styles,
  theme,
}: {
  idea: any
  voted: boolean
  onVote: () => void
  styles: any
  theme: any
}) {
  const s = STATUS_COLORS[idea.status] || { bg: '#F1F5F9', color: '#64748B' }

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {idea.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
          <Text style={[styles.statusText, { color: s.color }]}>
            {STATUS_MK[idea.status]}
          </Text>
        </View>
      </View>

      <Text style={styles.cardDesc} numberOfLines={3}>
        {idea.description}
      </Text>

      <View style={styles.cardBottom}>
        <Text style={styles.dateText}>
          {new Date(idea.created_at).toLocaleDateString('mk-MK')}
        </Text>

        <TouchableOpacity
          style={[styles.voteBtn, voted && styles.voteBtnActive]}
          onPress={onVote}
          activeOpacity={0.75}
        >
          <Ionicons
            name={voted ? 'thumbs-up' : 'thumbs-up-outline'}
            size={14}
            color={voted ? theme.colors.accent : theme.colors.textSecondary}
          />
          <Text style={[styles.voteCount, voted && styles.voteCountActive]}>
            {(idea.vote_count ?? 0) + (voted ? 1 : 0)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Идеи за маалото</Text>
          <Text style={styles.headerSubtitle}>
            {ideas?.length ?? 0} предлози
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleSubmitIdea}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
        >
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.filterChip,
                filterStatus === opt.value && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus(opt.value)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterChipText,
                filterStatus === opt.value && styles.filterChipTextActive,
              ]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={ideas}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={[
          styles.list,
          ideas?.length === 0 && { flex: 1 },
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
                name="bulb-outline"
                size={32}
                color={theme.colors.textSecondary}
              />
            </View>
            <Text style={styles.emptyTitle}>Нема идеи</Text>
            <Text style={styles.emptySubtitle}>
              Предложете подобрување за вашето маало и гласајте за идеите на другите.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={handleSubmitIdea}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.emptyBtnText}>Додај идеја</Text>
            </TouchableOpacity>
          </View>
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
        ItemSeparatorComponent={() => (
          <View style={{ height: theme.spacing.sm }} />
        )}
      />
    </View>
  )
}