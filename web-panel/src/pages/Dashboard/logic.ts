import { useQuery } from '@tanstack/react-query';
import { getStats, getHeatmap } from '../../api/dashboard';
import { getReports } from '../../api/reports';

export function useDashboardLogic() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getStats,
  });

  const { data: heatmap } = useQuery({
    queryKey: ['dashboard-heatmap'],
    queryFn: getHeatmap,
  });

  const { data: recentReports } = useQuery({
    queryKey: ['recent-reports'],
    queryFn: () => getReports({ limit: 6 }),
  });

  const categoryData = stats?.by_category?.map((c: any) => ({
    name: c.category_name,
    count: c.count,
  })) || [];

  const mapCenter: [number, number] = heatmap?.length > 0
    ? [heatmap[0].latitude, heatmap[0].longitude]
    : [41.715, 21.773];

  const formattedDate = new Date().toLocaleDateString('mk-MK', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return {
    stats,
    statsLoading,
    heatmap,
    recentReports,
    categoryData,
    mapCenter,
    formattedDate
  };
}