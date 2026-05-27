import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { STATUS_COLORS, STATUS_MK } from '../logic'

interface ReportPreviewCardProps {
  report: any;
  onClose: () => void;
  onPress: () => void;
  theme: any;
  styles: any;
}

export const ReportPreviewCard: React.FC<ReportPreviewCardProps> = ({
  report,
  onClose,
  onPress,
  theme,
  styles,
}) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {report.title}
      </Text>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
        <Ionicons name="close" size={14} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>

    {report.description && (
      <Text style={styles.cardDesc} numberOfLines={2}>
        {report.description}
      </Text>
    )}

    <View style={styles.cardFooter}>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[report.status] + '18' }]}>
        <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[report.status] }]} />
        <Text style={[styles.statusText, { color: STATUS_COLORS[report.status] }]}>
          {STATUS_MK[report.status]}
        </Text>
      </View>

      <TouchableOpacity style={styles.detailsBtn} onPress={onPress} activeOpacity={0.85}>
        <Text style={styles.detailsBtnText}>Детали</Text>
        <Ionicons name="arrow-forward" size={13} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </View>
)