import { useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReport, voteReport, unvoteReport, rateReport } from '../../../api/reports'
import { useAuth } from '../../../context/AuthContext'
import { useModal } from '../../../utils/formHooks'
import Toast from 'react-native-toast-message'

export function useReportDetailLogic() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { id } = route.params
  const ratingModal = useModal()
  const imageModal = useModal()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [hasVoted, setHasVoted] = useState(false)

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getReport(id),
  })

  const voteMutation = useMutation({
    mutationFn: () => (hasVoted ? unvoteReport(id) : voteReport(id)),
    onSuccess: () => {
      setHasVoted(!hasVoted)
      queryClient.invalidateQueries({ queryKey: ['report', id] })
      queryClient.invalidateQueries({ queryKey: ['reports-map'] })
      queryClient.invalidateQueries({ queryKey: ['my-reports'] })
      Toast.show({
        type: 'success',
        text1: hasVoted ? 'Гласот е отстранет' : 'Гласот е додаден ✓',
      })
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.detail || 'Грешка при гласање',
      })
    },
  })

  const ratingMutation = useMutation({
    mutationFn: () => rateReport(id, rating, ratingComment || undefined),
    onSuccess: () => {
      Toast.show({ type: 'success', text1: 'Оценката е зачувана ✓' })
      queryClient.invalidateQueries({ queryKey: ['report', id] })
      ratingModal.close()
      setRating(0)
      setRatingComment('')
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.detail || 'Грешка при оценување',
      })
    },
  })

  return {
    report,
    isLoading,
    hasVoted,
    rating,
    setRating,
    ratingComment,
    setRatingComment,
    ratingModal,
    imageModal,
    selectedImage,
    openImage: (url: string) => {
      setSelectedImage(url)
      imageModal.open()
    },
    closeImage: () => {
      setSelectedImage(null)
      imageModal.close()
    },
    canRate: user?.id === report?.user_id && report?.status === 'resolved',
    handleVote: () => voteMutation.mutate(),
    handleRating: () => ratingMutation.mutate(),
    isVoting: voteMutation.isPending,
    isRating: ratingMutation.isPending,
    goBack: () => navigation.goBack(),
  }
}