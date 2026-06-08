import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { Alert } from 'react-native'
import * as Location from 'expo-location'
import { getIdeas, voteIdea, unvoteIdea } from '../../../api/ideas'
import { getMunicipalities } from '../../../api/municipalities' 
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

const normalizeString = (str: string): string => {
  if (!str) return ''
  return str
    .toLowerCase()
    .trim()
    .replace(/[\s,.\-"']/g, '') 
}

export function useIdeasLogic() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()

  const [filterStatus, setFilterStatus] = useState('')
  const [votedIds, setVotedIds] = useState<Set<number>>(new Set())
  

  const [isLocating, setLocating] = useState(false)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [address, setAddress] = useState('')
  const [municipalityId, setMunicipalityId] = useState<number | null>(null)

  const { data: municipalities } = useQuery({
    queryKey: ['municipalities'],
    queryFn: getMunicipalities,
    staleTime: 1000 * 60 * 30, 
  })

  const resolveUserLocation = useCallback(async () => {
    if (isLocating) return
    setLocating(true)
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Локација',
          'Дозволете пристап до локацијата за да ја прилагодиме содржината за Вашата општина.',
        )
        setLocating(false)
        return
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      
      const currentCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      }
      setCoords(currentCoords)

      const geocode = await Location.reverseGeocodeAsync(currentCoords)
      if (geocode && geocode.length > 0) {
        const g = geocode[0]
        const computedAddress = [g.street, g.streetNumber, g.city]
          .filter(Boolean)
          .join(' ')
        
        setAddress(
          computedAddress || 
          `${currentCoords.latitude.toFixed(5)}, ${currentCoords.longitude.toFixed(5)}`
        )
        
        if (municipalities && municipalities.length > 0) {
          const spatialPool = normalizeString(
            `${g.district || ''} ${g.subregion || ''} ${g.city || ''} ${g.street || ''}`
          )

          const matchedMun = municipalities.find((m: any) => {
            const normalizedDbName = normalizeString(m.name)
            return spatialPool.includes(normalizedDbName)
          })
          
          if (matchedMun) {
            setMunicipalityId(matchedMun.id)
          } else {
            const skopjeFallback = municipalities.find((m: any) => 
              normalizeString(m.name).includes('skopje')
            )
            if (skopjeFallback) setMunicipalityId(skopjeFallback.id)
          }
        }
      }
    } catch (error) {
      Toast.show({ 
        type: 'error', 
        text1: 'Грешка', 
        text2: 'Не може да се одреди локацијата во моментов.' 
      })
    } finally {
      setLocating(false)
    }
  }, [municipalities, isLocating])

  useEffect(() => {
    if (municipalities && municipalities.length > 0 && !municipalityId) {
      resolveUserLocation()
    }
  }, [municipalities, municipalityId, resolveUserLocation])

  const { data: ideas, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['ideas', filterStatus, municipalityId],
    queryFn: () =>
      getIdeas({
        ...(filterStatus && { status: filterStatus }),
        ...(municipalityId && { municipality_id: municipalityId }),
      }),
    enabled: municipalityId !== null, 
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

  const handleSubmitIdea = () => {
    navigation.navigate('SubmitIdea', {
      preselectedMunicipalityId: municipalityId,
      currentCoords: coords
    })
  }

  return {
    ideas,
    isLoading: isLoading || isLocating,
    refetch: () => {
      resolveUserLocation()
      refetch()
    },
    isRefetching,
    filterStatus,
    setFilterStatus,
    votedIds,
    handleVote,
    handleSubmitIdea,
    isVoting: voteMutation.isPending,
    currentAddress: address,
  }
}