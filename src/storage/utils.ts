import type { Translation } from './models.ts';

export const groupByAddedDate = (
  items: Translation[]
): Record<string, Translation[]> => {
  const filtered = items.filter(
    i => !i.deleted && i.original.trim() !== '' && i.translation.trim() !== ''
  )

  const sorted = filtered.sort((a, b) => b.added - a.added)

  return sorted.reduce<Record<string, Translation[]>>((acc, item) => {
    const date = new Date(item.added).toISOString().slice(0, 10)
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {})
}

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

export const formatDate = (date: string): string => {
  const [y, m, d] = date.split('-').map(Number)
  const dt = new Date(y, m - 1, d)

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfDt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  const diffMs = startOfToday.getTime() - startOfDt.getTime()
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  const sameYear = now.getFullYear() === dt.getFullYear()
  const month = monthNames[dt.getMonth()]
  const day = dt.getDate()

  if (sameYear) return `${month} ${day}`
  return `${month} ${day}, ${dt.getFullYear()}`
}
