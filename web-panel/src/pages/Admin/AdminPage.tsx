import React from 'react';
import useAuthStore from '../../store/authStore';
import { SuperAdminView } from './views/SuperAdminView';
import { MunicipalityAdminView } from './views/MunicipalityAdminView';

export default function AdminPage() {
  const { user } = useAuthStore();

  if (user?.role === 'superadmin') {
    return <SuperAdminView />;
  }

  return <MunicipalityAdminView />;
}