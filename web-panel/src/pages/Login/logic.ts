import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export function useLoginLogic() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      setAuth(data.user, data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(
        err.response?.data?.detail || 'Невалидна е-пошта или лозинка'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return {
    form,
    loading,
    focused,
    setFocused,
    handleSubmit,
    updateField
  };
}