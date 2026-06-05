import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import client from '../../api/client';

export function useIdeaDetailLogic() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const { data: idea, isLoading } = useQuery({
    queryKey: ['idea', id],
    queryFn: async () => {
      const { data } = await client.get(`/ideas/${id}`);
      return data;
    },
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      client.patch(`/ideas/${id}/status`, { status }),
    onSuccess: () => {
      toast.success('Статусот е успешно ажуриран');
      queryClient.invalidateQueries({ queryKey: ['idea', id] });
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при ажурирање');
    },
  });

  const openModal = () => {
    setNewStatus(idea?.status || 'open');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setNewStatus('');
  };

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error('Изберете нов статус');
      return;
    }
    statusMutation.mutate({ status: newStatus });
  };

  return {
    idea,
    isLoading,
    modalOpen,
    newStatus,
    setNewStatus,
    openModal,
    closeModal,
    handleStatusUpdate,
    isUpdating: statusMutation.isPending,
    goBack: () => navigate('/ideas'),
  };
}