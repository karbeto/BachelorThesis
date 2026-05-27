import React from 'react'
import { View, Text } from 'react-native'
import { STATUS_COLORS } from '../logic'

const LEGEND_ITEMS = [
  { status: 'submitted', label: 'Поднесено' },
  { status: 'in_progress', label: 'Се решава' },
  { status: 'resolved', label: 'Решено' },
]

interface MapLegendProps {
  styles: any;
}

export const MapLegend: React.FC<MapLegendProps> = ({ styles }) => (
  <View style={styles.legend}>
    {LEGEND_ITEMS.map((item) => (
      <View key={item.status} style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[item.status] }]} />
        <Text style={styles.legendText}>{item.label}</Text>
      </View>
    ))}
  </View>
)