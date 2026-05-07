import React from 'react';
import { useLoginLogic } from './logic';
import { styles, globalStyles } from './style';

export default function LoginPage() {
  const { 
    form, 
    loading, 
    focused, 
    setFocused, 
    handleSubmit, 
    updateField 
  } = useLoginLogic();

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>
      
      <div style={styles.grid} />
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card} className="card-enter">
        <div style={styles.logoWrap}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#0F172A" />
            <circle cx="18" cy="18" r="7" fill="#38BDF8" />
            <circle cx="18" cy="18" r="3" fill="#0F172A" />
            <circle cx="27" cy="11" r="2.5" fill="#38BDF8" opacity="0.5" />
            <circle cx="10" cy="26" r="2" fill="#38BDF8" opacity="0.3" />
          </svg>
        </div>

        <h1 style={styles.title}>Граѓански Активизам</h1>
        <p style={styles.subtitle}>Општини панел за управување</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Е-пошта</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              placeholder="admin@veles.mk"
              style={{
                ...styles.input,
                ...(focused === 'email' ? styles.inputFocused : {}),
              }}
            />
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Лозинка</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              placeholder="••••••••"
              style={{
                ...styles.input,
                ...(focused === 'password' ? styles.inputFocused : {}),
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonLoading : {}),
            }}
          >
            {loading ? <span style={styles.spinner} /> : 'Најави се'}
          </button>
        </form>

        <p style={styles.footer}>
          Пристапот е ограничен на овластен персонал.
        </p>
      </div>
    </div>
  );
}