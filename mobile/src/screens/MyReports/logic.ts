import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { getMyReports } from '../../api/reports'
import { getQueue, PendingReport } from '../../utils/offlineQueue'

export function useMyReportsLogic() {
  const navigation = useNavigation<any>()
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([])
 
  const { data: reports, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['my-reports'],
    queryFn: getMyReports,
  })
 
  // Refresh pending queue every time screen is focused
  useFocusEffect(
    useCallback(() => {
      getQueue().then(setPendingReports)
    }, [])
  )
 
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
    pendingReports,
    handleReportPress,
    handleSubmitPress,
  }
}