import { Plus, Pencil, Trash2, Tag, Mail, MapPin, Building2, Info } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import { useSuperAdminLogic, useMunicipalityAdminLogic } from './logic'
import { styles } from './style'

// ── Shared: Routing Modal ────────────────────────────────────────────────────

function RoutingModal({
  open,
  onClose,
  editingRouting,
  routingForm,
  setRoutingForm,
  onSubmit,
  isSubmitting,
  categories,
  municipalities,
  isMunicipalityAdmin = false,
}: any) {
  if (!open) return null
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTitle}>
          {editingRouting ? 'Уреди рутирање' : 'Додај рутирање'}
        </div>

        {!editingRouting && !isMunicipalityAdmin && (
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Општина *</label>
            <select
              style={styles.select}
              value={routingForm.municipality_id}
              onChange={(e) =>
                setRoutingForm((p: any) => ({ ...p, municipality_id: e.target.value }))
              }
            >
              <option value="">Изберете општина</option>
              {municipalities?.map((m: any) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        )}

        {!editingRouting && (
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Категорија *</label>
            <select
              style={styles.select}
              value={routingForm.category_id}
              onChange={(e) =>
                setRoutingForm((p: any) => ({ ...p, category_id: e.target.value }))
              }
            >
              <option value="">Изберете категорија</option>
              {categories?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Email адреса *</label>
          <input
            style={styles.input}
            type="email"
            placeholder="пр. derven@veles.gov.mk"
            value={routingForm.routing_email}
            onChange={(e) =>
              setRoutingForm((p: any) => ({ ...p, routing_email: e.target.value }))
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
              setRoutingForm((p: any) => ({ ...p, department_name: e.target.value }))
            }
          />
        </div>

        <div style={styles.modalActions}>
          <button className="cancel-btn" style={styles.cancelBtn} onClick={onClose}>
            Откажи
          </button>
          <button
            className="confirm-btn"
            style={styles.confirmBtn}
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Се зачувува...' : 'Зачувај'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Shared: Routing Table ────────────────────────────────────────────────────

function RoutingTable({ routings, routingsLoading, onEdit, onDelete, onAdd, readOnlyMunicipalityId, getMunicipalityName, getCategoryName }: any) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.sectionTitle}>
            {routings?.length ?? 0} рутирања
          </div>
          {readOnlyMunicipalityId && (
            <div style={styles.sectionSubtitle}>
              Прикажани само за вашата општина
            </div>
          )}
        </div>
        <button className="add-btn" style={styles.addBtn} onClick={onAdd}>
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
              <tr><td colSpan={7} style={styles.emptyState}>Се вчитува...</td></tr>
            )}
            {!routingsLoading && routings?.length === 0 && (
              <tr><td colSpan={7} style={styles.emptyState}>Нема рутирања</td></tr>
            )}
            {routings?.map((r: any) => (
              <tr key={r.id}>
                <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>
                  #{r.id}
                </td>
                <td style={styles.td}>{getMunicipalityName(r.municipality_id)}</td>
                <td style={styles.td}>{getCategoryName(r.category_id)}</td>
                <td style={{ ...styles.td, color: '#6366F1' }}>{r.routing_email}</td>
                <td style={{ ...styles.td, color: '#64748B' }}>{r.department_name || '—'}</td>
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
                  <button className="icon-btn" style={styles.iconBtn} onClick={() => onEdit(r)}>
                    <Pencil size={13} color="#64748B" />
                  </button>
                  <button className="icon-btn icon-btn-danger" style={styles.iconBtn} onClick={() => onDelete(r.id)}>
                    <Trash2 size={13} color="#64748B" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Municipality Admin View ──────────────────────────────────────────────────

function MunicipalityAdminView() {
  const {
    activeTab,
    setActiveTab,
    categories,
    categoriesLoading,
    routings,
    routingsLoading,
    routingForm,
    setRoutingForm,
    editingRouting,
    routingModalOpen,
    municipalities,
    getMunicipalityName,
    getCategoryName,
    openCreateRouting,
    openEditRouting,
    closeRoutingModal,
    handleRoutingSubmit,
    handleDeleteRouting,
    isRoutingSubmitting,
    municipalityId,
  } = useMunicipalityAdminLogic()

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
        }
      `}</style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Администрација</h1>
          <p style={styles.pageSubtitle}>Управување со вашата општина</p>
        </div>
        <span style={{
          ...styles.roleBadge,
          background: '#F0F9FF',
          color: '#0369A1',
        }}>
          <Building2 size={13} />
          Општина Админ
        </span>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'categories' ? styles.tabActive : styles.tabInactive) }}
          onClick={() => setActiveTab('categories')}
        >
          <Tag size={14} />
          Категории
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'routing' ? styles.tabActive : styles.tabInactive) }}
          onClick={() => setActiveTab('routing')}
        >
          <Mail size={14} />
          Email рутирање
        </button>
      </div>

      {/* Categories — read only */}
      {activeTab === 'categories' && (
        <div>
          <div style={styles.readOnlyNote}>
            <Info size={15} />
            Категориите се управуваат од Супер Администраторот. Прегледувате само.
          </div>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['#', 'Име', 'Опис', 'Статус'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categoriesLoading && (
                  <tr><td colSpan={4} style={styles.emptyState}>Се вчитува...</td></tr>
                )}
                {categories?.map((cat: any) => (
                  <tr key={cat.id}>
                    <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>
                      #{cat.id}
                    </td>
                    <td style={styles.td}><span style={{ fontWeight: 500 }}>{cat.name}</span></td>
                    <td style={{ ...styles.td, color: '#64748B' }}>{cat.description || '—'}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.activePill,
                        background: cat.is_active ? '#F0FDF4' : '#F8FAFC',
                        color: cat.is_active ? '#22C55E' : '#94A3B8',
                      }}>
                        {cat.is_active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Routing — full CRUD for their municipality */}
      {activeTab === 'routing' && (
        <RoutingTable
          routings={routings}
          routingsLoading={routingsLoading}
          onEdit={openEditRouting}
          onDelete={handleDeleteRouting}
          onAdd={openCreateRouting}
          readOnlyMunicipalityId={municipalityId}
          getMunicipalityName={getMunicipalityName}
          getCategoryName={getCategoryName}
        />
      )}

      <RoutingModal
        open={routingModalOpen}
        onClose={closeRoutingModal}
        editingRouting={editingRouting}
        routingForm={routingForm}
        setRoutingForm={setRoutingForm}
        onSubmit={handleRoutingSubmit}
        isSubmitting={isRoutingSubmitting}
        categories={categories}
        municipalities={municipalities}
        isMunicipalityAdmin={true}
      />
    </div>
  )
}

// ── Superadmin View ──────────────────────────────────────────────────────────

function SuperAdminView() {
  const {
    activeTab, setActiveTab,
    categories, categoriesLoading,
    categoryForm, setCategoryForm,
    editingCategory, categoryModalOpen,
    openCreateCategory, openEditCategory, closeCategoryModal,
    handleCategorySubmit, handleDeleteCategory, toggleCategoryActive,
    isCategorySubmitting,
    cities, citiesLoading,
    cityForm, setCityForm,
    cityModalOpen, setCityModalOpen,
    handleCreateCity, handleDeleteCity, isCitySubmitting,
    municipalities, municipalitiesLoading,
    municipalityForm, setMunicipalityForm,
    municipalityModalOpen, setMunicipalityModalOpen,
    handleCreateMunicipality, handleDeleteMunicipality, isMunicipalitySubmitting,
    routings, routingsLoading,
    routingForm, setRoutingForm,
    editingRouting, routingModalOpen,
    categories: routingCategories,
    municipalities: routingMunicipalities,
    getMunicipalityName, getCategoryName,
    openCreateRouting, openEditRouting, closeRoutingModal,
    handleRoutingSubmit, handleDeleteRouting, isRoutingSubmitting,
  } = useSuperAdminLogic()

  const tabs = [
    { key: 'categories', label: 'Категории', icon: <Tag size={14} /> },
    { key: 'routing', label: 'Email рутирање', icon: <Mail size={14} /> },
    { key: 'cities', label: 'Градови', icon: <MapPin size={14} /> },
    { key: 'municipalities', label: 'Општини', icon: <Building2 size={14} /> },
  ]

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
        }
      `}</style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Администрација</h1>
          <p style={styles.pageSubtitle}>Управување со целиот систем</p>
        </div>
        <span style={{
          ...styles.roleBadge,
          background: '#FEF3C7',
          color: '#92400E',
        }}>
          ⚡ Супер Администратор
        </span>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button
            key={t.key}
            style={{ ...styles.tab, ...(activeTab === t.key ? styles.tabActive : styles.tabInactive) }}
            onClick={() => setActiveTab(t.key as any)}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      {activeTab === 'categories' && (
        <div>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>{categories?.length ?? 0} категории</span>
            <button className="add-btn" style={styles.addBtn} onClick={openCreateCategory}>
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
                  <tr><td colSpan={5} style={styles.emptyState}>Се вчитува...</td></tr>
                )}
                {categories?.map((cat: any) => (
                  <tr key={cat.id}>
                    <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>#{cat.id}</td>
                    <td style={styles.td}><span style={{ fontWeight: 500 }}>{cat.name}</span></td>
                    <td style={{ ...styles.td, color: '#64748B' }}>{cat.description || '—'}</td>
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
                      <button className="icon-btn" style={styles.iconBtn} onClick={() => toggleCategoryActive(cat)}
                        title={cat.is_active ? 'Деактивирај' : 'Активирај'}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}>
                          {cat.is_active ? 'OFF' : 'ON'}
                        </span>
                      </button>
                      <button className="icon-btn" style={styles.iconBtn} onClick={() => openEditCategory(cat)}>
                        <Pencil size={13} color="#64748B" />
                      </button>
                      <button className="icon-btn icon-btn-danger" style={styles.iconBtn} onClick={() => handleDeleteCategory(cat.id)}>
                        <Trash2 size={13} color="#64748B" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Category Modal */}
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
                    onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Опис (опционално)</label>
                  <textarea
                    style={styles.textarea}
                    placeholder="Краток опис..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div style={styles.modalActions}>
                  <button className="cancel-btn" style={styles.cancelBtn} onClick={closeCategoryModal}>Откажи</button>
                  <button className="confirm-btn" style={styles.confirmBtn} onClick={handleCategorySubmit} disabled={isCategorySubmitting}>
                    {isCategorySubmitting ? 'Се зачувува...' : 'Зачувај'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Routing */}
      {activeTab === 'routing' && (
        <RoutingTable
          routings={routings}
          routingsLoading={routingsLoading}
          onEdit={openEditRouting}
          onDelete={handleDeleteRouting}
          onAdd={openCreateRouting}
          getMunicipalityName={getMunicipalityName}
          getCategoryName={getCategoryName}
        />
      )}

      {/* Cities */}
      {activeTab === 'cities' && (
        <div>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>{cities?.length ?? 0} градови</span>
            <button className="add-btn" style={styles.addBtn} onClick={() => setCityModalOpen(true)}>
              <Plus size={14} />
              Додај град
            </button>
          </div>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['#', 'Име', 'Земја', 'Акции'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {citiesLoading && <tr><td colSpan={4} style={styles.emptyState}>Се вчитува...</td></tr>}
                {cities?.map((city: any) => (
                  <tr key={city.id}>
                    <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>#{city.id}</td>
                    <td style={styles.td}><span style={{ fontWeight: 500 }}>{city.name}</span></td>
                    <td style={{ ...styles.td, color: '#64748B' }}>{city.country}</td>
                    <td style={styles.td}>
                      <button className="icon-btn icon-btn-danger" style={styles.iconBtn} onClick={() => handleDeleteCity(city.id)}>
                        <Trash2 size={13} color="#64748B" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cityModalOpen && (
            <div style={styles.overlay} onClick={() => setCityModalOpen(false)}>
              <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalTitle}>Додај град</div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Име *</label>
                  <input style={styles.input} placeholder="пр. Велес" value={cityForm.name}
                    onChange={(e) => setCityForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Земја</label>
                  <input style={styles.input} value={cityForm.country}
                    onChange={(e) => setCityForm((p) => ({ ...p, country: e.target.value }))} />
                </div>
                <div style={styles.modalActions}>
                  <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setCityModalOpen(false)}>Откажи</button>
                  <button className="confirm-btn" style={styles.confirmBtn} onClick={handleCreateCity} disabled={isCitySubmitting}>
                    {isCitySubmitting ? 'Се зачувува...' : 'Зачувај'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Municipalities */}
      {activeTab === 'municipalities' && (
        <div>
          <div style={styles.sectionHeader}>
            <span style={styles.sectionTitle}>{municipalities?.length ?? 0} општини</span>
            <button className="add-btn" style={styles.addBtn} onClick={() => setMunicipalityModalOpen(true)}>
              <Plus size={14} />
              Додај општина
            </button>
          </div>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['#', 'Име', 'Град ID', 'Акции'].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {municipalitiesLoading && <tr><td colSpan={4} style={styles.emptyState}>Се вчитува...</td></tr>}
                {municipalities?.map((m: any) => (
                  <tr key={m.id}>
                    <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>#{m.id}</td>
                    <td style={styles.td}><span style={{ fontWeight: 500 }}>{m.name}</span></td>
                    <td style={{ ...styles.td, color: '#64748B' }}>#{m.city_id}</td>
                    <td style={styles.td}>
                      <button className="icon-btn icon-btn-danger" style={styles.iconBtn} onClick={() => handleDeleteMunicipality(m.id)}>
                        <Trash2 size={13} color="#64748B" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {municipalityModalOpen && (
            <div style={styles.overlay} onClick={() => setMunicipalityModalOpen(false)}>
              <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div style={styles.modalTitle}>Додај општина</div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Име *</label>
                  <input style={styles.input} placeholder="пр. Општина Велес" value={municipalityForm.name}
                    onChange={(e) => setMunicipalityForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>Град *</label>
                  <select style={styles.select} value={municipalityForm.city_id}
                    onChange={(e) => setMunicipalityForm((p) => ({ ...p, city_id: e.target.value }))}>
                    <option value="">Изберете град</option>
                    {cities?.map((c: any) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.modalActions}>
                  <button className="cancel-btn" style={styles.cancelBtn} onClick={() => setMunicipalityModalOpen(false)}>Откажи</button>
                  <button className="confirm-btn" style={styles.confirmBtn} onClick={handleCreateMunicipality} disabled={isMunicipalitySubmitting}>
                    {isMunicipalitySubmitting ? 'Се зачувува...' : 'Зачувај'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shared Routing Modal */}
      <RoutingModal
        open={routingModalOpen}
        onClose={closeRoutingModal}
        editingRouting={editingRouting}
        routingForm={routingForm}
        setRoutingForm={setRoutingForm}
        onSubmit={handleRoutingSubmit}
        isSubmitting={isRoutingSubmitting}
        categories={routingCategories}
        municipalities={routingMunicipalities}
        isMunicipalityAdmin={false}
      />
    </div>
  )
}

// ── Entry Point ──────────────────────────────────────────────────────────────

export default function AdminPage() {
  const { user } = useAuthStore()

  if (user?.role === 'superadmin') return <SuperAdminView />
  return <MunicipalityAdminView />
}