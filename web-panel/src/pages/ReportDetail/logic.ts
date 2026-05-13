import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReport, updateReportStatus, getReportHistory } from '../../api/reports'
import toast from 'react-hot-toast'

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
}

export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  submitted: { bg: '#FFFBEB', color: '#F59E0B' },
  in_progress: { bg: '#F0F9FF', color: '#38BDF8' },
  resolved: { bg: '#F0FDF4', color: '#22C55E' },
  rejected: { bg: '#FEF2F2', color: '#EF4444' },
}

export const STATUS_OPTIONS = [
  { value: 'submitted', label: 'Поднесено' },
  { value: 'in_progress', label: 'Се решава' },
  { value: 'resolved', label: 'Решено' },
  { value: 'rejected', label: 'Одбиено' },
]

export function useReportDetailLogic() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [modalOpen, setModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [statusNote, setStatusNote] = useState('')

  const { data: report, isLoading } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getReport(Number(id)),
    enabled: !!id,
  })

  const { data: history } = useQuery({
    queryKey: ['report-history', id],
    queryFn: () => getReportHistory(Number(id)),
    enabled: !!id,
  })

  const statusMutation = useMutation({
    mutationFn: ({ status, note }: { status: string; note?: string }) =>
      updateReportStatus(Number(id), status, note),
    onSuccess: () => {
      toast.success('Статусот е успешно ажуриран')
      queryClient.invalidateQueries({ queryKey: ['report', id] })
      queryClient.invalidateQueries({ queryKey: ['report-history', id] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      closeModal()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при ажурирање')
    },
  })

  const openModal = () => {
    setNewStatus(report?.status || '')
    setStatusNote('')
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setNewStatus('')
    setStatusNote('')
  }

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error('Изберете нов статус')
      return
    }
    statusMutation.mutate({
      status: newStatus,
      note: statusNote || undefined,
    })
  }

  const goBack = () => navigate('/reports')

  return {
    report,
    history,
    isLoading,
    modalOpen,
    newStatus,
    statusNote,
    setNewStatus,
    setStatusNote,
    openModal,
    closeModal,
    handleStatusUpdate,
    isUpdating: statusMutation.isPending,
    goBack,
  }
}