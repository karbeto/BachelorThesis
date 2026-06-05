import React from 'react';
import { IDEA_STATUS_MK } from '../../../constants/statusConfig';

interface IdeaInfoDetailsProps {
  idea: any;
  styles: any;
}

export const IdeaInfoDetails: React.FC<IdeaInfoDetailsProps> = ({ idea, styles }) => {
  const infoRows = [
    { label: 'ID', value: `#${idea.id}` },
    { label: 'Статус', value: IDEA_STATUS_MK[idea.status] || idea.status },
    { label: 'Општина', value: idea.municipality_name || `#${idea.municipality_id}` },
    { label: 'Поднесено од', value: idea.user_full_name || `#${idea.user_id}` },
    { label: 'Гласови', value: idea.vote_count ?? 0 },
    { label: 'Поднесено', value: new Date(idea.created_at).toLocaleString('mk-MK') },
    { label: 'Ажурирано', value: new Date(idea.updated_at).toLocaleString('mk-MK') },
  ];

  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>Детали</div>
      {infoRows.map(({ label, value }, i) => (
        <div
          key={i}
          style={{
            ...styles.infoRow,
            ...(i === infoRows.length - 1 ? { borderBottom: 'none' } : {}),
          }}
        >
          <span style={styles.infoLabel}>{label}</span>
          <span style={styles.infoValue}>{String(value)}</span>
        </div>
      ))}
    </div>
  );
};