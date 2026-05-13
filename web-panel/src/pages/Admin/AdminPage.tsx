import { Plus, Pencil, Trash2, Tag, Mail } from 'lucide-react'
import { useAdminLogic } from './logic'
import { styles } from './style'

export default function AdminPage() {
  const {
    activeTab,
    setActiveTab,
    categories,
    categoriesLoading,
    categoryForm,
    setCategoryForm,
    editingCategory,
    categoryModalOpen,
    openCreateCategory,
    openEditCategory,
    closeCategoryModal,
    handleCategorySubmit,
    handleDeleteCategory,
    toggleCategoryActive,
    isCategorySubmitting,
    routings,
    routingsLoading,
    routingForm,
    setRoutingForm,
    editingRouting,
    routingModalOpen,
    openCreateRouting,
    openEditRouting,
    closeRoutingModal,
    handleRoutingSubmit,
    handleDeleteRouting,
    isRoutingSubmitting,
  } = useAdminLogic()

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .add-btn:hover { background: #1E293B !important; }
        .icon-btn:hover { background: #F8FAFC !important; border-color: #CBD5E1 !important; }
        .icon-btn-danger:hover { background: #FEF2F2 !important; border-color: #FECACA !important; }
        .icon-btn-danger:hover svg { color: #EF4444 !important; }
        .cancel-btn:hover { background: #F8FAFC !important; }
        .confirm-btn:hover { background: #1E293B !important; }
        input:focus, textarea:focus, select:focus {
          border-color: #38BDF8 !important;
          background: #FFFFFF !important;
          box-shadow: 0 0 0 3px rgba(56,189,248,0.1) !important;
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Администрација</h1>
          <p style={styles.pageSubtitle}>Управување со категории и email рутирање</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'categories' ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={14} />
          Категории
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === 'routing' ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => setActiveTab('routing')}
        >
          <Mail size={14} />
          Email рутирање
        </button>
      </div>

      {/* Categories tab */}
      {activeTab === 'categories' && (
        <div>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>
              {categories?.length ?? 0} категории
            </span>
            <button
              className="add-btn"
              style={styles.addBtn}
              onClick={openCreateCategory}
            >
              <Plus size={14} />
              Додај категорија
            </button>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['#', 'Име', 'Опис', 'Статус', 'Акции'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoriesLoading && (
                  <tr>
                    <td colSpan={5} style={styles.emptyState}>Се вчитува...</td>
                  </tr>
                )}
                {!categoriesLoading && categories?.length === 0 && (
                  <tr>
                    <td colSpan={5} style={styles.emptyState}>Нема категории</td>
                  </tr>
                )}
                {categories?.map((cat: any) => (
                  <tr key={cat.id}>
                    <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>
                      #{cat.id}
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: 500 }}>{cat.name}</span>
                    </td>
                    <td style={{ ...styles.td, color: '#64748B' }}>
                      {cat.description || '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.activePill,
                        background: cat.is_active ? '#F0FDF4' : '#F8FAFC',
                        color: cat.is_active ? '#22C55E' : '#94A3B8',
                      }}>
                        {cat.is_active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        className="icon-btn"
                        style={styles.iconBtn}
                        onClick={() => toggleCategoryActive(cat)}
                        title={cat.is_active ? 'Деактивирај' : 'Активирај'}
                      >
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B' }}>
                          {cat.is_active ? 'OFF' : 'ON'}
                        </span>
                      </button>
                      <button
                        className="icon-btn"
                        style={styles.iconBtn}
                        onClick={() => openEditCategory(cat)}
                        title="Уреди"
                      >
                        <Pencil size={13} color="#64748B" />
                      </button>
                      <button
                        className="icon-btn icon-btn-danger"
                        style={styles.iconBtn}
                        onClick={() => handleDeleteCategory(cat.id)}
                        title="Избриши"
                      >
                        <Trash2 size={13} color="#64748B" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routing tab */}
      {activeTab === 'routing' && (
        <div>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>
              {routings?.length ?? 0} рутирања
            </span>
            <button
              className="add-btn"
              style={styles.addBtn}
              onClick={openCreateRouting}
            >
              <Plus size={14} />
              Додај рутирање
            </button>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['#', 'Општина', 'Категорија', 'Email', 'Служба', 'Статус', 'Акции'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {routingsLoading && (
                  <tr>
                    <td colSpan={7} style={styles.emptyState}>Се вчитува...</td>
                  </tr>
                )}
                {!routingsLoading && routings?.length === 0 && (
                  <tr>
                    <td colSpan={7} style={styles.emptyState}>Нема рутирања</td>
                  </tr>
                )}
                {routings?.map((r: any) => (
                  <tr key={r.id}>
                    <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>
                      #{r.id}
                    </td>
                    <td style={styles.td}>#{r.municipality_id}</td>
                    <td style={styles.td}>#{r.category_id}</td>
                    <td style={{ ...styles.td, color: '#6366F1' }}>
                      {r.routing_email}
                    </td>
                    <td style={{ ...styles.td, color: '#64748B' }}>
                      {r.department_name || '—'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.activePill,
                        background: r.is_active ? '#F0FDF4' : '#F8FAFC',
                        color: r.is_active ? '#22C55E' : '#94A3B8',
                      }}>
                        {r.is_active ? 'Активно' : 'Неактивно'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        className="icon-btn"
                        style={styles.iconBtn}
                        onClick={() => openEditRouting(r)}
                        title="Уреди"
                      >
                        <Pencil size={13} color="#64748B" />
                      </button>
                      <button
                        className="icon-btn icon-btn-danger"
                        style={styles.iconBtn}
                        onClick={() => handleDeleteRouting(r.id)}
                        title="Избриши"
                      >
                        <Trash2 size={13} color="#64748B" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category modal */}
      {categoryModalOpen && (
        <div style={styles.overlay} onClick={closeCategoryModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              {editingCategory ? 'Уреди категорија' : 'Додај категорија'}
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Име *</label>
              <input
                style={styles.input}
                placeholder="пр. Дупки на патот"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Опис (опционално)</label>
              <textarea
                style={styles.textarea}
                placeholder="Краток опис на категоријата..."
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>

            <div style={styles.modalActions}>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={closeCategoryModal}>
                Откажи
              </button>
              <button
                className="confirm-btn"
                style={styles.confirmBtn}
                onClick={handleCategorySubmit}
                disabled={isCategorySubmitting}
              >
                {isCategorySubmitting ? 'Се зачувува...' : 'Зачувај'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing modal */}
      {routingModalOpen && (
        <div style={styles.overlay} onClick={closeRoutingModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              {editingRouting ? 'Уреди рутирање' : 'Додај рутирање'}
            </div>

            {!editingRouting && (
              <>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Општина ID *</label>
                  <input
                    style={styles.input}
                    placeholder="пр. 1"
                    type="number"
                    value={routingForm.municipality_id}
                    onChange={(e) =>
                      setRoutingForm((p) => ({ ...p, municipality_id: e.target.value }))
                    }
                  />
                </div>

                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Категорија ID *</label>
                  <input
                    style={styles.input}
                    placeholder="пр. 1"
                    type="number"
                    value={routingForm.category_id}
                    onChange={(e) =>
                      setRoutingForm((p) => ({ ...p, category_id: e.target.value }))
                    }
                  />
                </div>
              </>
            )}

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email адреса *</label>
              <input
                style={styles.input}
                placeholder="пр. komunalna@veles.mk"
                type="email"
                value={routingForm.routing_email}
                onChange={(e) =>
                  setRoutingForm((p) => ({ ...p, routing_email: e.target.value }))
                }
              />
            </div>

            <div style={styles.fieldWrap}>
              <label style={styles.label}>Служба (опционално)</label>
              <input
                style={styles.input}
                placeholder="пр. ЈП Комуналец"
                value={routingForm.department_name}
                onChange={(e) =>
                  setRoutingForm((p) => ({ ...p, department_name: e.target.value }))
                }
              />
            </div>

            <div style={styles.modalActions}>
              <button className="cancel-btn" style={styles.cancelBtn} onClick={closeRoutingModal}>
                Откажи
              </button>
              <button
                className="confirm-btn"
                style={styles.confirmBtn}
                onClick={handleRoutingSubmit}
                disabled={isRoutingSubmitting}
              >
                {isRoutingSubmitting ? 'Се зачувува...' : 'Зачувај'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}