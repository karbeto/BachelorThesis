import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { styles } from '../style';

interface Category {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

interface CategoryManagementProps {
  categories: Category[];
  categoriesLoading: boolean;
  isReadOnly?: boolean;
  onOpenCreate?: () => void;
  onOpenEdit?: (cat: Category) => void;
  onDelete?: (id: number) => void;
  onToggleActive?: (cat: Category) => void;
}

export function CategoryManagement({
  categories,
  categoriesLoading,
  isReadOnly = false,
  onOpenCreate,
  onOpenEdit,
  onDelete,
  onToggleActive,
}: CategoryManagementProps) {
  return (
    <div>
      {!isReadOnly && (
        <div style={styles.sectionHeader}>
          <span style={styles.sectionTitle}>{categories?.length ?? 0} категории</span>
          <button className="add-btn" style={styles.addBtn} onClick={onOpenCreate}>
            <Plus size={14} /> Додај категорија
          </button>
        </div>
      )}

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['#', 'Име', 'Опис', 'Статус', ...(!isReadOnly ? ['Акции'] : [])].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categoriesLoading && (
              <tr><td colSpan={isReadOnly ? 4 : 5} style={styles.emptyState}>Се вчитува...</td></tr>
            )}
            {!categoriesLoading && (!categories || categories.length === 0) && (
              <tr><td colSpan={isReadOnly ? 4 : 5} style={styles.emptyState}>Нема приказ на категории</td></tr>
            )}
            {!categoriesLoading && categories?.map((cat) => (
              <tr key={cat.id}>
                <td style={{ ...styles.td, color: '#94A3B8', fontFamily: 'monospace', fontSize: 12 }}>#{cat.id}</td>
                <td style={styles.td}><span style={{ fontWeight: 500 }}>{cat.name}</span></td>
                <td style={{ ...styles.td, color: '#64748B' }}>{cat.description || '—'}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.activePill,
                    background: cat.is_active ? '#F0FDF4' : '#F8FAFC',
                    color: cat.is_active ? '#22C55E' : '#94A3B8',
                  }}>
                    {cat.is_active ? 'Активна' : 'Неактивна'}
                  </span>
                </td>
                {!isReadOnly && onToggleActive && onOpenEdit && onDelete && (
                  <td style={styles.td}>
                    <button className="icon-btn" style={styles.iconBtn} onClick={() => onToggleActive(cat)} title={cat.is_active ? 'Деактивирај' : 'Активирај'}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#64748B' }}>{cat.is_active ? 'OFF' : 'ON'}</span>
                    </button>
                    <button className="icon-btn" style={styles.iconBtn} onClick={() => onOpenEdit(cat)}>
                      <Pencil size={13} color="#64748B" />
                    </button>
                    <button className="icon-btn icon-btn-danger" style={styles.iconBtn} onClick={() => onDelete(cat.id)}>
                      <Trash2 size={13} color="#64748B" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}