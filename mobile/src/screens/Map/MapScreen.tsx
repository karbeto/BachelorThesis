import React, { useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../context/ThemeContext'
import { createStyles } from './style'
import {
  useMapLogic,
  STATUS_COLORS,
  STATUS_MK,
} from './logic'

const FILTER_OPTIONS = [
  { value: '', label: 'Сите пријави' },
  { value: 'submitted', label: 'Поднесено' },
  { value: 'in_progress', label: 'Се решава' },
  { value: 'resolved', label: 'Решено' },
  { value: 'rejected', label: 'Одбиено' },
]

const LEGEND_ITEMS = [
  { status: 'submitted', label: 'Поднесено' },
  { status: 'in_progress', label: 'Се решава' },
  { status: 'resolved', label: 'Решено' },
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

  const mapHtml = useMemo(() => {
    const markersScript = reports
      .map((report: any) => {
        const markerColor = STATUS_COLORS[report.status] || '#94A3B8'
        return `
          var marker = L.circleMarker([${report.latitude}, ${report.longitude}], {
            radius: 10,
            fillColor: '${markerColor}',
            color: '#FFFFFF',
            weight: 2,
            fillOpacity: 0.9
          }).addTo(map);
          
          marker.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ id: "${report.id}" }));
          });
        `
      })
      .join('\n')

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
          // Set initial view focusing on Macedonia regions
          var map = L.map('map', { zoomControl: false }).setView([41.715, 21.773], 13);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);

          ${markersScript}
        </script>
      </body>
      </html>
    `
  }, [reports])

  const handleMapMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data && data.id) {
        const foundReport = reports.find((r: any) => String(r.id) === String(data.id))
        if (foundReport) {
          handleMarkerPress(foundReport)
        }
      }
    } catch (e) {
      console.warn("Error parsing map click action data:", e)
    }
  }

  return (
    <View style={styles.container}>
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
          style={[
            styles.filterBtn,
            showFilters && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="filter"
            size={18}
            color={showFilters ? '#FFFFFF' : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filterDropdown}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.filterItem,
                filterStatus === opt.value && styles.filterItemActive,
              ]}
              onPress={() => handleFilterChange(opt.value)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.filterDot,
                {
                  backgroundColor: opt.value
                    ? STATUS_COLORS[opt.value]
                    : theme.colors.textSecondary,
                },
              ]} />
              <Text style={[
                styles.filterText,
                filterStatus === opt.value && styles.filterTextActive,
              ]}>
                {opt.label}
              </Text>
              {filterStatus === opt.value && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={theme.colors.primary}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {!selectedReport && (
        <View style={styles.legend}>
          {LEGEND_ITEMS.map((item) => (
            <View key={item.status} style={styles.legendItem}>
              <View style={[
                styles.legendDot,
                { backgroundColor: STATUS_COLORS[item.status] },
              ]} />
              <Text style={styles.legendText}>{item.label}</Text>
            </View>
          ))}
        </View>
      )}

      {selectedReport && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {selectedReport.title}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleCardClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {selectedReport.description && (
            <Text style={styles.cardDesc} numberOfLines={2}>
              {selectedReport.description}
            </Text>
          )}

          <View style={styles.cardFooter}>
            <View style={[
              styles.statusBadge,
              {
                backgroundColor:
                  STATUS_COLORS[selectedReport.status] + '18',
              },
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: STATUS_COLORS[selectedReport.status] },
              ]} />
              <Text style={[
                styles.statusText,
                { color: STATUS_COLORS[selectedReport.status] },
              ]}>
                {STATUS_MK[selectedReport.status]}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={handleCardPress}
              activeOpacity={0.85}
            >
              <Text style={styles.detailsBtnText}>Детали</Text>
              <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={handleSubmitPress}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}