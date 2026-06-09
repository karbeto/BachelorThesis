import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { styles } from '../style';

interface GeographicManagementProps {
  mode: 'cities' | 'municipalities';
  data: any[];
  cities?: any[];
  isLoading: boolean;
  onOpenModal: () => void;
  onDelete: (id: number) => void;
}

export function GeographicManagement({ 
  mode, 
  data, 
  cities, 
  isLoading, 
  onOpenModal, 
  onDelete 
}: GeographicManagementProps) {
  const isCities = mode === 'cities';
  const headers = isCities ? ['#', 'Име', 'Земја', 'Акции'] : ['#', 'Име', 'Град', 'Акции'];

  return (
    <div>
      <div style={styles.sectionHeader}>
        <span style={styles.sectionTitle}>{data?.length ?? 0} {isCities ? 'градови' : 'општини'}</span>
        <button className="add-btn" style={styles.addBtn} onClick={onOpenModal}>
          <Plus size={14} /> Додај {isCities ? 'град' : 'општина'}
        </button>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {headers.map((h) => <th key={h} style={styles.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} style={styles.emptyState}>Се вчитува...</td></tr>}
            {!isLoading && data?.map((item) => {
              const cityName = !isCities 
                ? cities?.find((c: any) => c.id === item.city_id)?.name || `#${item.city_id}`
                : '';

              return (
                <tr key={item.id}>
                  <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>#{item.id}</td>
                  <td style={styles.td}><span style={{ fontWeight: 500 }}>{item.name}</span></td>
                  <td style={{ ...styles.td, color: '#64748B' }}>
                    {isCities ? item.country : cityName}
                  </td>
                  <td style={styles.td}>
                    <button className="icon-btn icon-btn-danger" style={styles.iconBtn} onClick={() => onDelete(item.id)}>
                      <Trash2 size={13} color="#64748B" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}