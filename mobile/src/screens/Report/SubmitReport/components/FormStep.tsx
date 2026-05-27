import React from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface FormStepProps {
  image: any
  title: any
  description: any
  titleFocused: boolean
  setTitleFocused: (f: boolean) => void
  descFocused: boolean
  setDescFocused: (f: boolean) => void
  isSubmitting: boolean
  handleSubmit: () => void
  theme: any
  styles: any
}

export const FormStep: React.FC<FormStepProps> = ({
  image,
  title,
  description,
  titleFocused,
  setTitleFocused,
  descFocused,
  setDescFocused,
  isSubmitting,
  handleSubmit,
  theme,
  styles,
}) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.formScroll}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {image && (
          <Image source={{ uri: image.uri }} style={styles.imageThumbnail} resizeMode="cover" />
        )}

        {/* Title Input */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Наслов *</Text>
          <View style={[
            styles.inputRow,
            titleFocused && styles.inputRowFocused,
            title.error && styles.inputRowError,
          ]}>
            <TextInput
              style={styles.input}
              placeholder="пр. Дупка на улица Маршал Тито"
              placeholderTextColor={theme.colors.textSecondary}
              value={title.value}
              onChangeText={title.onChange}
              onFocus={() => setTitleFocused(true)}
              onBlur={() => setTitleFocused(false)}
              maxLength={255}
            />
          </View>
          {title.error && <Text style={styles.errorText}>{title.error}</Text>}
        </View>

        {/* Description Input */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Опис (опционално)</Text>
          <View style={[
            styles.inputRow,
            styles.textAreaWrap,
            descFocused && styles.inputRowFocused,
          ]}>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Опишете го проблемот подетално..."
              placeholderTextColor={theme.colors.textSecondary}
              value={description.value}
              onChangeText={description.onChange}
              onFocus={() => setDescFocused(true)}
              onBlur={() => setDescFocused(false)}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>
        </View>

        {/* AI Tagging Banner */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: 10,
          padding: 12,
          backgroundColor: theme.colors.accent + '15',
          borderRadius: theme.borderRadius.medium,
          marginBottom: 16, // Clean spacing allocation
        }}>
          <Ionicons name="sparkles" size={16} color={theme.colors.accent} style={{ marginTop: 1 }} />
          <Text style={{
            ...theme.typography.small,
            color: theme.colors.text,
            flex: 1,
            lineHeight: 18,
          }}>
            Категоријата ќе биде автоматски одредена од AI врз основа на вашата фотографија и опис.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Поднеси пријава</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}