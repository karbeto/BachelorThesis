import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, Modal } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import { useReportDetailLogic } from './logic'
import { RatingModal } from './components/RatingModal'
import { STATUS_MK, STATUS_COLORS, DEFAULT_STATUS_THEME } from '../../../constants/statusConfig'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ReportDetailScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    report,
    isLoading,
    hasVoted,
    rating,
    setRating,
    ratingComment,
    setRatingComment,
    ratingModal,
    imageModal,
    selectedImage,
    openImage,
    closeImage,
    canRate,
    handleVote,
    handleRating,
    isVoting,
    isRating,
    goBack,
  } = useReportDetailLogic()

  const staticMapHtml = useMemo(() => {
    if (!report || report.latitude == null || report.longitude == null) return ''
    const markerColor = (STATUS_COLORS[report.status] || DEFAULT_STATUS_THEME).color

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>html, body, #map { height: 100%; margin: 0; padding: 0; background-color: #E5E7EB; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false, dragging: false, touchZoom: false, doubleClickZoom: false, scrollWheelZoom: false }).setView([${report.latitude}, ${report.longitude}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
          L.circleMarker([${report.latitude}, ${report.longitude}], { radius: 10, fillColor: '${markerColor}', color: '#FFFFFF', weight: 2, fillOpacity: 0.9 }).addTo(map);
        </script>
      </body>
      </html>
    `
  }, [report])

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    )
  }

  if (!report) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={{ color: theme.colors.textSecondary }}>Пријавата не е пронајдена</Text>
      </View>
    )
  }

  const statusStyle = STATUS_COLORS[report.status] || DEFAULT_STATUS_THEME
  const hasLocation = report.latitude != null && report.longitude != null

  return (
    <View style={styles.container}>
      {/* Structural Action Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Пријава #{report.id}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Core Metadata Card */}
        <View style={styles.titleCard}>
          <View style={styles.titleRow}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>{STATUS_MK[report.status] || report.status}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={13} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{new Date(report.created_at).toLocaleDateString('mk-MK')}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="thumbs-up-outline" size={13} color={theme.colors.textSecondary} />
              <Text style={styles.metaText}>{report.vote_count ?? 0} гласови</Text>
            </View>
            {report.is_duplicate && (
              <View style={styles.dupBadge}>
                <Ionicons name="copy-outline" size={11} color={theme.colors.error} />
                <Text style={styles.dupText}>Дупликат</Text>
              </View>
            )}
          </View>
        </View>

        {/* Textual Description Section */}
        {report.description && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Опис</Text>
            <Text style={styles.descText}>{report.description}</Text>
          </View>
        )}

        {/* Geolocation Section */}
        {hasLocation && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Локација</Text>
            <View style={styles.mapWrap}>
              <WebView originWhitelist={['*']} source={{ html: staticMapHtml }} style={styles.map} scrollEnabled={false} />
            </View>
            {report.address && (
              <View style={styles.addressRow}>
                <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={styles.addressText}>{report.address}</Text>
              </View>
            )}
          </View>
        )}

        {/* Attachments Carousel Section */}
        {report.images?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Фотографии</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScroll}>
              {report.images.map((img: any) => (
                <TouchableOpacity key={img.id} onPress={() => openImage(`${BASE_URL}${img.image_url}`)} activeOpacity={0.85}>
                  <Image source={{ uri: `${BASE_URL}${img.image_url}` }} style={styles.imageThumb} resizeMode="cover" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Interactive Engagement Toggles */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={[styles.voteBtn, hasVoted && styles.voteBtnActive]} onPress={handleVote} disabled={isVoting} activeOpacity={0.8}>
            {isVoting ? (
              <ActivityIndicator size="small" color={theme.colors.accent} />
            ) : (
              <>
                <Ionicons name={hasVoted ? 'thumbs-up' : 'thumbs-up-outline'} size={18} color={hasVoted ? theme.colors.accent : theme.colors.text} />
                <Text style={[styles.voteBtnText, hasVoted && styles.voteBtnTextActive]}>{hasVoted ? 'Гласано' : 'Гласај'}</Text>
              </>
            )}
          </TouchableOpacity>

          {canRate && (
            <TouchableOpacity style={styles.rateBtn} onPress={ratingModal.open} activeOpacity={0.85}>
              <Ionicons name="star-outline" size={18} color="#FFFFFF" />
              <Text style={styles.rateBtnText}>Оцени</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Extracted Rating overlay sheet handler */}
      <RatingModal
        visible={ratingModal.visible}
        onClose={ratingModal.close}
        rating={rating}
        setRating={setRating}
        comment={ratingComment}
        setComment={setRatingComment}
        onSubmit={handleRating}
        isSubmitting={isRating}
        styles={styles}
        theme={theme}
      />

      {/* Media lightbox modal */}
      <Modal visible={imageModal.visible} transparent animationType="fade" onRequestClose={closeImage}>
        <View style={styles.imageOverlay}>
          <TouchableOpacity style={styles.closeImageBtn} onPress={closeImage} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />}
        </View>
      </Modal>
    </View>
  )
}