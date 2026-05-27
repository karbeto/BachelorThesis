import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface PhotoStepProps {
  image: any
  theme: any
  styles: any
  pickFromCamera: () => void
  pickFromGallery: () => void
  skipPhoto: () => void
}

export const PhotoStep: React.FC<PhotoStepProps> = ({
  image,
  theme,
  styles,
  pickFromCamera,
  pickFromGallery,
  skipPhoto,
}) => {
  return (
    <View style={styles.photoContent}>
      <View style={styles.photoPreview}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.photoImage} resizeMode="cover" />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.photoPlaceholderText}>
              Сликајте го проблемот{'\n'}или изберете од галеријата
            </Text>
          </View>
        )}
      </View>

      <View style={styles.photoActions}>
        <TouchableOpacity style={styles.photoBtn} onPress={pickFromCamera} activeOpacity={0.85}>
          <Ionicons name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.photoBtnText}>Сликај</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.photoBtn, styles.photoBtnOutline]} onPress={pickFromGallery} activeOpacity={0.85}>
          <Ionicons name="images-outline" size={20} color={theme.colors.text} />
          <Text style={[styles.photoBtnText, styles.photoBtnTextOutline]}>Избери од галерија</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={skipPhoto} activeOpacity={0.7}>
          <Text style={styles.skipText}>Продолжи без фото</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}