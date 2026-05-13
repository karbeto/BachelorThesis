import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../api/categories'
import {
  getRoutings,
  createRouting,
  updateRouting,
  deleteRouting,
} from '../../api/routing'
import toast from 'react-hot-toast'

export type AdminTab = 'categories' | 'routing'

export interface CategoryForm {
  name: string
  description: string
}

export interface RoutingForm {
  municipality_id: string
  category_id: string
  routing_email: string
  department_name: string
}

export function useAdminLogic() {
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<AdminTab>('categories')

  // Category state
  const [categoryForm, setCategoryForm] = useState<CategoryForm>({
    name: '',
    description: '',
  })
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  // Routing state
  const [routingForm, setRoutingForm] = useState<RoutingForm>({
    municipality_id: '',
    category_id: '',
    routing_email: '',
    department_name: '',
  })
  const [editingRouting, setEditingRouting] = useState<any>(null)
  const [routingModalOpen, setRoutingModalOpen] = useState(false)

  // Queries
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-all'],
    queryFn: getCategories,
  })

  const { data: routings, isLoading: routingsLoading } = useQuery({
    queryKey: ['routings'],
    queryFn: () => getRoutings({}),
  })

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Категоријата е додадена')
      queryClient.invalidateQueries({ queryKey: ['categories-all'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      closeCategoryModal()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при додавање')
    },
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      toast.success('Категоријата е ажурирана')
      queryClient.invalidateQueries({ queryKey: ['categories-all'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      closeCategoryModal()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при ажурирање')
    },
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Категоријата е избришана')
      queryClient.invalidateQueries({ queryKey: ['categories-all'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при бришење')
    },
  })

  // Routing mutations
  const createRoutingMutation = useMutation({
    mutationFn: createRouting,
    onSuccess: () => {
      toast.success('Рутирањето е додадено')
      queryClient.invalidateQueries({ queryKey: ['routings'] })
      closeRoutingModal()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при додавање')
    },
  })

  const updateRoutingMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateRouting(id, payload),
    onSuccess: () => {
      toast.success('Рутирањето е ажурирано')
      queryClient.invalidateQueries({ queryKey: ['routings'] })
      closeRoutingModal()
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при ажурирање')
    },
  })

  const deleteRoutingMutation = useMutation({
    mutationFn: deleteRouting,
    onSuccess: () => {
      toast.success('Рутирањето е избришано')
      queryClient.invalidateQueries({ queryKey: ['routings'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при бришење')
    },
  })

  // Category handlers
  const openCreateCategory = () => {
    setEditingCategory(null)
    setCategoryForm({ name: '', description: '' })
    setCategoryModalOpen(true)
  }

  const openEditCategory = (cat: any) => {
    setEditingCategory(cat)
    setCategoryForm({ name: cat.name, description: cat.description || '' })
    setCategoryModalOpen(true)
  }

  const closeCategoryModal = () => {
    setCategoryModalOpen(false)
    setEditingCategory(null)
    setCategoryForm({ name: '', description: '' })
  }

  const handleCategorySubmit = () => {
    if (!categoryForm.name.trim()) {
      toast.error('Внесете име на категорија')
      return
    }
    if (editingCategory) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        payload: {
          name: categoryForm.name,
          description: categoryForm.description || null,
        },
      })
    } else {
      createCategoryMutation.mutate({
        name: categoryForm.name,
        description: categoryForm.description || null,
      })
    }
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm('Дали сте сигурни дека сакате да ја избришете оваа категорија?')) {
      deleteCategoryMutation.mutate(id)
    }
  }

  // Routing handlers
  const openCreateRouting = () => {
    setEditingRouting(null)
    setRoutingForm({
      municipality_id: '',
      category_id: '',
      routing_email: '',
      department_name: '',
    })
    setRoutingModalOpen(true)
  }

  const openEditRouting = (routing: any) => {
    setEditingRouting(routing)
    setRoutingForm({
      municipality_id: String(routing.municipality_id),
      category_id: String(routing.category_id),
      routing_email: routing.routing_email,
      department_name: routing.department_name || '',
    })
    setRoutingModalOpen(true)
  }

  const closeRoutingModal = () => {
    setRoutingModalOpen(false)
    setEditingRouting(null)
    setRoutingForm({
      municipality_id: '',
      category_id: '',
      routing_email: '',
      department_name: '',
    })
  }

  const handleRoutingSubmit = () => {
    if (
      !routingForm.municipality_id ||
      !routingForm.category_id ||
      !routingForm.routing_email
    ) {
      toast.error('Пополнете ги сите задолжителни полиња')
      return
    }
    if (editingRouting) {
      updateRoutingMutation.mutate({
        id: editingRouting.id,
        payload: {
          routing_email: routingForm.routing_email,
          department_name: routingForm.department_name || null,
        },
      })
    } else {
      createRoutingMutation.mutate({
        municipality_id: Number(routingForm.municipality_id),
        category_id: Number(routingForm.category_id),
        routing_email: routingForm.routing_email,
        department_name: routingForm.department_name || null,
      })
    }
  }

  const handleDeleteRouting = (id: number) => {
    if (confirm('Дали сте сигурни дека сакате да го избришете ова рутирање?')) {
      deleteRoutingMutation.mutate(id)
    }
  }

  const toggleCategoryActive = (cat: any) => {
    updateCategoryMutation.mutate({
      id: cat.id,
      payload: { is_active: !cat.is_active },
    })
  }

  return {
    activeTab,
    setActiveTab,
    // categories
    categories,
    categoriesLoading,
    categoryForm,
    setCategoryForm,
    editingCategory,
    categoryModalOpen,
    openCreateCategory,
    openEditCategory,
    closeCategoryModal,
    handleCategorySubmit,
    handleDeleteCategory,
    toggleCategoryActive,
    isCategorySubmitting:
      createCategoryMutation.isPending || updateCategoryMutation.isPending,
    // routing
    routings,
    routingsLoading,
    routingForm,
    setRoutingForm,
    editingRouting,
    routingModalOpen,
    openCreateRouting,
    openEditRouting,
    closeRoutingModal,
    handleRoutingSubmit,
    handleDeleteRouting,
    isRoutingSubmitting:
      createRoutingMutation.isPending || updateRoutingMutation.isPending,
  }
}