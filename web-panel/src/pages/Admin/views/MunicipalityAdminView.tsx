import React from 'react';
import { Tag, Mail, Building2, Info } from 'lucide-react';
import { useMunicipalityAdminLogic } from '../logic';
import { styles } from '../style';
import { GlobalStyles } from '../components/GlobalStyles';
import { RoutingTable } from '../components/RoutingTable';
import { RoutingModal } from '../components/RoutingModal';
import { CategoryManagement } from '../components/CategoryManagement';

export function MunicipalityAdminView() {
  const {
    activeTab, setActiveTab, categories, categoriesLoading, routings, routingsLoading,
    routingForm, setRoutingForm, editingRouting, routingModalOpen, municipalities,
    getMunicipalityName, getCategoryName, openCreateRouting, openEditRouting,
    closeRoutingModal, handleRoutingSubmit, handleDeleteRouting, isRoutingSubmitting, municipalityId,
  } = useMunicipalityAdminLogic();

  return (
    <div style={styles.root}>
      <GlobalStyles />
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Администрација</h1>
          <p style={styles.pageSubtitle}>Управување со вашата општина</p>
        </div>
        <span style={{ ...styles.roleBadge, background: '#F0F9FF', color: '#0369A1' }}>
          <Building2 size={13} /> Општина Админ
        </span>
      </div>

      <div style={styles.tabs}>
        <button style={{ ...styles.tab, ...(activeTab === 'categories' ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab('categories')}>
          <Tag size={14} /> Категории
        </button>
        <button style={{ ...styles.tab, ...(activeTab === 'routing' ? styles.tabActive : styles.tabInactive) }} onClick={() => setActiveTab('routing')}>
          <Mail size={14} /> Email рутирање
        </button>
      </div>

      {activeTab === 'categories' && (
        <>
          <div style={styles.readOnlyNote}>
            <Info size={15} /> Категориите се управуваат од Супер Администраторот. Прегледувате само.
          </div>
          <CategoryManagement categories={categories} categoriesLoading={categoriesLoading} isReadOnly />
        </>
      )}

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
        isMunicipalityAdmin
      />
    </div>
  );
}