import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
} from 'react-native'
import MapView, { Marker, UrlTile } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../../../context/ThemeContext'
import { createStyles } from './style'
import {
  useReportDetailLogic,
  STATUS_MK,
  STATUS_COLORS,
} from './logic'

const BASE_URL = 'http://192.168.1.5:8000'

function StarRating({
  rating,
  onRate,
  theme,
  styles,
}: {
  rating: number
  onRate: (r: number) => void
  theme: any
  styles: any
}) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          style={styles.starBtn}
          onPress={() => onRate(star)}
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
  )
}

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
        <Text style={{ color: theme.colors.textSecondary }}>
          Пријавата не е пронајдена
        </Text>
      </View>
    )
  }

  const statusStyle = STATUS_COLORS[report.status] || {
    bg: '#F1F5F9',
    color: '#64748B',
  }
  const hasLocation = report.latitude != null && report.longitude != null

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          Пријава #{report.id}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title card */}
        <View style={styles.titleCard}>
          <View style={styles.titleRow}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.bg },
            ]}>
              <Text style={[styles.statusText, { color: statusStyle.color }]}>
                {STATUS_MK[report.status]}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons
                name="calendar-outline"
                size={13}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.metaText}>
                {new Date(report.created_at).toLocaleDateString('mk-MK')}
              </Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons
                name="thumbs-up-outline"
                size={13}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.metaText}>{report.vote_count ?? 0} гласови</Text>
            </View>

            {report.is_duplicate && (
              <View style={styles.dupBadge}>
                <Ionicons
                  name="copy-outline"
                  size={11}
                  color={theme.colors.error}
                />
                <Text style={styles.dupText}>Дупликат</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        {report.description && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Опис</Text>
            <Text style={styles.descText}>{report.description}</Text>
          </View>
        )}

        {/* Map */}
        {hasLocation && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Локација</Text>
            <View style={styles.mapWrap}>
              <MapView
                style={styles.map}
                region={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <UrlTile
                  urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
                  flipY={false}
                />
                <Marker
                  coordinate={{
                    latitude: report.latitude,
                    longitude: report.longitude,
                  }}
                  pinColor={statusStyle.color}
                />
              </MapView>
            </View>
            {report.address && (
              <View style={styles.addressRow}>
                <Ionicons
                  name="location-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.addressText}>{report.address}</Text>
              </View>
            )}
          </View>
        )}

        {/* Images */}
        {report.images?.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Фотографии</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScroll}
            >
              {report.images.map((img: any) => (
                <TouchableOpacity
                  key={img.id}
                  onPress={() => openImage(`${BASE_URL}${img.image_url}`)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: `${BASE_URL}${img.image_url}` }}
                    style={styles.imageThumb}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.voteBtn, hasVoted && styles.voteBtnActive]}
            onPress={handleVote}
            disabled={isVoting}
            activeOpacity={0.8}
          >
            {isVoting ? (
              <ActivityIndicator size="small" color={theme.colors.accent} />
            ) : (
              <>
                <Ionicons
                  name={hasVoted ? 'thumbs-up' : 'thumbs-up-outline'}
                  size={18}
                  color={hasVoted ? theme.colors.accent : theme.colors.text}
                />
                <Text style={[
                  styles.voteBtnText,
                  hasVoted && styles.voteBtnTextActive,
                ]}>
                  {hasVoted ? 'Гласано' : 'Гласај'}
                </Text>
              </>
            )}
          </TouchableOpacity>

          {canRate && (
            <TouchableOpacity
              style={styles.rateBtn}
              onPress={ratingModal.open}
              activeOpacity={0.85}
            >
              <Ionicons name="star-outline" size={18} color="#FFFFFF" />
              <Text style={styles.rateBtnText}>Оцени</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Rating modal */}
      <Modal
        visible={ratingModal.visible}
        transparent
        animationType="slide"
        onRequestClose={ratingModal.close}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={ratingModal.close}
        >
          <TouchableOpacity
            style={styles.modal}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Оцени ја пријавата</Text>
            <Text style={styles.modalSubtitle}>
              Дали проблемот е навистина решен?
            </Text>

            <StarRating
              rating={rating}
              onRate={setRating}
              theme={theme}
              styles={styles}
            />

            <TextInput
              style={styles.commentInput}
              placeholder="Оставете коментар (опционално)..."
              placeholderTextColor={theme.colors.textSecondary}
              value={ratingComment}
              onChangeText={setRatingComment}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={ratingModal.close}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Откажи</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.submitBtn, rating === 0 && { opacity: 0.5 }]}
                onPress={handleRating}
                disabled={rating === 0 || isRating}
                activeOpacity={0.85}
              >
                {isRating ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitBtnText}>Зачувај</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Full image modal */}
      <Modal
        visible={imageModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeImage}
      >
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={styles.closeImageBtn}
            onPress={closeImage}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  )
}