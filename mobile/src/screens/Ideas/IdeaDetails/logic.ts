import { useRoute, useNavigation } from '@react-navigation/native'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../context/AuthContext'
import client from '../../../api/client'
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

export function useIdeaDetailLogic() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const { id } = route.params

  const { data: myVotes } = useQuery<number[]>({
    queryKey: ['myVotes', user?.id],
    queryFn: async () => {
      const { data } = await client.get('/ideas/my-votes')
      return data
    },
    enabled: !!user && !!user.id,
    staleTime: 1000 * 60 * 5,
  })

  const { data: idea, isLoading } = useQuery({
    queryKey: ['idea', id],
    queryFn: async () => {
      const { data } = await client.get(`/ideas/${id}`)
      return data
    },
  })

  const hasVoted = myVotes ? new Set(myVotes).has(Number(id)) : (idea?.voted_by_user ?? false)

  const voteMutation = useMutation({
    mutationFn: () =>
      hasVoted
        ? client.delete(`/ideas/${id}/vote`)
        : client.post(`/ideas/${id}/vote`),
    
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['idea', id] })
      await queryClient.cancelQueries({ queryKey: ['myVotes', user?.id] })

      const previousIdea = queryClient.getQueryData(['idea', id])
      const previousMyVotes = queryClient.getQueryData<number[]>(['myVotes', user?.id])

      if (previousIdea) {
        queryClient.setQueryData(['idea', id], {
          ...previousIdea,
          vote_count: hasVoted 
            ? Math.max(0, ((previousIdea as any).vote_count || 1) - 1)
            : ((previousIdea as any).vote_count || 0) + 1
        })
      }

      if (previousMyVotes) {
        const updatedVotes = hasVoted
          ? previousMyVotes.filter(vId => vId !== Number(id))
          : [...previousMyVotes, Number(id)]
        queryClient.setQueryData(['myVotes', user?.id], updatedVotes)
      }

      return { previousIdea, previousMyVotes, wasVoted: hasVoted }
    },
    onSuccess: (_, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['idea', id] })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      queryClient.invalidateQueries({ queryKey: ['myVotes', user?.id] })
      
      Toast.show({
        type: 'success',
        text1: context?.wasVoted ? 'Гласот е отстранет' : 'Гласот е додаден ✓',
      })
    },
    onError: (err: any, _, context) => {
      if (context?.previousIdea) {
        queryClient.setQueryData(['idea', id], context.previousIdea)
      }
      if (context?.previousMyVotes) {
        queryClient.setQueryData(['myVotes', user?.id], context.previousMyVotes)
      }
      
      Toast.show({
        type: 'error',
        text1: err.response?.data?.detail || 'Грешка при процесирање на гласот',
      })
    },
  })

  return {
    idea,
    isLoading: isLoading || voteMutation.isPending,
    hasVoted,
    handleVote: () => voteMutation.mutate(),
    isVoting: voteMutation.isPending,
    goBack: () => navigation.goBack(),
  }
}