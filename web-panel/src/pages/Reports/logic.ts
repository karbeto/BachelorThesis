import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getReports, updateReportStatus } from '../../api/reports';
import { getCategories } from '../../api/categories';
import toast from 'react-hot-toast';

export interface Filters {
  status: string;
  category_id: string;
  skip: number;
  limit: number;
}

export function useReportsLogic() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<Filters>({
    status: '',
    category_id: '',
    skip: 0,
    limit: 20,
  });

  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [statusNote, setStatusNote] = useState('');
  const [newStatus, setNewStatus] = useState('');

  // Extract logged-in admin's authorization boundaries
  const profile = useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.user || parsed;
    } catch (e) {
      return null;
    }
  }, []);

  const isSuperAdmin = profile?.role === "superadmin";
  const municipalityId = profile?.municipality_id;

  // Primary isolated query hook
  const { data: reports, isLoading } = useQuery({
    queryKey: ['reports', filters, isSuperAdmin ? 'global' : municipalityId], // ◄— Segmented Cache
    queryFn: () =>
      getReports({
        ...(filters.status && { status: filters.status }),
        ...(filters.category_id && { category_id: filters.category_id }),
        skip: filters.skip,
        limit: filters.limit,
        ...(!isSuperAdmin && { municipality_id: municipalityId }), // ◄— Tenancy Filter Applied
      }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, note }: { id: number; status: string; note?: string }) =>
      updateReportStatus(id, status, note),
    onSuccess: () => {
      toast.success('Статусот е успешно ажуриран');
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при ажурирање');
    },
  });

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error('Изберете нов статус');
      return;
    }
    statusMutation.mutate({
      id: selectedReport.id,
      status: newStatus,
      note: statusNote || undefined,
    });
  };

  const handleFilterChange = (key: 'status' | 'category_id', value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, skip: 0 }));
  };

  const handleNextPage = () => {
    setFilters((prev) => ({ ...prev, skip: prev.skip + prev.limit }));
  };

  const handlePrevPage = () => {
    setFilters((prev) => ({ ...prev, skip: Math.max(0, prev.skip - prev.limit) }));
  };

  const openReport = (report: any) => {
    navigate(`/reports/${report.id}`);
  };

  const openStatusModal = (e: React.MouseEvent, report: any) => {
    e.stopPropagation();
    setSelectedReport(report);
    setNewStatus(report.status);
    setStatusNote('');
  };

  const closeModal = () => {
    setSelectedReport(null);
    setStatusNote('');
    setNewStatus('');
  };

  return {
    reports,
    isLoading,
    categories,
    filters,
    selectedReport,
    statusNote,
    newStatus,
    setStatusNote,
    setNewStatus,
    handleFilterChange,
    handleStatusUpdate,
    handleNextPage,
    handlePrevPage,
    openReport,
    openStatusModal,
    closeModal,
    isUpdating: statusMutation.isPending,
  };
}