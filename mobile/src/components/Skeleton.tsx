import React, { useEffect, useRef } from 'react'
import { Animated, DimensionValue, ViewStyle } from 'react-native'
import { useTheme } from '../context/ThemeContext'

interface SkeletonProps {
  width: DimensionValue
  height: DimensionValue
  borderRadius?: number
  style?: ViewStyle
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width, 
  height, 
  borderRadius = 8, 
  style 
}) => {
  const { theme } = useTheme()
  const pulseAnim = useRef(new Animated.Value(0.12)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.25,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.12,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [pulseAnim])

  const animatedStyle: ViewStyle = {
    width: width as any,
    height: height as any,
    borderRadius,
    backgroundColor: theme.colors.text,
    opacity: pulseAnim as any,
  }

  return (
    <Animated.View style={[animatedStyle, style]} />
  )
}