import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { getReports } from '../../api/reports';

export const STATUS_COLORS: Record<string, string> = {
  submitted: '#F59E0B',
  in_progress: '#38BDF8',
  resolved: '#22C55E',
  rejected: '#EF4444',
};

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
};

export const CATEGORY_ICONS: Record<string, string> = {
  default: '📍',
  'Дупки на патот': '🕳️',
  'Ѓубре': '🗑️',
  'Осветлување': '💡',
  'Паркирање': '🚗',
  'Оштетена инфраструктура': '🔧',
};

export interface DeviceLocation {
  latitude: number;
  longitude: number;
}

export function useMapLogic() {
  const navigation = useNavigation<any>();
  const mapRef = useRef<any>(null);

  // Core Map UI States
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<DeviceLocation | null>(null);

  // 1. Fetch Geolocation Data on Load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Map tracking location fetch skipped/unresolved:', error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // 2. Fetch Active Map Report Collection
  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['reports-map', filterStatus],
    queryFn: () =>
      getReports({
        limit: 100,
        ...(filterStatus && { status: filterStatus }),
      }),
  });

  // 3. Defensive Array Computations
  const validReports = useMemo(() => {
    if (!Array.isArray(reports)) return [];
    return reports.filter((r: any) => r.latitude != null && r.longitude != null);
  }, [reports]);

  // 4. Inter-process Communication Lookup (Bridge Resolver)
  const handleWebViewMessage = (payloadString: string) => {
    try {
      const data = JSON.parse(payloadString);
      if (data?.id) {
        // Resolve target report details locally from memory cache array
        const matchedReport = validReports.find((r: any) => String(r.id) === String(data.id));
        if (matchedReport) {
          setSelectedReport(matchedReport);
        }
      }
    } catch (e) {
      console.error('Failed processing Webview Map interaction layer message:', e);
    }
  };

  // 5. Layout Interaction Handlers
  const handleCardClose = () => {
    setSelectedReport(null);
  };

  const handleCardPress = () => {
    if (selectedReport) {
      navigation.navigate('ReportDetail', { id: selectedReport.id });
      setSelectedReport(null);
    }
  };

  const handleSubmitPress = () => {
    navigation.navigate('SubmitReport');
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setShowFilters(false);
  };

  return {
    mapRef,
    reports: validReports,
    userLocation,
    isLoading,
    refetch,
    selectedReport,
    filterStatus,
    showFilters,
    setShowFilters,
    handleWebViewMessage,
    handleCardClose,
    handleCardPress,
    handleSubmitPress,
    handleFilterChange,
  };
}