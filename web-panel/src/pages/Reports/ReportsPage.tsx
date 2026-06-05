import React from 'react';
import { useReportsLogic } from './logic';
import { styles } from './style';
import { ReportsFilters } from './components/ReportsFilters';
import { ReportsTable } from './components/ReportsTable';
import { Pagination } from '../../components/ui/Pagination';
import { StatusUpdateModal } from './components/StatusUpdateModal';

export default function ReportsPage() {
  const {
    reports,
    isLoading,
    categories,
    filters,
    selectedReport,
    statusNote,
    newStatus,
    setStatusNote,
    setNewStatus,
    handleFilterChange,
    handleStatusUpdate,
    handleNextPage,
    handlePrevPage,
    openReport,
    openStatusModal,
    closeModal,
    isUpdating,
  } = useReportsLogic();

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .report-row { transition: background 0.1s; cursor: pointer; }
        .report-row:hover { background: #F8FAFC !important; }
        .action-btn:hover { background: #F1F5F9 !important; border-color: #CBD5E1 !important; }
        .page-btn:hover { background: #F8FAFC !important; }
        .confirm-btn:hover { background: #1E293B !important; }
      `}</style>

      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Пријави</h1>
          <p style={styles.pageSubtitle}>
            {reports?.length ?? 0} пријави прикажани
          </p>
        </div>
      </div>

      <ReportsFilters
        statusValue={filters.status}
        categoryValue={filters.category_id}
        categories={categories}
        onFilterChange={handleFilterChange}
        styles={styles}
      />

      <div style={styles.tableCard}>
        <ReportsTable
          reports={reports}
          isLoading={isLoading}
          categories={categories}
          onRowClick={openReport}
          onOpenStatusModal={openStatusModal}
          styles={styles}
        />

        <Pagination
          skip={filters.skip}
          limit={filters.limit}
          currentCount={reports?.length ?? 0}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
          styles={styles}
        />
      </div>

      {selectedReport && (
        <StatusUpdateModal
          report={selectedReport}
          newStatus={newStatus}
          statusNote={statusNote}
          isUpdating={isUpdating}
          setNewStatus={setNewStatus}
          setStatusNote={setStatusNote}
          onClose={closeModal}
          onConfirm={handleStatusUpdate}
          styles={styles}
        />
      )}
    </div>
  );
}