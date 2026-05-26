import { StyleSheet, Dimensions } from 'react-native'
import { Theme } from '../../constants/theme'

const { width, height } = Dimensions.get('window')

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    map: {
      width: '100%',
      height: '100%',
    },

    topBar: {
      position: 'absolute',
      top: 56,
      left: theme.spacing.md,
      right: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      zIndex: 10,
    },
    titlePill: {
      flex: 1,
      height: 44,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.full,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      gap: theme.spacing.sm,
      ...theme.shadows.medium,
    },
    titleText: {
      ...theme.typography.caption,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    countPill: {
      backgroundColor: theme.colors.accent + '22',
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.full,
    },
    countText: {
      ...theme.typography.small,
      fontWeight: '600',
      color: theme.colors.accent,
    },
    filterBtn: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    },

    filterDropdown: {
      position: 'absolute',
      top: 108,
      right: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.sm,
      zIndex: 20,
      minWidth: 180,
      ...theme.shadows.heavy,
    },
    filterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.medium,
    },
    filterItemActive: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    filterDot: {
      width: 10,
      height: 10,
      borderRadius: theme.borderRadius.full,
    },
    filterText: {
      ...theme.typography.caption,
      color: theme.colors.text,
    },
    filterTextActive: {
      fontWeight: '600',
      color: theme.colors.primary,
    },

    fab: {
      position: 'absolute',
      bottom: 100,
      right: theme.spacing.lg,
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      ...theme.shadows.heavy,
    },

    card: {
      position: 'absolute',
      bottom: 90,
      left: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.md,
      zIndex: 10,
      ...theme.shadows.heavy,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm,
    },
    cardTitle: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardDesc: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      lineHeight: 20,
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
    },
    statusDot: {
      width: 7,
      height: 7,
      borderRadius: theme.borderRadius.full,
    },
    statusText: {
      ...theme.typography.small,
      fontWeight: '600',
    },
    detailsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
    },
    detailsBtnText: {
      ...theme.typography.small,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    legend: {
      position: 'absolute',
      bottom: 160,
      left: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.sm,
      gap: theme.spacing.xs,
      ...theme.shadows.light,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: theme.borderRadius.full,
    },
    legendText: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
  })