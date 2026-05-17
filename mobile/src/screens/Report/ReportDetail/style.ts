import { StyleSheet, Dimensions } from 'react-native'
import { Theme } from '../../../constants/theme'

const { width } = Dimensions.get('window')

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingWrap: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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

    // Scroll
    scroll: {
      flex: 1,
    },
    scrollContent: {
      padding: theme.spacing.md,
      gap: theme.spacing.md,
      paddingBottom: theme.spacing.xxl,
    },

    // Title card
    titleCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    reportTitle: {
      ...theme.typography.h3,
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
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    dupBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.error + '15',
    },
    dupText: {
      ...theme.typography.small,
      color: theme.colors.error,
      fontWeight: '500',
    },

    // Section card
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.large,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: theme.spacing.sm,
    },
    cardLabel: {
      ...theme.typography.small,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    descText: {
      ...theme.typography.body,
      color: theme.colors.text,
      lineHeight: 24,
    },

    // Map
    mapWrap: {
      height: 200,
      borderRadius: theme.borderRadius.medium,
      overflow: 'hidden',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    addressText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      flex: 1,
    },

    // Images
    imageScroll: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    imageThumb: {
      width: 100,
      height: 100,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.surfaceVariant,
    },

    // Actions
    actionsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    voteBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: 48,
      borderRadius: theme.borderRadius.medium,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    voteBtnActive: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accent + '15',
    },
    voteBtnText: {
      ...theme.typography.caption,
      fontWeight: '600',
      color: theme.colors.text,
    },
    voteBtnTextActive: {
      color: theme.colors.accent,
    },
    rateBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      height: 48,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.success,
    },
    rateBtnText: {
      ...theme.typography.caption,
      fontWeight: '600',
      color: '#FFFFFF',
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
      textAlign: 'center',
    },
    modalSubtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    starsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    starBtn: {
      padding: theme.spacing.xs,
    },
    commentInput: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      ...theme.typography.body,
      color: theme.colors.text,
      minHeight: 80,
      textAlignVertical: 'top',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    modalActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
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
    submitBtn: {
      flex: 1,
      height: 48,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    // Full image modal
    imageOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.92)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullImage: {
      width: width,
      height: width,
    },
    closeImageBtn: {
      position: 'absolute',
      top: 56,
      right: theme.spacing.lg,
      width: 36,
      height: 36,
      borderRadius: theme.borderRadius.full,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
    },
  })