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
import client from '../../api/client'
import toast from 'react-hot-toast'

export type AdminTab = 'categories' | 'routing' | 'cities' | 'municipalities'

export interface CategoryForm { name: string; description: string }
export interface RoutingForm {
  municipality_id: string
  category_id: string
  routing_email: string
  department_name: string
}
export interface CityForm { name: string; country: string }
export interface MunicipalityForm { name: string; city_id: string }

// Shared Routing Logic 

export function useRoutingLogic(fixedMunicipalityId?: number) {
  const queryClient = useQueryClient()

  const [routingForm, setRoutingForm] = useState<RoutingForm>({
    municipality_id: fixedMunicipalityId ? String(fixedMunicipalityId) : '',
    category_id: '',
    routing_email: '',
    department_name: '',
  })
  const [editingRouting, setEditingRouting] = useState<any>(null)
  const [routingModalOpen, setRoutingModalOpen] = useState(false)

  const { data: routings, isLoading: routingsLoading } = useQuery({
    queryKey: ['routings', fixedMunicipalityId],
    queryFn: () =>
      getRoutings(fixedMunicipalityId ? { municipality_id: fixedMunicipalityId } : {}),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: municipalities } = useQuery({
    queryKey: ['municipalities-all'],
    queryFn: async () => {
      const { data } = await client.get('/municipalities')
      return data
    },
  })

  const getMunicipalityName = (id: number) =>
    municipalities?.find((m: any) => m.id === id)?.name || `#${id}`

  const getCategoryName = (id: number) =>
    categories?.find((c: any) => c.id === id)?.name || `#${id}`

  const createMutation = useMutation({
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

  const updateMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: deleteRouting,
    onSuccess: () => {
      toast.success('Рутирањето е избришано')
      queryClient.invalidateQueries({ queryKey: ['routings'] })
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Грешка при бришење')
    },
  })

  const openCreateRouting = () => {
    setEditingRouting(null)
    setRoutingForm({
      municipality_id: fixedMunicipalityId ? String(fixedMunicipalityId) : '',
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
      municipality_id: fixedMunicipalityId ? String(fixedMunicipalityId) : '',
      category_id: '',
      routing_email: '',
      department_name: '',
    })
  }

  const handleRoutingSubmit = () => {
    if (!routingForm.routing_email.trim()) {
      toast.error('Внесете email адреса')
      return
    }
    if (editingRouting) {
      updateMutation.mutate({
        id: editingRouting.id,
        payload: {
          routing_email: routingForm.routing_email,
          department_name: routingForm.department_name || null,
        },
      })
    } else {
      if (!routingForm.municipality_id || !routingForm.category_id) {
        toast.error('Пополнете ги сите задолжителни полиња')
        return
      }
      createMutation.mutate({
        municipality_id: Number(routingForm.municipality_id),
        category_id: Number(routingForm.category_id),
        routing_email: routingForm.routing_email,
        department_name: routingForm.department_name || null,
      })
    }
  }

  const handleDeleteRouting = (id: number) => {
    if (confirm('Дали сте сигурни?')) deleteMutation.mutate(id)
  }

  return {
    routings, routingsLoading,
    routingForm, setRoutingForm,
    editingRouting, routingModalOpen,
    categories, municipalities,
    getMunicipalityName, getCategoryName,
    openCreateRouting, openEditRouting,
    closeRoutingModal, handleRoutingSubmit, handleDeleteRouting,
    isRoutingSubmitting: createMutation.isPending || updateMutation.isPending,
  }
}

// Municipality Admin Logic

export function useMunicipalityAdminLogic() {
  const [activeTab, setActiveTab] = useState<'categories' | 'routing'>('categories')

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { data: municipalities } = useQuery({
    queryKey: ['municipalities-all'],
    queryFn: async () => {
      const { data } = await client.get('/municipalities')
      return data
    },
  })

  const municipalityId: number | undefined = municipalities?.[0]?.id
  const municipalityName: string | undefined = municipalities?.[0]?.name

  const routingLogic = useRoutingLogic(municipalityId)

  const {
    categories: _rc,
    municipalities: _rm,
    ...restRoutingLogic
  } = routingLogic

  return {
    activeTab, setActiveTab,
    categories, categoriesLoading,
    municipalityId, municipalityName,
    municipalities,
    ...restRoutingLogic,
  }
}

// Superadmin Logic

export function useSuperAdminLogic() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<AdminTab>('categories')

  const [categoryForm, setCategoryForm] = useState<CategoryForm>({ name: '', description: '' })
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const [cityForm, setCityForm] = useState<CityForm>({ name: '', country: 'Macedonia' })
  const [cityModalOpen, setCityModalOpen] = useState(false)

  const [municipalityForm, setMunicipalityForm] = useState<MunicipalityForm>({ name: '', city_id: '' })
  const [municipalityModalOpen, setMunicipalityModalOpen] = useState(false)

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-all'],
    queryFn: getCategories,
  })

  const { data: cities, isLoading: citiesLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: async () => { const { data } = await client.get('/cities'); return data },
  })

  const { data: municipalities, isLoading: municipalitiesLoading } = useQuery({
    queryKey: ['municipalities-all'],
    queryFn: async () => { const { data } = await client.get('/municipalities'); return data },
  })

  const routingLogic = useRoutingLogic()

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => { toast.success('Категоријата е додадена'); queryClient.invalidateQueries({ queryKey: ['categories-all'] }); queryClient.invalidateQueries({ queryKey: ['categories'] }); closeCategoryModal() },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => updateCategory(id, payload),
    onSuccess: () => { toast.success('Категоријата е ажурирана'); queryClient.invalidateQueries({ queryKey: ['categories-all'] }); queryClient.invalidateQueries({ queryKey: ['categories'] }); closeCategoryModal() },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => { toast.success('Категоријата е избришана'); queryClient.invalidateQueries({ queryKey: ['categories-all'] }); queryClient.invalidateQueries({ queryKey: ['categories'] }) },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const createCityMutation = useMutation({
    mutationFn: async (payload: CityForm) => { const { data } = await client.post('/cities', payload); return data },
    onSuccess: () => { toast.success('Градот е додаден'); queryClient.invalidateQueries({ queryKey: ['cities'] }); setCityModalOpen(false); setCityForm({ name: '', country: 'Macedonia' }) },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const deleteCityMutation = useMutation({
    mutationFn: async (id: number) => { await client.delete(`/cities/${id}`) },
    onSuccess: () => { toast.success('Градот е избришан'); queryClient.invalidateQueries({ queryKey: ['cities'] }) },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const createMunicipalityMutation = useMutation({
    mutationFn: async (payload: { name: string; city_id: number }) => { const { data } = await client.post('/municipalities', payload); return data },
    onSuccess: () => { toast.success('Општина е додадена'); queryClient.invalidateQueries({ queryKey: ['municipalities-all'] }); setMunicipalityModalOpen(false); setMunicipalityForm({ name: '', city_id: '' }) },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const deleteMunicipalityMutation = useMutation({
    mutationFn: async (id: number) => { await client.delete(`/municipalities/${id}`) },
    onSuccess: () => { toast.success('Општина е избришана'); queryClient.invalidateQueries({ queryKey: ['municipalities-all'] }) },
    onError: (err: any) => toast.error(err.response?.data?.detail || 'Грешка'),
  })

  const openCreateCategory = () => { setEditingCategory(null); setCategoryForm({ name: '', description: '' }); setCategoryModalOpen(true) }
  const openEditCategory = (cat: any) => { setEditingCategory(cat); setCategoryForm({ name: cat.name, description: cat.description || '' }); setCategoryModalOpen(true) }
  const closeCategoryModal = () => { setCategoryModalOpen(false); setEditingCategory(null); setCategoryForm({ name: '', description: '' }) }

  const handleCategorySubmit = () => {
    if (!categoryForm.name.trim()) { toast.error('Внесете ime на категорија'); return }
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, payload: { name: categoryForm.name, description: categoryForm.description || null } })
    } else {
      createCategoryMutation.mutate({ name: categoryForm.name, description: categoryForm.description || null })
    }
  }

  const handleDeleteCategory = (id: number) => {
    if (confirm('Дали сте сигурни?')) deleteCategoryMutation.mutate(id)
  }

  const toggleCategoryActive = (cat: any) => {
    updateCategoryMutation.mutate({ id: cat.id, payload: { is_active: !cat.is_active } })
  }

  const {
    categories: _rc,
    municipalities: _rm,
    ...restRoutingLogic
  } = routingLogic

  return {
    activeTab, setActiveTab,
    categories, categoriesLoading,
    categoryForm, setCategoryForm,
    editingCategory, categoryModalOpen,
    openCreateCategory, openEditCategory, closeCategoryModal,
    handleCategorySubmit, handleDeleteCategory, toggleCategoryActive,
    isCategorySubmitting: createCategoryMutation.isPending || updateCategoryMutation.isPending,
    cities, citiesLoading,
    cityForm, setCityForm, cityModalOpen, setCityModalOpen,
    handleCreateCity: () => {
      if (!cityForm.name.trim()) { toast.error('Внесете ime на град'); return }
      createCityMutation.mutate(cityForm)
    },
    handleDeleteCity: (id: number) => {
      if (confirm('Дали сте сигурни?')) deleteCityMutation.mutate(id)
    },
    isCitySubmitting: createCityMutation.isPending,
    municipalities, municipalitiesLoading,
    municipalityForm, setMunicipalityForm, municipalityModalOpen, setMunicipalityModalOpen,
    handleCreateMunicipality: () => {
      if (!municipalityForm.name.trim() || !municipalityForm.city_id) { toast.error('Пополнете ги сите полиња'); return }
      createMunicipalityMutation.mutate({ name: municipalityForm.name, city_id: Number(municipalityForm.city_id) })
    },
    handleDeleteMunicipality: (id: number) => {
      if (confirm('Дали сте сигурни?')) deleteMunicipalityMutation.mutate(id)
    },
    isMunicipalitySubmitting: createMunicipalityMutation.isPending,
    ...restRoutingLogic,
  }
}