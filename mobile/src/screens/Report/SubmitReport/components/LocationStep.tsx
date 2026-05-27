import React from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'

interface LocationStepProps {
  location: any
  locating: boolean
  address: string
  locationMapHtml: string
  theme: any
  styles: any
  getLocation: () => void
  confirmLocation: () => void
}

export const LocationStep: React.FC<LocationStepProps> = ({
  location,
  locating,
  address,
  locationMapHtml,
  theme,
  styles,
  getLocation,
  confirmLocation,
}) => {
  return (
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

        <TouchableOpacity style={styles.reLocateBtn} onPress={getLocation} disabled={locating} activeOpacity={0.8}>
          {locating ? (
            <ActivityIndicator size="small" color={theme.colors.text} />
          ) : (
            <Ionicons name="refresh" size={16} color={theme.colors.text} />
          )}
          <Text style={styles.reLocateText}>{locating ? 'Се бара...' : 'Земи локација повторно'}</Text>
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
  )
}