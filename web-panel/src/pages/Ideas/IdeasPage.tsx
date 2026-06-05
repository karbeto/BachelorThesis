import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useIdeasLogic } from './logic';
import { styles } from './style';
import { IdeaFilters } from './components/IdeaFilters';
import { IdeaCard } from './components/IdeaCard';
import { IdeaStatusModal } from './components/IdeaStatusModal';

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
  } = useIdeasLogic();

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
      <IdeaFilters
        value={filters.status}
        onFilterChange={(val) => handleFilterChange('status', val)}
        styles={styles}
      />

      {/* Grid Container */}
      <div style={styles.grid}>
        {isLoading && <div style={styles.loadingState}>Се вчитува...</div>}

        {!isLoading && ideas?.length === 0 && (
          <div style={styles.emptyState}>
            <Lightbulb
              size={36}
              style={{ opacity: 0.2, display: 'block', margin: '0 auto 12px' }}
            />
            Нема предлози
          </div>
        )}

        {!isLoading &&
          ideas?.map((idea: any) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onOpenModal={openModal}
              styles={styles}
            />
          ))}
      </div>

      {/* Active Selection Overlay */}
      {selectedIdea && (
        <IdeaStatusModal
          idea={selectedIdea}
          newStatus={newStatus}
          isUpdating={isUpdating}
          setNewStatus={setNewStatus}
          onClose={closeModal}
          onConfirm={handleStatusUpdate}
          styles={styles}
        />
      )}
    </div>
  );
}