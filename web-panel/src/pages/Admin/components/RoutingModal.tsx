import React from 'react';
import { styles } from '../style';

interface OptionItem { id: number | string; name: string; }
interface RoutingFormData {
  municipality_id: string;
  category_id: string;
  routing_email: string;
  department_name: string;
}

interface RoutingModalProps {
  open: boolean;
  onClose: () => void;
  editingRouting: boolean;
  routingForm: RoutingFormData;
  setRoutingForm: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  isSubmitting: boolean;
  categories: OptionItem[];
  municipalities: OptionItem[];
  cities?: any[];
  isMunicipalityAdmin?: boolean;
}

export function RoutingModal({
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
}: RoutingModalProps) {
  if (!open) return null;

  const updateField = (field: keyof RoutingFormData, value: string) => {
    setRoutingForm((prev: RoutingFormData) => ({ ...prev, [field]: value }));
  };

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
              onChange={(e) => updateField('municipality_id', e.target.value)}
            >
              <option value="">Изберете општина</option>
              {municipalities?.map((m) => (
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
              onChange={(e) => updateField('category_id', e.target.value)}
            >
              <option value="">Изберете категорија</option>
              {categories?.map((c) => (
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
            onChange={(e) => updateField('routing_email', e.target.value)}
          />
        </div>

        <div style={styles.fieldWrap}>
          <label style={styles.label}>Служба (опционално)</label>
          <input
            style={styles.input}
            placeholder="пр. ЈП Комуналец"
            value={routingForm.department_name}
            onChange={(e) => updateField('department_name', e.target.value)}
          />
        </div>

        <div style={styles.modalActions}>
          <button className="cancel-btn" style={styles.cancelBtn} onClick={onClose}>Откажи</button>
          <button className="confirm-btn" style={styles.confirmBtn} onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Се зачувува...' : 'Зачувај'}
          </button>
        </div>
      </div>
    </div>
  );
}