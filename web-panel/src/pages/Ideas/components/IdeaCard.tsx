import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { IdeaStatusBadge } from '../../../components/ui/IdeaStatusBadge';

interface IdeaCardProps {
  idea: any;
  onOpenModal: (idea: any) => void;
  styles: any;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onOpenModal, styles }) => {
  return (
    <div className="idea-card" style={styles.ideaCard}>
      <div style={styles.ideaCardTop}>
        <span style={styles.ideaTitle}>{idea.title}</span>
        <IdeaStatusBadge status={idea.status} />
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
        onClick={() => onOpenModal(idea)}
      >
        Промени статус
      </button>
    </div>
  );
};