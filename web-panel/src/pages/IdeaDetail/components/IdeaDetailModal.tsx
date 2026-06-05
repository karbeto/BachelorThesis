import React from 'react';
import { IDEA_STATUS_UPDATE_OPTIONS } from '../../../constants/statusConfig';

interface IdeaDetailModalProps {
  idea: any;
  newStatus: string;
  isUpdating: boolean;
  setNewStatus: (status: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  styles: any;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({
  idea,
  newStatus,
  isUpdating,
  setNewStatus,
  onClose,
  onConfirm,
  styles,
}) => {
  return (
    <div style={styles.overlay} onClick={onClose}>
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
          {IDEA_STATUS_UPDATE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div style={styles.modalActions}>
          <button className="cancel-btn" style={styles.cancelBtn} onClick={onClose}>
            Откажи
          </button>
          <button
            className="confirm-btn"
            style={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isUpdating}
          >
            {isUpdating ? 'Се зачувува...' : 'Зачувај'}
          </button>
        </div>
      </div>
    </div>
  );
};