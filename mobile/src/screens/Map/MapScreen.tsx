import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import MapView, { Marker, Callout, UrlTile } from 'react-native-maps'
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

const DEFAULT_REGION = {
  latitude: 41.715,
  longitude: 21.773,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
}

export default function MapScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    mapRef,
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

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* OpenStreetMap tiles */}
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />

        {/* Report markers */}
        {reports.map((report: any) => (
          <Marker
            key={report.id}
            coordinate={{
              latitude: report.latitude,
              longitude: report.longitude,
            }}
            onPress={() => handleMarkerPress(report)}
            pinColor={STATUS_COLORS[report.status] || '#94A3B8'}
          />
        ))}
      </MapView>

      {/* Top bar */}
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

      {/* Filter dropdown */}
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

      {/* Legend — only when no card shown */}
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

      {/* Selected report card */}
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

      {/* FAB — submit report */}
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