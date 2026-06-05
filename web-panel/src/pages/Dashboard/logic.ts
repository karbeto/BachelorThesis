import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getStats, getHeatmap } from '../../api/dashboard';
import { getReports } from '../../api/reports';

export interface DashboardStat {
  total: number;
  submitted: number;
  in_progress: number;
  resolved: number;
  rejected: number;
}

export interface CategoryStat {
  category_name: string;
  count: number;
}

export interface HeatmapPoint {
  report_id: number;
  latitude: number;
  longitude: number;
}

export interface RecentReportItem {
  id: number;
  title: string;
  category_id: number;
  category_name?: string;
  status: string;
  created_at: string;
}

export function useDashboardLogic() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
  });

  const { data: heatmap } = useQuery<HeatmapPoint[]>({
    queryKey: ['dashboard-heatmap'],
    queryFn: getHeatmap,
  });

  const { data: recentReports, isLoading: reportsLoading } = useQuery<RecentReportItem[]>({
    queryKey: ['recent-reports'],
    queryFn: () => getReports({ limit: 6 }),
  });

  // Prevent recreation of arrays on arbitrary UI state changes
  const categoryData = useMemo(() => {
    return stats?.by_category?.map((c: CategoryStat) => ({
      name: c.category_name,
      count: c.count,
    })) || [];
  }, [stats]);

  // Adjust center dynamically when heatmap records arrive
  const mapCenter = useMemo((): [number, number] => {
    if (heatmap && heatmap.length > 0) {
      return [heatmap[0].latitude, heatmap[0].longitude];
    }
    return [41.715, 21.773]; // Fallback to Veles coordinates
  }, [heatmap]);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString('mk-MK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const handleRowClick = (id: number) => {
    navigate(`/reports/${id}`);
  };

  return {
    stats,
    statsLoading,
    reportsLoading,
    heatmap,
    recentReports,
    categoryData,
    mapCenter,
    formattedDate,
    handleRowClick,
  };
}