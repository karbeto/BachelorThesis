import { StyleSheet } from 'react-native'
import { Theme } from '../../constants/theme'

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: 60,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    markAllBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
    },
    markAllText: {
      ...theme.typography.small,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    filterRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    filterChipActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    filterChipText: {
      ...theme.typography.small,
      fontWeight: '500',
      color: theme.colors.text,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    list: {
      paddingVertical: theme.spacing.sm,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    itemUnread: {
      backgroundColor: theme.colors.accent + '08',
    },
    iconWrap: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 2,
    },
    itemContent: {
      flex: 1,
      gap: 4,
    },
    itemMessage: {
      ...theme.typography.caption,
      color: theme.colors.text,
      lineHeight: 20,
    },
    itemMessageUnread: {
      fontWeight: '500',
    },
    itemDate: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.accent,
      marginTop: 6,
      flexShrink: 0,
    },
    emptyWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xxl,
      gap: theme.spacing.md,
    },
    emptyIcon: {
      width: 72,
      height: 72,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptyTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: 'center',
    },
    emptySubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.accent,
    },
    unreadBadgeText: {
      ...theme.typography.small,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  })