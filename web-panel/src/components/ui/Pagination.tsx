import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  skip: number;
  limit: number;
  currentCount: number;
  onPrev: () => void;
  onNext: () => void;
  styles: any;
}

export const Pagination: React.FC<PaginationProps> = ({
  skip,
  limit,
  currentCount,
  onPrev,
  onNext,
  styles,
}) => {
  return (
    <div style={styles.pagination}>
      <button
        className="page-btn"
        style={styles.pageBtn}
        onClick={onPrev}
        disabled={skip === 0}
      >
        <ChevronLeft size={16} />
      </button>
      <span style={styles.pageInfo}>
        {skip + 1} — {skip + currentCount}
      </span>
      <button
        className="page-btn"
        style={styles.pageBtn}
        onClick={onNext}
        disabled={currentCount < limit}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};