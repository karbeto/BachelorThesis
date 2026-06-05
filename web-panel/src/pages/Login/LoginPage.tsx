import React from 'react';
import { useLoginLogic } from './logic';
import { styles, globalStyles } from './style';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthLayout } from './components/AuthLayout';
import { Logo } from '../../components/ui/Logo';

export default function LoginPage() {
  const { form, loading, handleSubmit, updateField } = useLoginLogic();

  return (
    <AuthLayout styles={styles} globalStyles={globalStyles}>
      <div style={styles.logoWrap}>
        <Logo size={36} />
      </div>

      <h1 style={styles.title}>Граѓански Активизам</h1>
      <p style={styles.subtitle}>Општини панел за управување</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <Input
          label="Е-пошта"
          type="email"
          required
          value={form.email}
          placeholder="admin@veles.mk"
          onChange={(e) => updateField('email', e.target.value)}
          styles={styles}
        />

        <Input
          label="Лозинка"
          type="password"
          required
          value={form.password}
          placeholder="••••••••"
          onChange={(e) => updateField('password', e.target.value)}
          styles={styles}
        />

        <Button type="submit" loading={loading} styles={styles}>
          Најави се
        </Button>
      </form>

      <p style={styles.footer}>
        Пристапот е ограничен на овластен персонал.
      </p>
    </AuthLayout>
  );
}