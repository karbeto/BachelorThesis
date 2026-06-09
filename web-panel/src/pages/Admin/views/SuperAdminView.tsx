import React from 'react';
import { Plus, Tag, Mail, MapPin, Building2 } from 'lucide-react';
import { useSuperAdminLogic } from '../logic';
import { styles } from '../style';
import { GlobalStyles } from '../components/GlobalStyles';
import { RoutingTable } from '../components/RoutingTable';
import { RoutingModal } from '../components/RoutingModal';
import { CategoryManagement } from '../components/CategoryManagement';
import { GeographicManagement } from '../components/GeographicManagement';

export function SuperAdminView() {
  const {
    activeTab, setActiveTab, categories, categoriesLoading, categoryForm, setCategoryForm,
    editingCategory, categoryModalOpen, openCreateCategory, openEditCategory, closeCategoryModal,
    handleCategorySubmit, handleDeleteCategory, toggleCategoryActive, isCategorySubmitting,
    cities, citiesLoading, cityForm, setCityForm, cityModalOpen, setCityModalOpen,
    handleCreateCity, handleDeleteCity, isCitySubmitting, municipalities, municipalitiesLoading,
    municipalityForm, setMunicipalityForm, municipalityModalOpen, setMunicipalityModalOpen,
    handleCreateMunicipality, handleDeleteMunicipality, isMunicipalitySubmitting, routings, routingsLoading,
    routingForm, setRoutingForm, editingRouting, routingModalOpen, categories: routingCategories,
    municipalities: routingMunicipalities, getMunicipalityName, getCategoryName, openCreateRouting,
    openEditRouting, closeRoutingModal, handleRoutingSubmit, handleDeleteRouting, isRoutingSubmitting,
  } = useSuperAdminLogic();

  const tabs = [
    { key: 'categories', label: 'Категории', icon: <Tag size={14} /> },
    { key: 'routing', label: 'Email рутирање', icon: <Mail size={14} /> },
    { key: 'cities', label: 'Градови', icon: <MapPin size={14} /> },
    { key: 'municipalities', label: 'Општини', icon: <Building2 size={14} /> },
  ];

  return (
    <div style={styles.root}>
      <GlobalStyles />
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Администрација</h1>
          <p style={styles.pageSubtitle}>Управување со целиот систем</p>
        </div>
        <span style={{ ...styles.roleBadge, background: '#FEF3C7', color: '#92400E' }}>⚡ Супер Администратор</span>
      </div>

      <div style={styles.tabs}>
        {tabs.map((t) => (
          <button key={t.key} style={{ ...styles.tab, ...(activeTab === t.key ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab(t.key as any)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'categories' && (
        <CategoryManagement
          categories={categories}
          categoriesLoading={categoriesLoading}
          onOpenCreate={openCreateCategory}
          onOpenEdit={openEditCategory}
          onDelete={handleDeleteCategory}
          onToggleActive={toggleCategoryActive}
        />
      )}

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

      {activeTab === 'cities' && (
        <GeographicManagement mode="cities" data={cities} isLoading={citiesLoading} onOpenModal={() => setCityModalOpen(true)} onDelete={handleDeleteCity} />
      )}

      {activeTab === 'municipalities' && (
        <GeographicManagement 
          mode="municipalities" 
          data={municipalities} 
          cities={cities} // <-- Passed down here to perform the client-side ID to Name transformation
          isLoading={municipalitiesLoading} 
          onOpenModal={() => setMunicipalityModalOpen(true)} 
          onDelete={handleDeleteMunicipality} 
        />
      )}

      {/* Modals for Category, City, Municipality Creation/Edits */}
      {categoryModalOpen && (
        <div style={styles.overlay} onClick={closeCategoryModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>{editingCategory ? 'Уреди категорија' : 'Додај категорија'}</div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Име *</label>
              <input style={styles.input} placeholder="пр. Дупки на патот" value={categoryForm.name} onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Опис (опционално)</label>
              <textarea style={styles.textarea} placeholder="Краток опис..." value={categoryForm.description} onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))} />
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

      {cityModalOpen && (
        <div style={styles.overlay} onClick={() => setCityModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Додај град</div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Име *</label>
              <input style={styles.input} placeholder="пр. Велес" value={cityForm.name} onChange={(e) => setCityForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Земја</label>
              <input style={styles.input} value={cityForm.country} onChange={(e) => setCityForm((p) => ({ ...p, country: e.target.value }))} />
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

      {municipalityModalOpen && (
        <div style={styles.overlay} onClick={() => setMunicipalityModalOpen(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Додај општина</div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Име *</label>
              <input style={styles.input} placeholder="пр. Centar" value={municipalityForm.name} onChange={(e) => setMunicipalityForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Град *</label>
              <select style={styles.select} value={municipalityForm.city_id} onChange={(e) => setMunicipalityForm((p) => ({ ...p, city_id: e.target.value }))}>
                <option value="">Изберете град</option>
                {cities?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
        cities={cities}
        isMunicipalityAdmin={false}
      />
    </div>
  );
}