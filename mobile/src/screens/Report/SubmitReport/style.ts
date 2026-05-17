import { StyleSheet, Dimensions } from 'react-native'
import { Theme } from '../../../constants/theme'

const { width } = Dimensions.get('window')

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    // Header
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: 56,
      paddingBottom: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      gap: theme.spacing.md,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      ...theme.typography.h3,
      color: theme.colors.text,
      flex: 1,
    },

    // Step indicator
    stepWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.sm,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    stepCircle: {
      width: 24,
      height: 24,
      borderRadius: theme.borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepCircleActive: {
      backgroundColor: theme.colors.primary,
    },
    stepCircleInactive: {
      backgroundColor: theme.colors.border,
    },
    stepCircleDone: {
      backgroundColor: theme.colors.success,
    },
    stepNumber: {
      ...theme.typography.small,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    stepLabel: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    stepLabelActive: {
      color: theme.colors.text,
      fontWeight: '600',
    },
    stepLine: {
      flex: 1,
      height: 2,
      backgroundColor: theme.colors.border,
      borderRadius: 1,
    },
    stepLineDone: {
      backgroundColor: theme.colors.success,
    },

    // Photo step
    photoContent: {
      flex: 1,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
    },
    photoPreview: {
      width: '100%',
      height: 260,
      borderRadius: theme.borderRadius.large,
      backgroundColor: theme.colors.surfaceVariant,
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    photoPlaceholder: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    photoPlaceholderText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    photoActions: {
      gap: theme.spacing.sm,
    },
    photoBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: 52,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
    },
    photoBtnOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.colors.border,
    },
    photoBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    photoBtnTextOutline: {
      color: theme.colors.text,
    },
    skipBtn: {
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
    },
    skipText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },

    // Location step
    locationContent: {
      flex: 1,
    },
    mapPreview: {
      width: '100%',
      height: 320,
    },
    locationInfo: {
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
    locationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    locationIconWrap: {
      width: 40,
      height: 40,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.accent + '22',
      alignItems: 'center',
      justifyContent: 'center',
    },
    locationText: {
      flex: 1,
    },
    locationLabel: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    locationValue: {
      ...theme.typography.caption,
      fontWeight: '500',
      color: theme.colors.text,
    },
    reLocateBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: 44,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    reLocateText: {
      ...theme.typography.caption,
      fontWeight: '500',
      color: theme.colors.text,
    },
    confirmBtn: {
      height: 52,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadows.medium,
    },
    confirmBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    // Form step
    formScroll: {
      flex: 1,
    },
    formContent: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      paddingBottom: theme.spacing.xxl,
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
      backgroundColor: theme.colors.surface,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.medium,
      paddingHorizontal: theme.spacing.md,
      height: 52,
    },
    inputRowFocused: {
      borderColor: theme.colors.accent,
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
    textArea: {
      height: 100,
      textAlignVertical: 'top',
      paddingTop: theme.spacing.md,
    },
    textAreaWrap: {
      height: 100,
      alignItems: 'flex-start',
      paddingTop: theme.spacing.sm,
    },
    errorText: {
      ...theme.typography.small,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    categoryChip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.full,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    categoryChipActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
    categoryChipText: {
      ...theme.typography.small,
      fontWeight: '500',
      color: theme.colors.text,
    },
    categoryChipTextActive: {
      color: '#FFFFFF',
    },
    submitBtn: {
      height: 52,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
      ...theme.shadows.medium,
    },
    submitBtnDisabled: {
      opacity: 0.7,
    },
    submitBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    imageThumbnail: {
      width: 80,
      height: 80,
      borderRadius: theme.borderRadius.medium,
      marginBottom: theme.spacing.sm,
    },
  })