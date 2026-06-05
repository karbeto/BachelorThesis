import React from 'react';
import { FileText } from 'lucide-react';
import { StatusBadge } from '../../../components/ui/StatusBadge';

interface ReportsTableProps {
  reports: any[] | undefined;
  isLoading: boolean;
  categories: any[] | undefined;
  onRowClick: (report: any) => void;
  onOpenStatusModal: (e: React.MouseEvent, report: any) => void;
  styles: any;
}

export const ReportsTable: React.FC<ReportsTableProps> = ({
  reports,
  isLoading,
  categories,
  onRowClick,
  onOpenStatusModal,
  styles,
}) => {
  return (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            {['#', 'Наслов', 'Категорија', 'Статус', 'Датум', 'Акција'].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={6} style={styles.loadingState}>Се вчитува...</td>
            </tr>
          )}
          {!isLoading && reports?.length === 0 && (
            <tr>
              <td colSpan={6} style={styles.emptyState}>
                <FileText size={32} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                Нема пријави
              </td>
            </tr>
          )}
          {!isLoading && reports?.map((r: any) => (
            <tr
              key={r.id}
              className="report-row"
              onClick={() => onRowClick(r)}
            >
              <td style={styles.td}>
                <span style={styles.reportId}>#{r.id}</span>
              </td>
              <td style={styles.td}>
                <span style={styles.reportTitle}>{r.title}</span>
                {r.description && (
                  <span style={styles.reportDesc}>{r.description}</span>
                )}
              </td>
              <td style={styles.td}>
                <span style={styles.categoryPill}>
                  {categories?.find((c: any) => c.id === r.category_id)?.name || `#${r.category_id}`}
                </span>
              </td>
              <td style={styles.td}>
                <StatusBadge status={r.status} />
              </td>
              <td style={styles.td}>
                <span style={styles.dateText}>
                  {new Date(r.created_at).toLocaleDateString('mk-MK')}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  className="action-btn"
                  style={styles.actionBtn}
                  onClick={(e) => onOpenStatusModal(e, r)}
                >
                  Промени статус
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};