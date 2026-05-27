import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { createStyles } from './style'
import { useMapLogic, STATUS_COLORS } from './logic'
import { generateMapHtml } from '../../utils/mapTemplate'
import { MapLegend } from './components/MapLegend'
import { ReportPreviewCard } from './components/ReportPreviewCard'

const FILTER_OPTIONS = [
  { value: '', label: 'Сите пријави' },
  { value: 'submitted', label: 'Поднесено' },
  { value: 'in_progress', label: 'Се решава' },
  { value: 'resolved', label: 'Решено' },
  { value: 'rejected', label: 'Одбиено' },
]

export default function MapScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  
  const {
    reports,
    isLoading,
    selectedReport,
    filterStatus,
    showFilters,
    setShowFilters,
    handleMarkerPress,
    handleCardClose,
    handleCardPress,
    handleSubmitPress,
    handleFilterChange,
  } = useMapLogic()

  const mapHtml = useMemo(() => generateMapHtml(reports), [reports])

  const handleMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data?.id) {
        const foundReport = reports.find((r: any) => String(r.id) === String(data.id))
        if (foundReport) handleMarkerPress(foundReport)
      }
    } catch (e) {
      console.warn("Error parsing map click action data:", e)
    }
  }

  return (
    <View style={styles.container}>
      {/* WebView Container Layer */}
      <View style={styles.map}>
        <WebView
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          onMessage={handleMapMessage}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      {/* Top Header Floating Control Panel Bar */}
      <View style={styles.topBar}>
        <View style={styles.titlePill}>
          <Ionicons name="map" size={16} color={theme.colors.accent} />
          <Text style={styles.titleText}>Пријави во областа</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.accent} />
          ) : (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{reports.length}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, showFilters && { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <Ionicons name="filter" size={18} color={showFilters ? '#FFFFFF' : theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Conditional Filtering Action Dropdown Overlay */}
      {showFilters && (
        <View style={styles.filterDropdown}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.filterItem, filterStatus === opt.value && styles.filterItemActive]}
              onPress={() => handleFilterChange(opt.value)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.filterDot,
                { backgroundColor: opt.value ? STATUS_COLORS[opt.value] : theme.colors.textSecondary }
              ]} />
              <Text style={[styles.filterText, filterStatus === opt.value && styles.filterTextActive]}>
                {opt.label}
              </Text>
              {filterStatus === opt.value && (
                <Ionicons name="checkmark" size={14} color={theme.colors.primary} style={{ marginLeft: 'auto' }} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Floating Display Overlays (Legend OR Selected Detail Preview Card) */}
      {!selectedReport ? (
        <MapLegend styles={styles} />
      ) : (
        <ReportPreviewCard
          report={selectedReport}
          onClose={handleCardClose}
          onPress={handleCardPress}
          theme={theme}
          styles={styles}
        />
      )}

      {/* Action Submission Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleSubmitPress} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}