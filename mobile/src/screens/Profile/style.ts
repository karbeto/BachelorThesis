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
      paddingTop: theme.spacing.md,
    },

    // Typographic Clean Header (No avatar frames)
    hero: {
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.lg,
      paddingHorizontal: theme.spacing.lg,
      alignItems: 'flex-start',
    },
    heroDetails: {
      width: '100%',
      alignItems: 'flex-start',
    },
    userName: {
      ...theme.typography.h2,
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.text,
      letterSpacing: -0.5,
    },
    userEmail: {
      ...theme.typography.body,
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    roleBadge: {
      marginTop: theme.spacing.sm,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary + '12',
    },
    roleText: {
      ...theme.typography.small,
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },

    // Telemetry Statistics (No flat grids or dividing lines)
    statsRow: {
      flexDirection: 'row',
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    statItem: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'flex-start',
    },
    statDivider: {
      display: 'none',
    },
    statValue: {
      ...theme.typography.h2,
      fontSize: 26,
      fontWeight: '800',
      color: theme.colors.text,
    },
    statLabel: {
      ...theme.typography.small,
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginTop: 2,
    },

    // Floating Settings Sections
    section: {
      marginHorizontal: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    sectionTitle: {
      ...theme.typography.small,
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: theme.spacing.sm,
      marginLeft: theme.spacing.xs,
    },
    sectionCard: {
      gap: theme.spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.large,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    rowLast: {},
    rowIcon: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.medium,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      backgroundColor: theme.colors.surfaceVariant,
    },
    rowContent: {
      flex: 1,
    },
    rowLabel: {
      ...theme.typography.body,
      color: theme.colors.text,
      fontWeight: '600',
    },
    rowSubtitle: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    rowRight: {
      flexShrink: 0,
    },

    // Destructive Logout Block
    logoutRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.error + '0A',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.large,
      borderWidth: 1,
      borderColor: theme.colors.error + '1A',
      gap: theme.spacing.md,
    },
    logoutLabel: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.error,
      flex: 1,
    },

    // Overlays & Bottom Sheet Modals
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(5, 8, 16, 0.75)',
      justifyContent: 'flex-end',
    },
    modal: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.xxl + theme.spacing.md,
      width: '100%',
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    modalHandle: {
      width: 36,
      height: 5,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.border,
      alignSelf: 'center',
      marginBottom: theme.spacing.md,
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
      marginTop: theme.spacing.sm,
    },
    cancelBtn: {
      flex: 1,
      height: 50,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.text,
    },
    confirmBtn: {
      flex: 1,
      height: 50,
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
      height: 50,
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
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.text,
      textAlign: 'center',
    },
    logoutModalSubtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginTop: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
    },
  })