import React from 'react';

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
      * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
      .add-btn:hover { background: #1E293B !important; }
      .icon-btn:hover { background: #F8FAFC !important; border-color: #CBD5E1 !important; }
      .icon-btn-danger:hover { background: #FEF2F2 !important; border-color: #FECACA !important; }
      .icon-btn-danger:hover svg { color: #EF4444 !important; }
      .cancel-btn:hover { background: #F8FAFC !important; }
      .confirm-btn:hover { background: #1E293B !important; }
      input:focus, textarea:focus, select:focus {
        border-color: #38BDF8 !important;
        background: #FFFFFF !important;
        outline: none;
      }
    `}</style>
  );
}