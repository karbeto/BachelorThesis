import React from 'react';
import { STATUS_OPTIONS } from '../../../constants/statusConfig';

interface ReportsFiltersProps {
  statusValue: string;
  categoryValue: string;
  categories: any[] | undefined;
  onFilterChange: (key: 'status' | 'category_id', value: string) => void;
  styles: any;
}

export const ReportsFilters: React.FC<ReportsFiltersProps> = ({
  statusValue,
  categoryValue,
  categories,
  onFilterChange,
  styles,
}) => {
  return (
    <div style={styles.filtersRow}>
      <select
        style={styles.select}
        value={statusValue}
        onChange={(e) => onFilterChange('status', e.target.value)}
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        style={styles.select}
        value={categoryValue}
        onChange={(e) => onFilterChange('category_id', e.target.value)}
      >
        <option value="">Сите категории</option>
        {categories?.map((c: any) => (
          <option key={c.id} value={String(c.id)}>{c.name}</option>
        ))}
      </select>
    </div>
  );
};