import { StyleSheet } from 'react-native'
import { Theme } from '../../../constants/theme'

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scroll: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xxl,
    },
    header: {
      alignItems: 'center',
      marginBottom: theme.spacing.xl,
    },
    logoCircle: {
      width: 56,
      height: 56,
      borderRadius: theme.borderRadius.large,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
      ...theme.shadows.medium,
    },
    logoInner: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.accent,
    },
    title: {
      ...theme.typography.h2,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      gap: theme.spacing.md,
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
    optionalLabel: {
      ...theme.typography.small,
      color: theme.colors.textSecondary,
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginLeft: theme.spacing.xs,
      marginRight: theme.spacing.xs,
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
    eyeBtn: {
      padding: theme.spacing.xs,
    },
    errorText: {
      ...theme.typography.small,
      color: theme.colors.error,
      marginLeft: theme.spacing.xs,
    },
    button: {
      height: 52,
      borderRadius: theme.borderRadius.medium,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
      ...theme.shadows.medium,
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: theme.spacing.xl,
      gap: theme.spacing.xs,
    },
    footerText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    footerLink: {
      ...theme.typography.caption,
      fontWeight: '600',
      color: theme.colors.accent,
    },
  })