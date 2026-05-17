import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { getMyReports } from '../../api/reports'

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
}

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  submitted: { bg: '#FFFBEB', color: '#F59E0B' },
  in_progress: { bg: '#F0F9FF', color: '#38BDF8' },
  resolved: { bg: '#F0FDF4', color: '#22C55E' },
  rejected: { bg: '#FEF2F2', color: '#EF4444' },
}

export function useMyReportsLogic() {
  const navigation = useNavigation<any>()

  const { data: reports, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['my-reports'],
    queryFn: getMyReports,
  })

  const handleReportPress = (report: any) => {
    navigation.navigate('ReportDetail', { id: report.id })
  }

  const handleSubmitPress = () => {
    navigation.navigate('SubmitReport')
  }

  return {
    reports,
    isLoading,
    refetch,
    isRefetching,
    handleReportPress,
    handleSubmitPress,
  }
}