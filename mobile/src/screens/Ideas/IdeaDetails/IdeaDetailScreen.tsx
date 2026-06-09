import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useIdeaDetailLogic, STATUS_MK, STATUS_COLORS } from './logic'

export default function IdeaDetailScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    idea,
    isLoading,
    hasVoted,
    handleVote,
    isVoting,
    goBack,
  } = useIdeaDetailLogic()

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    )
  }

  if (!idea) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={{ color: theme.colors.textSecondary }}>
          Идејата не е пронајдена
        </Text>
      </View>
    )
  }

  const statusStyle = STATUS_COLORS[idea.status] || {
    bg: '#F1F5F9',
    color: '#64748B',
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Идеја #{idea.id}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title card */}
        <View style={styles.titleCard}>
          <View style={styles.titleRow}>
            <Text style={styles.ideaTitle}>{idea.title}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg },
            ]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {STATUS_MK[idea.status]}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {new Date(idea.created_at).toLocaleDateString('mk-MK')}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="thumbs-up-outline"
                size={13}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {idea.vote_count ?? 0} гласови
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Опис</Text>
          <Text style={styles.descText}>{idea.description}</Text>
          <View style={styles.supportPill}>
            <Ionicons name="people" size={14} color={theme.colors.info} />
            <Text style={styles.supportText}>
              {idea.vote_count ?? 0} граѓани ја поддржуваат
            </Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Детали</Text>
          {[
            { label: 'Општина', value: idea.municipality_name || `#${idea.municipality_id}` },
            { label: 'Поднесено од', value: idea.user_full_name || 'Анонимен' },
            { label: 'Статус', value: STATUS_MK[idea.status] },
            { label: 'Поднесено', value: new Date(idea.created_at).toLocaleDateString('mk-MK') },
          ].map(({ label, value }, i, arr) => (
            <View
              key={i}
              style={[
                styles.infoRow,
                i === arr.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <Text style={styles.infoLabel}>{label}</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        {/* Vote button */}
        <TouchableOpacity
          style={[styles.voteBtn, hasVoted && styles.voteBtnActive]}
          onPress={handleVote}
          disabled={isVoting}
          activeOpacity={0.8}
        >
          {isVoting ? (
            <ActivityIndicator
              size="small"
              color={hasVoted ? theme.colors.accent : theme.colors.text}
            />
          ) : (
            <>
              <Ionicons
                name={hasVoted ? 'thumbs-up' : 'thumbs-up-outline'}
                size={20}
                color={hasVoted ? theme.colors.accent : theme.colors.text}
              />
              <Text style={[
                styles.voteBtnText,
                hasVoted && styles.voteBtnTextActive,
              ]}>
                {hasVoted ? 'Гласано ✓' : 'Гласај за оваа идеја'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}