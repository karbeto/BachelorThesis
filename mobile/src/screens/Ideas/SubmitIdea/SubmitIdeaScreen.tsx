import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useSubmitIdeaLogic } from './logic'
import { FormInput } from './components/FormInput'

export default function SubmitIdeaScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  
  const {
    title,
    description,
    handleSubmit,
    isSubmitting,
    goBack,
  } = useSubmitIdeaLogic()

  return (
    <View style={styles.container}>
      {/* Structural Header View Frame */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Нова идеја</Text>
      </View>

      {/* Keyboard behavior management wraps the scroll field body seamlessly */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Info Banner Details Card */}
          <View style={styles.infoCard}>
            <Ionicons name="bulb" size={18} color={theme.colors.accent} />
            <Text style={styles.infoText}>
              Предложете подобрување за вашето маало. Другите граѓани можат да гласаат за вашата идеја и општината ќе ги земе во предвид најпопуларните предлози.
            </Text>
          </View>

          <FormInput
            label="Наслов *"
            fieldState={title}
            styles={styles}
            theme={theme}
            placeholder="пр. Лулашки во паркот на плоштадот"
            maxLength={255}
          />

          <FormInput
            label="Опис *"
            fieldState={description}
            styles={styles}
            theme={theme}
            placeholder="Опишете ја вашата идеја подетално..."
            maxLength={2000}
            isTextArea
            multiline
            numberOfLines={5}
          />

          <TouchableOpacity
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            activeOpacity={0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitBtnText}>Поднеси идеја</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}