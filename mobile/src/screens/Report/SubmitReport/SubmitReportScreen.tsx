import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import React, { useState, useMemo } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useSubmitReportLogic, SubmitStep } from './logic'

const STEPS: { key: SubmitStep; label: string }[] = [
  { key: 'photo', label: 'Фото' },
  { key: 'location', label: 'Локација' },
  { key: 'form', label: 'Форма' },
]

function StepIndicator({
  current,
  styles,
  theme,
}: {
  current: SubmitStep
  styles: any
  theme: any
}) {
  const currentIndex = STEPS.findIndex((s) => s.key === current)
  return (
    <View style={styles.stepWrap}>
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = i === currentIndex
        return (
          <View key={step.key} style={{ flexDirection: 'row', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <View style={styles.stepItem}>
              <View style={[
                styles.stepCircle,
                isDone
                  ? styles.stepCircleDone
                  : isActive
                  ? styles.stepCircleActive
                  : styles.stepCircleInactive,
              ]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={13} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                isActive && styles.stepLabelActive,
              ]}>
                {step.label}
              </Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, { flex: 1, marginHorizontal: 8 }, isDone && styles.stepLineDone]} />
            )}
          </View>
        )
      })}
    </View>
  )
}

export default function SubmitReportScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
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
    handleSubmit,
    isSubmitting,
  } = useSubmitReportLogic()

  const [titleFocused, setTitleFocused] = useState(false)
  const [descFocused, setDescFocused] = useState(false)

  // Memoize the submission preview map source frame using targeted coordinates
  const locationMapHtml = useMemo(() => {
    if (!location) return ''
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; background-color: #E5E7EB; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { 
            zoomControl: false,
            dragging: false,
            touchZoom: false,
            doubleClickZoom: false,
            scrollWheelZoom: false
          }).setView([${location.latitude}, ${location.longitude}], 15);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          L.circleMarker([${location.latitude}, ${location.longitude}], {
            radius: 10,
            fillColor: '${theme.colors.accent}',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 0.9
          }).addTo(map);
        </script>
      </body>
      </html>
    `
  }, [location, theme.colors.accent])

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={goBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 'photo'
            ? 'Додај фотографија'
            : step === 'location'
            ? 'Потврди локација'
            : 'Детали за пријавата'}
        </Text>
      </View>

      {/* Step indicator */}
      <StepIndicator current={step} styles={styles} theme={theme} />

      {/* ── STEP 1: Photo ── */}
      {step === 'photo' && (
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
            <TouchableOpacity
              style={styles.photoBtn}
              onPress={pickFromCamera}
              activeOpacity={0.85}
            >
              <Ionicons name="camera" size={20} color="#FFFFFF" />
              <Text style={styles.photoBtnText}>Сликај</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.photoBtn, styles.photoBtnOutline]}
              onPress={pickFromGallery}
              activeOpacity={0.85}
            >
              <Ionicons name="images-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.photoBtnText, styles.photoBtnTextOutline]}>
                Избери од галерија
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipBtn}
              onPress={skipPhoto}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Продолжи без фото</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── STEP 2: Location ── */}
      {step === 'location' && (
        <View style={styles.locationContent}>
          {location ? (
            <View style={styles.mapPreview}>
              <WebView
                originWhitelist={['*']}
                source={{ html: locationMapHtml }}
                style={{ flex: 1 }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                scrollEnabled={false}
              />
            </View>
          ) : (
            <View style={[styles.mapPreview, {
              backgroundColor: theme.colors.surfaceVariant,
              alignItems: 'center',
              justifyContent: 'center',
            }]}>
              {locating ? (
                <ActivityIndicator color={theme.colors.accent} size="large" />
              ) : (
                <Ionicons name="location-outline" size={48} color={theme.colors.textSecondary} />
              )}
            </View>
          )}

          <View style={styles.locationInfo}>
            <View style={styles.locationCard}>
              <View style={styles.locationIconWrap}>
                <Ionicons name="location" size={20} color={theme.colors.accent} />
              </View>
              <View style={styles.locationText}>
                <Text style={styles.locationLabel}>Детектирана локација</Text>
                <Text style={styles.locationValue} numberOfLines={2}>
                  {locating
                    ? 'Се бара локација...'
                    : location
                    ? address || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                    : 'Локацијата не е земена'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.reLocateBtn}
              onPress={getLocation}
              disabled={locating}
              activeOpacity={0.8}
            >
              {locating ? (
                <ActivityIndicator size="small" color={theme.colors.text} />
              ) : (
                <Ionicons name="refresh" size={16} color={theme.colors.text} />
              )}
              <Text style={styles.reLocateText}>
                {locating ? 'Се бара...' : 'Земи локација повторно'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmBtn, !location && { opacity: 0.5 }]}
              onPress={confirmLocation}
              disabled={!location || locating}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmBtnText}>Потврди локација</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── STEP 3: Form ── */}
      {step === 'form' && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Photo thumbnail */}
            {image && (
              <Image
                source={{ uri: image.uri }}
                style={styles.imageThumbnail}
                resizeMode="cover"
              />
            )}

            {/* Title */}
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
              {title.error && (
                <Text style={styles.errorText}>{title.error}</Text>
              )}
            </View>

            {/* Description */}
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

            {/* AI Classification Note */}
            <View style={{
              flexDirection: 'row', // 👈 Fixed: changed from flex: 'row'
              alignItems: 'flex-start',
              gap: 10,
              padding: 12,
              backgroundColor: theme.colors.accent + '15',
              borderRadius: theme.borderRadius.medium,
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

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                isSubmitting && styles.submitBtnDisabled,
              ]}
              onPress={() => handleSubmit()}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>Поднеси пријава</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  )
}