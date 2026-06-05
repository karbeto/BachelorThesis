import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  User,
  Mail,
  RefreshCw,
} from "lucide-react";
import L from "leaflet";
import {
  useReportDetailLogic,
  STATUS_MK,
  STATUS_COLORS,
  STATUS_OPTIONS,
} from "./logic";
import { styles } from "./style";
import { BASE_URL } from "./../../api/client";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || { bg: "#F1F5F9", color: "#64748B" };
  return (
    <span
      style={{
        fontSize: 13,
        fontWeight: 500,
        padding: "4px 12px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
      }}
    >
      {STATUS_MK[status] || status}
    </span>
  );
}

export default function ReportDetailPage() {
  const {
    report,
    history,
    isLoading,
    modalOpen,
    newStatus,
    statusNote,
    setNewStatus,
    setStatusNote,
    openModal,
    closeModal,
    handleStatusUpdate,
    isUpdating,
    goBack,
  } = useReportDetailLogic();

  if (isLoading) {
    return <div style={styles.loadingWrap}>Се вчитува...</div>;
  }

  if (!report) {
    return <div style={styles.loadingWrap}>Пријавата не е пронајдена.</div>;
  }

  const hasLocation = report.latitude != null && report.longitude != null;

  return (
    <div style={styles.root}>
      <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
          * { box-sizing: border-box; }
          .back-btn:hover { color: #0F172A !important; }
          .update-btn:hover { background: #1E293B !important; }
          .cancel-btn:hover { background: #F8FAFC !important; }
          .confirm-btn:hover { background: #1E293B !important; }
          
          /* LOWER THE LEAFLET MAP ELEMENT STACKING LAYERS */
          .leaflet-container { 
            border-radius: 10px; 
            z-index: 1 !important; 
          }
          .leaflet-pane { 
            z-index: 1 !important; 
          }
          .leaflet-top, .leaflet-bottom { 
            z-index: 2 !important; 
          }
`}</style>

      {/* Back */}
      <button className="back-btn" style={styles.backBtn} onClick={goBack}>
        <ChevronLeft size={16} />
        Назад кон пријави
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleGroup}>
          <h1 style={styles.pageTitle}>{report.title}</h1>
          <div style={styles.metaRow}>
            <StatusBadge status={report.status} />
            <span style={styles.metaItem}>
              <span style={{ fontWeight: 600, color: "#94A3B8", fontSize: 12 }}>
                #{report.id}
              </span>
            </span>
            <span style={styles.metaItem}>
              <Calendar size={13} />
              {new Date(report.created_at).toLocaleDateString("mk-MK")}
            </span>
            {report.is_duplicate && (
              <span
                style={{
                  fontSize: 12,
                  background: "#FEF2F2",
                  color: "#EF4444",
                  padding: "2px 10px",
                  borderRadius: 20,
                }}
              >
                Дупликат
              </span>
            )}
          </div>
        </div>
        <button
          className="update-btn"
          style={styles.updateBtn}
          onClick={openModal}
        >
          <RefreshCw size={14} />
          Промени статус
        </button>
      </div>

      {/* Main grid */}
      <div style={styles.grid}>
        {/* Left column */}
        <div style={styles.leftCol}>
          {/* Description */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Опис</div>
            <p style={styles.descText}>{report.description || "Нема опис."}</p>
          </div>

          {/* Map */}
          {hasLocation && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>
                <MapPin size={14} color="#38BDF8" />
                Локација
              </div>
              <div style={styles.mapWrap}>
                <MapContainer
                  center={[report.latitude, report.longitude]}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={true}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                  />
                  <Marker position={[report.latitude, report.longitude]}>
                    <Popup>
                      <span
                        style={{
                          fontFamily: "DM Sans, sans-serif",
                          fontSize: 13,
                        }}
                      >
                        {report.title}
                      </span>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              {report.address && (
                <p style={{ fontSize: 13, color: "#64748B", marginTop: 12 }}>
                  📍 {report.address}
                </p>
              )}
            </div>
          )}

          {/* Images */}
          {report.images?.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>Фотографии</div>
              <div style={styles.imageGrid}>
                {report.images.map((img: any) => (
                  <img
                    key={img.id}
                    src={`${BASE_URL}${img.image_url}`}
                    alt="report"
                    style={styles.imageThumb}
                    onClick={() =>
                      window.open(`${BASE_URL}${img.image_url}`, "_blank")
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={styles.rightCol}>
          {/* Info card */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Детали</div>
            <div>
              {[
                {
                  label: "Категорија",
                  value: report.category_name || `#${report.category_id}`,
                },
                {
                  label: "Општина",
                  value:
                    report.municipality_name || `#${report.municipality_id}`,
                },
                {
                  label: "Корисник",
                  value:
                    report.user_full_name ||
                    (report.user_id ? `#${report.user_id}` : "Анонимен"),
                },
                {
                  label: "Мејл пратен",
                  value: report.email_sent ? "✓ Да" : "✗ Не",
                },
                {
                  label: "Дупликат",
                  value: report.is_duplicate ? "✓ Да" : "✗ Не",
                },
                { label: "Гласови", value: report.vote_count ?? 0 },
                {
                  label: "Поднесено",
                  value: new Date(report.created_at).toLocaleString("mk-MK"),
                },
                {
                  label: "Ажурирано",
                  value: new Date(report.updated_at).toLocaleString("mk-MK"),
                },
              ].map(({ label, value }, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.infoRow,
                    ...(i === 9 ? { borderBottom: "none" } : {}),
                  }}
                >
                  <span style={styles.infoLabel}>{label}</span>
                  <span style={styles.infoValue}>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status history */}
          <div style={styles.card}>
            <div style={styles.cardTitle}>Историја на статус</div>
            {!history || history.length === 0 ? (
              <div style={styles.emptyHistory}>Нема промени на статус</div>
            ) : (
              <div style={styles.historyList}>
                {history.map((h: any, i: number) => (
                  <div key={h.id} style={styles.historyItem}>
                    {i < history.length - 1 && (
                      <div style={styles.historyLine} />
                    )}
                    <div
                      style={{
                        ...styles.historyDot,
                        background:
                          STATUS_COLORS[h.new_status]?.color || "#38BDF8",
                      }}
                    />
                    <div style={styles.historyContent}>
                      <span style={styles.historyStatus}>
                        {STATUS_MK[h.old_status]} → {STATUS_MK[h.new_status]}
                      </span>
                      {h.note && (
                        <span style={styles.historyNote}>{h.note}</span>
                      )}
                      <span style={styles.historyDate}>
                        {new Date(h.changed_at).toLocaleString("mk-MK")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status modal */}
      {modalOpen && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Промени статус</div>
            <div style={styles.modalSubtitle}>
              Пријава #{report.id} — {report.title}
            </div>

            <label style={styles.modalLabel}>Нов статус</label>
            <select
              style={styles.modalSelect}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <label style={styles.modalLabel}>Забелешка (опционално)</label>
            <textarea
              style={styles.modalTextarea}
              placeholder="Опционална забелешка за промената..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />

            <div style={styles.modalActions}>
              <button
                className="cancel-btn"
                style={styles.cancelBtn}
                onClick={closeModal}
              >
                Откажи
              </button>
              <button
                className="confirm-btn"
                style={styles.confirmBtn}
                onClick={handleStatusUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? "Се зачувува..." : "Зачувај"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
