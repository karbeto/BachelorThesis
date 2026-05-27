export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Пред момент'
  if (mins < 60) return `Пред ${mins} мин`
  if (hours < 24) return `Пред ${hours} ч`
  if (days === 1) return 'Вчера'
  return date.toLocaleDateString('mk-MK')
}