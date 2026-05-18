import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { getIdeas, voteIdea, unvoteIdea } from '../../../api/ideas'
import Toast from 'react-native-toast-message'

export const STATUS_MK: Record<string, string> = {
  open: 'Отворено',
  under_review: 'Се разгледува',
  accepted: 'Прифатено',
  rejected: 'Одбиено',
}

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  open: { bg: '#F0F9FF', color: '#38BDF8' },
  under_review: { bg: '#FFFBEB', color: '#F59E0B' },
  accepted: { bg: '#F0FDF4', color: '#22C55E' },
  rejected: { bg: '#FEF2F2', color: '#EF4444' },
}

export const FILTER_OPTIONS = [
  { value: '', label: 'Сите' },
  { value: 'open', label: 'Отворено' },
  { value: 'under_review', label: 'Се разгледува' },
  { value: 'accepted', label: 'Прифатено' },
  { value: 'rejected', label: 'Одбиено' },
]

export function useIdeasLogic() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()

  const [filterStatus, setFilterStatus] = useState('')
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set())

  const { data: ideas, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['ideas', filterStatus],
    queryFn: () =>
      getIdeas({ ...(filterStatus && { status: filterStatus }) }),
  })

  const voteMutation = useMutation({
    mutationFn: ({ id, voted }: { id: number; voted: boolean }) =>
      voted ? unvoteIdea(id) : voteIdea(id),
    onSuccess: (_, { id, voted }) => {
      setVotedIds((prev) => {
        const next = new Set(prev)
        voted ? next.delete(id) : next.add(id)
        return next
      })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      Toast.show({
        type: 'success',
        text1: voted ? 'Гласот е отстранет' : 'Гласот е додаден ✓',
      })
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: err.response?.data?.detail || 'Грешка при гласање',
      })
    },
  })

  const handleVote = (idea: any) => {
    const voted = votedIds.has(idea.id)
    voteMutation.mutate({ id: idea.id, voted })
  }

  const handleSubmitIdea = () => navigation.navigate('SubmitIdea')

  return {
    ideas,
    isLoading,
    refetch,
    isRefetching,
    filterStatus,
    setFilterStatus,
    votedIds,
    handleVote,
    handleSubmitIdea,
    isVoting: voteMutation.isPending,
  }
}