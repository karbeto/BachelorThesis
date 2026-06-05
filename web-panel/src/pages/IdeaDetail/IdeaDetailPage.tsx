import { ChevronLeft, ThumbsUp, Calendar, User, MapPin, RefreshCw } from 'lucide-react'
import {
  useIdeaDetailLogic,
  STATUS_MK,
  STATUS_COLORS,
  STATUS_OPTIONS,
} from './logic'
import { styles } from './style'

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#64748B' }
  return (
    <span style={{
      fontSize: 13,
      fontWeight: 500,
      padding: '4px 12px',
      borderRadius: 20,
      background: s.bg,
      color: s.color,
    }}>
      {STATUS_MK[status] || status}
    </span>
  )
}

export default function IdeaDetailPage() {
  const {
    idea,
    isLoading,
    modalOpen,
    newStatus,
    setNewStatus,
    openModal,
    closeModal,
    handleStatusUpdate,
    isUpdating,
    goBack,
  } = useIdeaDetailLogic()

  if (isLoading) {
    return <div style={styles.loadingWrap}>Се вчитува...</div>
  }

  if (!idea) {
    return <div style={styles.loadingWrap}>Идејата не е пронајдена.</div>
  }

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .back-btn:hover { color: #0F172A !important; }
        .update-btn:hover { background: #1E293B !important; }
        .cancel-btn:hover { background: #F8FAFC !important; }
        .confirm-btn:hover { background: #1E293B !important; }
      `}</style>

      {/* Back */}
      <button className="back-btn" style={styles.backBtn} onClick={goBack}>
        <ChevronLeft size={16} />
        Назад кон идеи
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.pageTitle}>{idea.title}</h1>
          <div style={styles.metaRow}>
            <StatusBadge status={idea.status} />
            <span style={styles.metaItem}>
              <ThumbsUp size={13} />
              {idea.vote_count ?? 0} гласови
            </span>
            <span style={styles.metaItem}>
              <Calendar size={13} />
              {new Date(idea.created_at).toLocaleDateString('mk-MK')}
            </span>
          </div>
        </div>
        <button className="update-btn" style={styles.updateBtn} onClick={openModal}>
          <RefreshCw size={14} />
          Промени статус
        </button>
      </div>

      {/* Grid */}
      <div style={styles.grid}>
        {/* Left — description */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>Опис на идејата</div>
          <p style={styles.descText}>{idea.description}</p>

          {/* Vote count pill */}
          <div style={{ marginTop: 8 }}>
            <span style={styles.votePill}>
              <ThumbsUp size={15} />
              {idea.vote_count ?? 0} граѓани ја поддржуваат
            </span>
          </div>
        </div>

        {/* Right — details */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>Детали</div>
          {[
            { label: 'ID', value: `#${idea.id}` },
            { label: 'Статус', value: STATUS_MK[idea.status] || idea.status },
            { label: 'Општина', value: idea.municipality_name || `#${idea.municipality_id}` },
            { label: 'Поднесено од', value: idea.user_full_name || `#${idea.user_id}` },
            { label: 'Гласови', value: idea.vote_count ?? 0 },
            { label: 'Поднесено', value: new Date(idea.created_at).toLocaleString('mk-MK') },
            { label: 'Ажурирано', value: new Date(idea.updated_at).toLocaleString('mk-MK') },
          ].map(({ label, value }, i) => (
            <div key={i} style={{
              ...styles.infoRow,
              ...(i === 6 ? { borderBottom: 'none' } : {}),
            }}>
              <span style={styles.infoLabel}>{label}</span>
              <span style={styles.infoValue}>{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status modal */}
      {modalOpen && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Промени статус</div>
            <div style={styles.modalSubtitle}>
              Идеја #{idea.id} — {idea.title}
            </div>
            <label style={styles.label}>Нов статус</label>
            <select
              style={styles.select}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div style={styles.modalActions}>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={closeModal}>
                Откажи
              </button>
              <button
                className="confirm-btn"
                style={styles.confirmBtn}
                onClick={handleStatusUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? 'Се зачувува...' : 'Зачувај'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}