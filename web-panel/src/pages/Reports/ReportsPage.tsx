import { FileText, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  useReportsLogic,
  STATUS_OPTIONS,
  STATUS_MK,
  STATUS_COLORS,
} from './logic'
import { styles } from './style'

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#64748B' }
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: 20,
        display: 'inline-block',
        background: s.bg,
        color: s.color,
      }}
    >
      {STATUS_MK[status] || status}
    </span>
  )
}

export default function ReportsPage() {
  const {
    reports,
    isLoading,
    categories,
    filters,
    selectedReport,
    statusNote,
    newStatus,
    setStatusNote,
    setNewStatus,
    handleFilterChange,
    handleStatusUpdate,
    handleNextPage,
    handlePrevPage,
    openReport,
    openStatusModal,
    closeModal,
    isUpdating,
  } = useReportsLogic()

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .report-row { transition: background 0.1s; cursor: pointer; }
        .report-row:hover { background: #F8FAFC !important; }
        .action-btn:hover { background: #F1F5F9 !important; border-color: #CBD5E1 !important; }
        .page-btn:hover { background: #F8FAFC !important; }
        .confirm-btn:hover { background: #1E293B !important; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Пријави</h1>
          <p style={styles.pageSubtitle}>
            {reports?.length ?? 0} пријави прикажани
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

        <select
          style={styles.select}
          value={filters.category_id}
          onChange={(e) => handleFilterChange('category_id', e.target.value)}
        >
          <option value="">Сите категории</option>
          {categories?.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {['#', 'Наслов', 'Категорија', 'Статус', 'Датум', 'Акција'].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} style={styles.loadingState}>Се вчитува...</td>
                </tr>
              )}
              {!isLoading && reports?.length === 0 && (
                <tr>
                  <td colSpan={6} style={styles.emptyState}>
                    <FileText size={32} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                    Нема пријави
                  </td>
                </tr>
              )}
              {reports?.map((r: any) => (
                <tr
                  key={r.id}
                  className="report-row"
                  onClick={() => openReport(r)}
                >
                  <td style={styles.td}>
                    <span style={styles.reportId}>#{r.id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.reportTitle}>{r.title}</span>
                    {r.description && (
                      <span style={styles.reportDesc}>{r.description}</span>
                    )}
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryPill}>
                      {categories?.find((c: any) => c.id === r.category_id)?.name || `#${r.category_id}`}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <StatusBadge status={r.status} />
                  </td>
                  <td style={styles.td}>
                    <span style={styles.dateText}>
                      {new Date(r.created_at).toLocaleDateString('mk-MK')}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      className="action-btn"
                      style={styles.actionBtn}
                      onClick={(e) => openStatusModal(e, r)}
                    >
                      Промени статус
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            className="page-btn"
            style={styles.pageBtn}
            onClick={handlePrevPage}
            disabled={filters.skip === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={styles.pageInfo}>
            {filters.skip + 1} — {filters.skip + (reports?.length ?? 0)}
          </span>
          <button
            className="page-btn"
            style={styles.pageBtn}
            onClick={handleNextPage}
            disabled={(reports?.length ?? 0) < filters.limit}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Status update modal */}
      {selectedReport && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Промени статус</div>
            <div style={styles.modalSubtitle}>
              Пријава #{selectedReport.id} — {selectedReport.title}
            </div>

            <label style={styles.modalLabel}>Нов статус</label>
            <select
              style={styles.modalSelect}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {STATUS_OPTIONS.filter((o) => o.value !== '').map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <label style={styles.modalLabel}>Забелешка (опционално)</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="Опционална забелешка за промената..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />

            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={closeModal}>
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