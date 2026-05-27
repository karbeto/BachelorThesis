import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useSubmitReportLogic, SubmitStep } from './logic'

// Isolated Step Components
import { PhotoStep } from './components/PhotoStep'
import { LocationStep } from './components/LocationStep'
import { FormStep } from './components/FormStep'

const STEPS: { key: SubmitStep; label: string }[] = [
  { key: 'photo', label: 'Фото' },
  { key: 'location', label: 'Локација' },
  { key: 'form', label: 'Форма' },
]

function StepIndicator({ current, styles }: { current: SubmitStep; styles: any }) {
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
                isDone ? styles.stepCircleDone : isActive ? styles.stepCircleActive : styles.stepCircleInactive,
              ]}>
                {isDone ? <Ionicons name="checkmark" size={13} color="#FFFFFF" /> : <Text style={styles.stepNumber}>{i + 1}</Text>}
              </View>
              <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{step.label}</Text>
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
          var map = L.map('map', { zoomControl: false, dragging: false, touchZoom: false, doubleClickZoom: false, scrollWheelZoom: false }).setView([${location.latitude}, ${location.longitude}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
          L.circleMarker([${location.latitude}, ${location.longitude}], { radius: 10, fillColor: '${theme.colors.accent}', color: '#FFFFFF', weight: 2, fillOpacity: 0.9 }).addTo(map);
        </script>
      </body>
      </html>
    `
  }, [location, theme.colors.accent])

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Structural Header Section Wrapper */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 'photo' ? 'Додај фотографија' : step === 'location' ? 'Потврди локација' : 'Детали за пријавата'}
        </Text>
      </View>

      <StepIndicator current={step} styles={styles} />

      {/* Conditional Multi-Step Content View Routing */}
      {step === 'photo' && (
        <PhotoStep
          image={image}
          theme={theme}
          styles={styles}
          pickFromCamera={pickFromCamera}
          pickFromGallery={pickFromGallery}
          skipPhoto={skipPhoto}
        />
      )}

      {step === 'location' && (
        <LocationStep
          location={location}
          locating={locating}
          address={address}
          locationMapHtml={locationMapHtml}
          theme={theme}
          styles={styles}
          getLocation={getLocation}
          confirmLocation={confirmLocation}
        />
      )}

      {step === 'form' && (
        <FormStep
          image={image}
          title={title}
          description={description}
          titleFocused={titleFocused}
          setTitleFocused={setTitleFocused}
          descFocused={descFocused}
          setDescFocused={setDescFocused}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          theme={theme}
          styles={styles}
        />
      )}
    </View>
  )
}