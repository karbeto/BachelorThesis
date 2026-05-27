import { useQuery } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { getMyReports } from '../../api/reports'

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