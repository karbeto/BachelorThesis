import React from 'react';
import { STATUS_OPTIONS } from '../../../constants/statusConfig';

interface StatusUpdateModalProps {
  report: any;
  newStatus: string;
  statusNote: string;
  isUpdating: boolean;
  setNewStatus: (status: string) => void;
  setStatusNote: (note: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  styles: any;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  report,
  newStatus,
  statusNote,
  isUpdating,
  setNewStatus,
  setStatusNote,
  onClose,
  onConfirm,
  styles,
}) => {
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalTitle}>Промени статус</div>
        <div style={styles.modalSubtitle}>
          Пријава #{report.id} — {report.title}
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
          <button style={styles.cancelBtn} onClick={onClose}>
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