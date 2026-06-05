import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getIdeas, updateIdeaStatus } from '../../api/ideas';
import toast from 'react-hot-toast';

export interface IdeaFilters {
  status: string;
  municipality_id: string;
}

export function useIdeasLogic() {
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<IdeaFilters>({
    status: '',
    municipality_id: '',
  });

  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');

  const { data: ideas, isLoading } = useQuery({
    queryKey: ['ideas', filters],
    queryFn: () =>
      getIdeas({
        ...(filters.status && { status: filters.status }),
        ...(filters.municipality_id && {
          municipality_id: filters.municipality_id,
        }),
      }),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateIdeaStatus(id, status),
    onSuccess: () => {
      toast.success('Статусот е успешно ажуриран');
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      closeModal();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при ажурирање');
    },
  });

  const handleFilterChange = (key: keyof IdeaFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (idea: any) => {
    setSelectedIdea(idea);
    setNewStatus(idea.status);
  };

  const closeModal = () => {
    setSelectedIdea(null);
    setNewStatus('');
  };

  const handleStatusUpdate = () => {
    if (!newStatus) {
      toast.error('Изберете нов статус');
      return;
    }
    statusMutation.mutate({ id: selectedIdea.id, status: newStatus });
  };

  return {
    ideas,
    isLoading,
    filters,
    selectedIdea,
    newStatus,
    setNewStatus,
    handleFilterChange,
    openModal,
    closeModal,
    handleStatusUpdate,
    isUpdating: statusMutation.isPending,
  };
}