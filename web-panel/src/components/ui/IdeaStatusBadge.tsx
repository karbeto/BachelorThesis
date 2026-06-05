import React from 'react';
import { IDEA_STATUS_COLORS, IDEA_STATUS_MK } from '../../constants/statusConfig';

export const IdeaStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = IDEA_STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        whiteSpace: 'nowrap',
      }}
    >
      {IDEA_STATUS_MK[status] || status}
    </span>
  );
};