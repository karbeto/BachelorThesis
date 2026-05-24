import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { submitReport } from '../../../api/reports'
import { useFormField } from '../../../utils/formHooks'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

export type SubmitStep = 'photo' | 'location' | 'form'

const validateTitle = (value: string) =>
  value.trim().length >= 3 ? undefined : 'Насловот мора да има минимум 3 карактери'

export function useSubmitReportLogic() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()

  const [step, setStep] = useState<SubmitStep>('photo')
  const [image, setImage] = useState<any>(null)
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [address, setAddress] = useState<string>('')
  const [municipalityId] = useState<number>(1) // default Veles
  const [locating, setLocating] = useState(false)

  const title = useFormField<string>('', validateTitle)
  const description = useFormField<string>('')

  // Auto-get location when entering location step
  useEffect(() => {
    if (step === 'location' && !location) {
      getLocation()
    }
  }, [step])

  const getLocation = async () => {
    setLocating(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Локација',
          'Дозволете пристап до локацијата за да ја поставите пријавата на мапа.',
        )
        setLocating(false)
        return
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })

      // Reverse geocode
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      if (geocode.length > 0) {
        const g = geocode[0]
        setAddress(
          [g.street, g.streetNumber, g.city].filter(Boolean).join(' '),
        )
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Не може да се земе локацијата' })
    } finally {
      setLocating(false)
    }
  }

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Камера', 'Дозволете пристап до камерата.')
      return
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (!result.canceled) {
      setImage(result.assets[0])
      setStep('location')
    }
  }

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert('Галерија', 'Дозволете пристап до галеријата.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    })
    if (!result.canceled) {
      setImage(result.assets[0])
      setStep('location')
    }
  }

  const skipPhoto = () => setStep('location')

  const confirmLocation = () => {
    if (!location) {
      Toast.show({ type: 'error', text1: 'Прво земете локација' })
      return
    }
    setStep('form')
  }

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!title.validateField()) return

      const formData = new FormData()
      formData.append('title', title.value)
      formData.append('description', description.value)
      formData.append('latitude', String(location!.latitude))
      formData.append('longitude', String(location!.longitude))
      formData.append('municipality_id', String(municipalityId))
      if (address) formData.append('address', address)

      if (image) {
        const uri = image.uri
        const filename = uri.split('/').pop() || 'photo.jpg'
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : 'image/jpeg'
        formData.append('image', { uri, name: filename, type } as any)
      }

      return submitReport(formData)
    },
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'Пријавата е поднесена! ✓',
        text2: 'Ви благодариме за вашата пријава.',
      })
      queryClient.invalidateQueries({ queryKey: ['reports-map'] })
      queryClient.invalidateQueries({ queryKey: ['my-reports'] })
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

  const goBack = () => {
    if (step === 'location') setStep('photo')
    else if (step === 'form') setStep('location')
    else navigation.goBack()
  }

  return {
    step,
    image,
    location,
    address,
    locating,
    title,
    description,
    pickFromCamera,
    pickFromGallery,
    skipPhoto,
    getLocation,
    confirmLocation,
    goBack,
    handleSubmit: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
  }
}