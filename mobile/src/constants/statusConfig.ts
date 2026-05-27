export interface StatusTheme {
  bg: string
  color: string
}

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
  
  open: 'Отворено',
  under_review: 'Се разгледува',
  accepted: 'Прифатено',
}

export const STATUS_COLORS: Record<string, StatusTheme> = {
  submitted: { bg: '#FFFBEB', color: '#F59E0B' },
  under_review: { bg: '#FFFBEB', color: '#F59E0B' },
  
  in_progress: { bg: '#F0F9FF', color: '#38BDF8' },
  open: { bg: '#F0F9FF', color: '#38BDF8' },
  
  resolved: { bg: '#F0FDF4', color: '#22C55E' },
  accepted: { bg: '#F0FDF4', color: '#22C55E' },
  
  rejected: { bg: '#FEF2F2', color: '#EF4444' },
}

export const DEFAULT_STATUS_THEME: StatusTheme = { 
  bg: '#F1F5F9', 
  color: '#64748B' 
}