import React from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface RatingModalProps {
  visible: boolean
  onClose: () => void
  rating: number
  setRating: (r: number) => void
  comment: string
  setComment: (t: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  styles: any
  theme: any
}

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  onSubmit,
  isSubmitting,
  styles,
  theme,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Оцени ја пријавата</Text>
          <Text style={styles.modalSubtitle}>Дали проблемот е навистина решен?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starBtn}
                onPress={() => setRating(star)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={36}
                  color={star <= rating ? '#F59E0B' : theme.colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="Оставете коментар (опционално)..."
            placeholderTextColor={theme.colors.textSecondary}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Откажи</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, rating === 0 && { opacity: 0.5 }]}
              onPress={onSubmit}
              disabled={rating === 0 || isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Зачувај</Text>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}