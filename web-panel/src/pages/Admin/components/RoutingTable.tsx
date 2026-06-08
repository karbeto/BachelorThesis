import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { styles } from '../style';

interface RoutingRecord {
  id: number;
  municipality_id: number;
  category_id: number;
  routing_email: string;
  department_name?: string;
  is_active: boolean;
}

interface RoutingTableProps {
  routings: RoutingRecord[];
  routingsLoading: boolean;
  onEdit: (routing: RoutingRecord) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
  readOnlyMunicipalityId?: string | number | null;
  getMunicipalityName: (id: number) => string;
  getCategoryName: (id: number) => string;
}

export function RoutingTable({
  routings,
  routingsLoading,
  onEdit,
  onDelete,
  onAdd,
  readOnlyMunicipalityId,
  getMunicipalityName,
  getCategoryName,
}: RoutingTableProps) {
  return (
    <div>
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.sectionTitle}>{routings?.length ?? 0} рутирања</div>
          {readOnlyMunicipalityId && (
            <div style={styles.sectionSubtitle}>Прикажани само за вашата општина</div>
          )}
        </div>
        <button className="add-btn" style={styles.addBtn} onClick={onAdd}>
          <Plus size={14} /> Додај рутирање
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
            {!routingsLoading && (!routings || routings.length === 0) && (
              <tr><td colSpan={7} style={styles.emptyState}>Нема рутирања</td></tr>
            )}
            {!routingsLoading && routings?.map((r) => (
              <tr key={r.id}>
                <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>#{r.id}</td>
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
  );
}