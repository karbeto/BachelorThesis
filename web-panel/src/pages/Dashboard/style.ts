export const STATUS_COLORS: Record<string, string> = {
  submitted: '#F59E0B',
  in_progress: '#38BDF8',
  resolved: '#22C55E',
  rejected: '#EF4444',
};

export const STATUS_MK: Record<string, string> = {
  submitted: 'Поднесено',
  in_progress: 'Се решава',
  resolved: 'Решено',
  rejected: 'Одбиено',
};

export const styles = {
  root: {
    padding: '32px 36px',
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.5px',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 14,
    padding: '20px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    transition: 'transform 0.15s, box-shadow 0.15s',
    cursor: 'default',
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 600,
    color: '#0F172A',
    letterSpacing: '-0.5px',
    lineHeight: 1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: 400,
  },
  midRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 20,
  },
  mapCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  mapWrap: {
    height: 320,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chartCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#0F172A',
    flex: 1,
  },
  cardCount: {
    fontSize: 12,
    color: '#94A3B8',
    background: '#F1F5F9',
    padding: '3px 10px',
    borderRadius: 20,
  },
  tableCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontSize: 11,
    fontWeight: 600,
    color: '#94A3B8',
    textAlign: 'left',
    padding: '8px 12px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #F1F5F9',
  },
  tr: {
    transition: 'background 0.1s',
    cursor: 'default',
  },
  td: {
    padding: '12px 12px',
    borderBottom: '1px solid #F8FAFC',
    verticalAlign: 'middle',
  },
  reportId: {
    fontSize: 13,
    fontWeight: 600,
    color: '#94A3B8',
    fontFamily: 'DM Mono, monospace',
  },
  reportTitle: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: 500,
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  categoryPill: {
    fontSize: 12,
    color: '#6366F1',
    background: '#EEF2FF',
    padding: '3px 10px',
    borderRadius: 20,
  },
  badge: {
    fontSize: 12,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 20,
    display: 'inline-block',
  },
  dateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  empty: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    padding: '40px 0',
  },
} as const;

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  .leaflet-container { border-radius: 14px; }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
  .report-row:hover { background: #F8FAFC !important; }
`;