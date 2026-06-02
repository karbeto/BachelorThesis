import { useState, useEffect } from 'react'
import { Alert, Platform } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { submitReport } from '../../../api/reports'
import { getMunicipalities } from '../../../api/municipalities'
import { useFormField } from '../../../utils/formHooks'
import { useNavigation } from '@react-navigation/native'
import Toast from 'react-native-toast-message'

export type SubmitStep = 'photo' | 'location' | 'form'

interface FormDataFile {
  uri: string
  name: string
  type: string
}

interface Municipality {
  id: number
  name: string
}

const validateTitle = (value: string) =>
  value.trim().length >= 3 ? undefined : 'Насловот мора да има минимум 3 карактери'

export function useSubmitReportLogic() {
  const navigation = useNavigation<any>()
  const queryClient = useQueryClient()

  // Fetch all municipalities from your backend
  const { data: municipalities } = useQuery<Municipality[]>({
    queryKey: ['municipalities'],
    queryFn: getMunicipalities,
  })

  const [step, setStep] = useState<SubmitStep>('photo')
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  } | null>(null)
  const [address, setAddress] = useState<string>('')
  
  // Base fallback ID (e.g., Skopje overall, or Centar)
  const [municipalityId, setMunicipalityId] = useState<number>(2) 
  const [locating, setLocating] = useState(false)

  const title = useFormField<string>('', validateTitle)
  const description = useFormField<string>('')

  useEffect(() => {
    if (step === 'location' && !location) {
      getLocation()
    }
  }, [step])

  // Helper function to normalize Macedonian cyrillic/latin variations if needed
  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Removes accents/diacritics (e.g., š -> s)
      .replace(/gj/g, 'g')
      .replace(/ch/g, 'c')
      .trim()
  }

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
      
      const currentCoords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      }
      
      setLocation(currentCoords)

      const geocode = await Location.reverseGeocodeAsync(currentCoords)
      if (geocode && geocode.length > 0) {
        const g = geocode[0]
        const computedAddress = [g.street, g.streetNumber, g.city]
          .filter(Boolean)
          .join(' ')
        
        setAddress(computedAddress || `${currentCoords.latitude.toFixed(5)}, ${currentCoords.longitude.toFixed(5)}`)
        
        // --- MULTI-MUNICIPALITY DETECTOR ---
        if (municipalities) {
          // Combine all potential spatial text fields into one searchable block
          const spatialPool = normalizeString(
            `${g.district || ''} ${g.subregion || ''} ${g.city || ''} ${g.street || ''}`
          )

          // Find which DB municipality name is mentioned inside our pool
          const matchedMun = municipalities.find((m) => {
            const normalizedDbName = normalizeString(m.name)
            return spatialPool.includes(normalizedDbName)
          })
          
          if (matchedMun) {
            setMunicipalityId(matchedMun.id)
          } else {
            // Fallback: If it's general "Skopje" but district didn't match, 
            // look for any catch-all Skopje entry in your database
            const skopjeFallback = municipalities.find(m => 
              normalizeString(m.name).includes('skopje')
            )
            if (skopjeFallback) setMunicipalityId(skopjeFallback.id)
          }
        }
        // ------------------------------------
      }
    } catch (error) {
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
    
    if (!result.canceled && result.assets?.[0]) {
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
    
    if (!result.canceled && result.assets?.[0]) {
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
      if (!title.validateField()) {
        throw new Error('Validation failed')
      }

      const formData = new FormData()
      formData.append('title', title.value.trim())
      formData.append('description', description.value.trim())
      formData.append('latitude', String(location!.latitude))
      formData.append('longitude', String(location!.longitude))
      formData.append('municipality_id', String(municipalityId))
      if (address) formData.append('address', address)

      if (image) {
        const uri = Platform.OS === 'android' ? image.uri : image.uri.replace('file://', '')
        const filename = image.uri.split('/').pop() || `report_${Date.now()}.jpg`
        
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : 'image/jpeg'
        
        formData.append('image', {
          uri,
          name: filename,
          type,
        } as unknown as Blob) 
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
      if (err.message === 'Validation failed') return

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