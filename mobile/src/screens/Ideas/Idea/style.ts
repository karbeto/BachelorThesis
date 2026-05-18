import { StyleSheet } from 'react-native'
import { Theme } from '../../../constants/theme'

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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      gap: 2,
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    headerSubtitle: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    addBtn: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterRow: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    filterContent: {
      gap: theme.spacing.sm,
    },
    filterChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
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
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
      ...theme.shadows.light,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    cardTitle: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      flexShrink: 0,
    },
    statusText: {
      ...theme.typography.small,
      fontWeight: '600',
    },
    cardDesc: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      lineHeight: 20,
    },
    cardBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateText: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    voteBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    voteBtnActive: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '15',
    },
    voteCount: {
      ...theme.typography.small,
      fontWeight: '600',
      color: theme.colors.text,
    },
    voteCountActive: {
      color: theme.colors.accent,
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
    emptyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      marginTop: theme.spacing.sm,
      ...theme.shadows.medium,
    },
    emptyBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  })