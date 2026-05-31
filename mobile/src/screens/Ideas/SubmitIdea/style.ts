import { StyleSheet, Platform } from 'react-native'
import { Theme } from '../../../constants/theme'

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingTop: Platform.OS === 'ios' ? 60 : 44,
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
    scroll: {
      flex: 1,
    },
    content: {
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
      paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.xl,
    },
    infoCard: {
      backgroundColor: theme.colors.accent + '15',
      borderRadius: theme.borderRadius.medium,
      padding: theme.spacing.md,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      alignItems: 'flex-start',
    },
    infoText: {
      ...theme.typography.caption,
      color: theme.colors.text,
      flex: 1,
      lineHeight: 20,
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
    textAreaWrap: {
      height: 140,
      alignItems: 'flex-start',
      paddingTop: theme.spacing.sm,
    },
    textArea: {
      height: 120,
      textAlignVertical: 'top',
    },
    errorText: {
      ...theme.typography.small,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
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
      opacity: 0.6,
    },
    submitBtnText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  })