import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="18" fill="#0F172A" />
      <circle cx="18" cy="18" r="7" fill="#38BDF8" />
      <circle cx="18" cy="18" r="3" fill="#0F172A" />
      <circle cx="27" cy="11" r="2.5" fill="#38BDF8" opacity="0.5" />
      <circle cx="10" cy="26" r="2" fill="#38BDF8" opacity="0.3" />
    </svg>
  );
};