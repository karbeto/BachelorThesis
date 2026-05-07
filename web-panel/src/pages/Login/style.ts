export const styles = {
  root: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
    position: 'relative' as const,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute' as const,
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    pointerEvents: 'none' as const,
  },
  blob1: {
    position: 'absolute' as const,
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(56,189,248,0.12) 0%, transparent 70%)',
    top: '-200px',
    right: '-100px',
    animation: 'blobFloat 12s ease-in-out infinite',
    pointerEvents: 'none' as const,
  },
  blob2: {
    position: 'absolute' as const,
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
    bottom: '-150px',
    left: '-100px',
    animation: 'blobFloat 15s ease-in-out infinite reverse',
    pointerEvents: 'none' as const,
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(15,23,42,0.08)',
    borderRadius: 20,
    padding: '48px 44px',
    width: '100%',
    maxWidth: 420,
    position: 'relative' as const,
    zIndex: 1,
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04), 0 20px 40px -8px rgba(0,0,0,0.08)',
    animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  },
  logoWrap: { marginBottom: 24 },
  title: {
    fontSize: 22,
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.5px',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: 400,
    marginBottom: 36,
  },
  form: { display: 'flex', flexDirection: 'column' as const, gap: 20 },
  fieldWrap: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    letterSpacing: '0.01em',
  },
  input: {
    height: 44,
    padding: '0 14px',
    borderRadius: 10,
    border: '1.5px solid #E2E8F0',
    background: '#F8FAFC',
    fontSize: 14,
    color: '#0F172A',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    transition: 'all 0.15s',
  },
  inputFocused: {
    borderColor: '#38BDF8',
    background: '#FFFFFF',
    boxShadow: '0 0 0 3px rgba(56,189,248,0.12)',
  },
  button: {
    height: 46,
    borderRadius: 10,
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    marginTop: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  buttonLoading: { background: '#334155', cursor: 'not-allowed' },
  spinner: {
    width: 18,
    height: 18,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#FFFFFF',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  footer: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center' as const,
    marginTop: 28,
    lineHeight: 1.5,
  },
};

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes blobFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -20px) scale(1.05); }
    66% { transform: translate(-20px, 15px) scale(0.97); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;