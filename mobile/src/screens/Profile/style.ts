import { StyleSheet } from 'react-native'
import { Theme } from '../../constants/theme'

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: theme.spacing.xxl,
    },

    // Hero
    hero: {
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      paddingTop: 72,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    avatarWrap: {
      position: 'relative',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    },
    avatarText: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.accent,
    },
    roleDot: {
      position: 'absolute',
      bottom: 2,
      right: 2,
      width: 20,
      height: 20,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.success,
      borderWidth: 2,
      borderColor: theme.colors.surface,
    },
    userName: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: 'center',
    },
    userEmail: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    roleBadge: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.accent + '20',
    },
    roleText: {
      ...theme.typography.small,
      fontWeight: '600',
      color: theme.colors.accent,
    },

    // Stats
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    statItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: theme.spacing.md,
    },
    statDivider: {
      width: 1,
      backgroundColor: theme.colors.border,
    },
    statValue: {
      ...theme.typography.h2,
      color: theme.colors.text,
    },
    statLabel: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },

    // Section
    section: {
      marginHorizontal: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    sectionTitle: {
      ...theme.typography.small,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
    sectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    rowLast: {
      borderBottomWidth: 0,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.medium,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    rowContent: {
      flex: 1,
    },
    rowLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '500',
    },
    rowSubtitle: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
      marginTop: 1,
    },
    rowRight: {
      flexShrink: 0,
    },

    // Logout
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    logoutLabel: {
      ...theme.typography.body,
      fontWeight: '500',
      color: theme.colors.error,
      flex: 1,
    },

    // Modal
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      width: '100%',
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
      alignSelf: 'center',
      marginBottom: theme.spacing.sm,
    },
    modalTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
    },
    modalSubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginTop: -theme.spacing.xs,
    },
    fieldWrap: {
      gap: theme.spacing.xs,
    },
    label: {
      ...theme.typography.small,
      fontWeight: '500',
      color: theme.colors.text,
      marginLeft: theme.spacing.xs,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      paddingHorizontal: theme.spacing.md,
      height: 50,
    },
    inputRowFocused: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.surface,
    },
    inputRowError: {
      borderColor: theme.colors.error,
    },
    input: {
      flex: 1,
      ...theme.typography.body,
      color: theme.colors.text,
      paddingVertical: 0,
    },
    eyeBtn: {
      padding: theme.spacing.xs,
    },
    errorText: {
      ...theme.typography.small,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
    },
    modalActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    cancelBtn: {
      flex: 1,
      height: 48,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtnText: {
      ...theme.typography.body,
      fontWeight: '500',
      color: theme.colors.text,
    },
    confirmBtn: {
      flex: 1,
      height: 48,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    confirmBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    dangerBtn: {
      flex: 1,
      height: 48,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.error,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dangerBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    logoutModalTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      textAlign: 'center',
    },
    logoutModalSubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 22,
    },
  })