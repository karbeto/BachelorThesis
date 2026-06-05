import React from 'react';
import { ChevronLeft, ThumbsUp, Calendar, RefreshCw } from 'lucide-react';
import { useIdeaDetailLogic } from './logic';
import { styles } from './style';
import { IdeaStatusBadge } from '../../components/ui/IdeaStatusBadge';
import { IdeaInfoDetails } from './components/IdeaInfoDetails';
import { IdeaDetailModal } from './components/IdeaDetailModal';

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
  } = useIdeaDetailLogic();

  if (isLoading) {
    return <div style={styles.loadingWrap}>Се вчитува...</div>;
  }

  if (!idea) {
    return <div style={styles.loadingWrap}>Идејата не е пронајдена.</div>;
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

      {/* Navigation Control */}
      <button className="back-btn" style={styles.backBtn} onClick={goBack}>
        <ChevronLeft size={16} />
        Назад кон идеи
      </button>

      {/* Main Header Block */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.pageTitle}>{idea.title}</h1>
          <div style={styles.metaRow}>
            <IdeaStatusBadge status={idea.status} />
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

      {/* Layout Content Grid */}
      <div style={styles.grid}>
        {/* Left Side — Description Segment */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>Опис на идејата</div>
          <p style={styles.descText}>{idea.description}</p>

          <div style={{ marginTop: 8 }}>
            <span style={styles.votePill}>
              <ThumbsUp size={15} />
              {idea.vote_count ?? 0} граѓани ја поддржуваат
            </span>
          </div>
        </div>

        {/* Right Side — Dynamic Meta Metrics */}
        <IdeaInfoDetails idea={idea} styles={styles} />
      </div>

      {/* Status Management Dialog Overlay */}
      {modalOpen && (
        <IdeaDetailModal
          idea={idea}
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