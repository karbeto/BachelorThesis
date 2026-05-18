import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigation } from '@react-navigation/native'
import { submitIdea } from '../../../api/ideas'
import { useFormField } from '../../../utils/formHooks'
import Toast from 'react-native-toast-message'

const validateTitle = (v: string) =>
  v.trim().length >= 3 ? undefined : 'Насловот мора да има минимум 3 карактери'

const validateDescription = (v: string) =>
  v.trim().length >= 10 ? undefined : 'Описот мора да има минимум 10 карактери'

export function useSubmitIdeaLogic() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()
  const [municipalityId] = useState(1)

  const title = useFormField<string>('', validateTitle)
  const description = useFormField<string>('', validateDescription)

  const [titleFocused, setTitleFocused] = useState(false)
  const [descFocused, setDescFocused] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      submitIdea({
        title: title.value,
        description: description.value,
        municipality_id: municipalityId,
      }),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Идејата е поднесена! ✓',
        text2: 'Ви благодариме за вашиот предлог.',
      })
      queryClient.invalidateQueries({ queryKey: ['ideas'] })
      navigation.goBack()
    },
    onError: (err: any) => {
      Toast.show({
        type: 'error',
        text1: 'Грешка при поднесување',
        text2: err.response?.data?.detail || 'Обидете се повторно',
      })
    },
  })

  const handleSubmit = () => {
    const titleValid = title.validateField()
    const descValid = description.validateField()
    if (!titleValid || !descValid) return
    mutation.mutate()
  }

  return {
    title,
    description,
    titleFocused,
    setTitleFocused,
    descFocused,
    setDescFocused,
    handleSubmit,
    isSubmitting: mutation.isPending,
    goBack: () => navigation.goBack(),
  }
}