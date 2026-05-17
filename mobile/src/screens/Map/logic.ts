import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getReports } from '../../api/reports'
import { useNavigation } from '@react-navigation/native'

export const STATUS_COLORS: Record<string, string> = {
  submitted: '#F59E0B',
  in_progress: '#38BDF8',
  resolved: '#22C55E',
  rejected: '#EF4444',
}

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
}

export const CATEGORY_ICONS: Record<string, string> = {
  default: '📍',
  'Дупки на патот': '🕳️',
  'Ѓубре': '🗑️',
  'Осветлување': '💡',
  'Паркирање': '🚗',
  'Оштетена инфраструктура': '🔧',
}

export function useMapLogic() {
  const navigation = useNavigation<any>()
  const mapRef = useRef<any>(null)

  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['reports-map', filterStatus],
    queryFn: () =>
      getReports({
        limit: 100,
        ...(filterStatus && { status: filterStatus }),
      }),
  })

  const validReports = reports?.filter(
    (r: any) => r.latitude != null && r.longitude != null,
  ) ?? []

  const handleMarkerPress = (report: any) => {
    setSelectedReport(report)
  }

  const handleCardClose = () => {
    setSelectedReport(null)
  }

  const handleCardPress = () => {
    if (selectedReport) {
      navigation.navigate('ReportDetail', { id: selectedReport.id })
      setSelectedReport(null)
    }
  }

  const handleSubmitPress = () => {
    navigation.navigate('SubmitReport')
  }

  const handleFilterChange = (status: string) => {
    setFilterStatus(status)
    setShowFilters(false)
  }

  return {
    mapRef,
    reports: validReports,
    isLoading,
    refetch,
    selectedReport,
    filterStatus,
    showFilters,
    setShowFilters,
    handleMarkerPress,
    handleCardClose,
    handleCardPress,
    handleSubmitPress,
    handleFilterChange,
  }
}