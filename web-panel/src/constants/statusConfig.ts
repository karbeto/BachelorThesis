export const STATUS_OPTIONS = [
  { value: '', label: 'Сите статуси' },
  { value: 'submitted', label: 'Поднесено' },
  { value: 'in_progress', label: 'Се решава' },
  { value: 'resolved', label: 'Решено' },
  { value: 'rejected', label: 'Одбиено' },
];

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
};

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  submitted: { bg: '#FFFBEB', color: '#F59E0B' },
  in_progress: { bg: '#F0F9FF', color: '#38BDF8' },
  resolved: { bg: '#F0FDF4', color: '#22C55E' },
  rejected: { bg: '#FEF2F2', color: '#EF4444' },
};