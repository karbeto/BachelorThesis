import React from 'react';
import { STATUS_COLORS, STATUS_MK } from '../../constants/statusConfig';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = STATUS_COLORS[status] || { bg: '#F1F5F9', color: '#64748B' };
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 500,
        padding: '3px 10px',
        borderRadius: 20,
        display: 'inline-block',
        background: s.bg,
        color: s.color,
      }}
    >
      {STATUS_MK[status] || status}
    </span>
  );
};