import React from 'react';
import { IDEA_STATUS_OPTIONS } from '../../../constants/statusConfig';

interface IdeaFiltersProps {
  value: string;
  onFilterChange: (value: string) => void;
  styles: any;
}

export const IdeaFilters: React.FC<IdeaFiltersProps> = ({ value, onFilterChange, styles }) => {
  return (
    <div style={styles.filtersRow}>
      <select
        style={styles.select}
        value={value}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        {IDEA_STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
};