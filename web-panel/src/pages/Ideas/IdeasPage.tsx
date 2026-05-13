import { Lightbulb, ThumbsUp } from 'lucide-react'
import {
  useIdeasLogic,
  STATUS_OPTIONS,
  STATUS_UPDATE_OPTIONS,
  STATUS_MK,
  STATUS_COLORS,
} from './logic'
import { styles } from './style'

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#64748B' }
  return (
    <span style={{
      fontSize: 12,
      fontWeight: 500,
      padding: '3px 10px',
      borderRadius: 20,
      background: s.bg,
      color: s.color,
      whiteSpace: 'nowrap' as const,
    }}>
      {STATUS_MK[status] || status}
    </span>
  )
}

export default function IdeasPage() {
  const {
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
    isUpdating,
  } = useIdeasLogic()

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .idea-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07) !important; }
        .action-btn:hover { background: #F1F5F9 !important; border-color: #CBD5E1 !important; }
        .cancel-btn:hover { background: #F8FAFC !important; }
        .confirm-btn:hover { background: #1E293B !important; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Идеи за маалото</h1>
          <p style={styles.pageSubtitle}>
            {ideas?.length ?? 0} предлози од граѓаните
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <select
          style={styles.select}
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Cards grid */}
      <div style={styles.grid}>
        {isLoading && (
          <div style={styles.loadingState}>Се вчитува...</div>
        )}

        {!isLoading && ideas?.length === 0 && (
          <div style={styles.emptyState}>
            <Lightbulb
              size={36}
              style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }}
            />
            Нема предлози
          </div>
        )}

        {ideas?.map((idea: any) => (
          <div key={idea.id} className="idea-card" style={styles.ideaCard}>
            <div style={styles.ideaCardTop}>
              <span style={styles.ideaTitle}>{idea.title}</span>
              <StatusBadge status={idea.status} />
            </div>

            <p style={styles.ideaDesc}>{idea.description}</p>

            <div style={styles.ideaFooter}>
              <div style={styles.votePill}>
                <ThumbsUp size={13} />
                {idea.vote_count ?? 0}
              </div>
              <span style={styles.dateText}>
                {new Date(idea.created_at).toLocaleDateString('mk-MK')}
              </span>
            </div>

            <button
              className="action-btn"
              style={styles.actionBtn}
              onClick={() => openModal(idea)}
            >
              Промени статус
            </button>
          </div>
        ))}
      </div>

      {/* Status modal */}
      {selectedIdea && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Промени статус</div>
            <div style={styles.modalSubtitle}>
              {selectedIdea.title}
            </div>

            <label style={styles.modalLabel}>Нов статус</label>
            <select
              style={styles.modalSelect}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {STATUS_UPDATE_OPTIONS.map((o) => (
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