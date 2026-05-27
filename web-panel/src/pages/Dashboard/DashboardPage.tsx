import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useDashboardLogic } from "./logic";
import { styles, globalStyles, STATUS_COLORS, STATUS_MK } from "./style";

// Helper Components
function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div style={styles.statCard} className="stat-card">
      <div style={{ ...styles.statIcon, background: bg, color }}>
        <Icon size={18} strokeWidth={2} />
      </div>
      <div>
        <div style={styles.statValue}>{value ?? "—"}</div>
        <div style={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      style={{
        ...styles.badge,
        background: STATUS_COLORS[status] + "18",
        color: STATUS_COLORS[status],
      }}
    >
      {STATUS_MK[status] || status}
    </span>
  );
}

export default function DashboardPage() {
  const {
    stats,
    statsLoading,
    heatmap,
    recentReports,
    categoryData,
    mapCenter,
    formattedDate,
  } = useDashboardLogic();

  return (
    <div style={styles.root}>
      <style>{globalStyles}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Преглед</h1>
          <p style={styles.pageSubtitle}>{formattedDate}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={FileText}
          label="Вкупно пријави"
          value={statsLoading ? "..." : stats?.stats?.total}
          color="#6366F1"
          bg="#EEF2FF"
        />
        <StatCard
          icon={Clock}
          label="Поднесено"
          value={statsLoading ? "..." : stats?.stats?.submitted}
          color="#F59E0B"
          bg="#FFFBEB"
        />
        <StatCard
          icon={Wrench}
          label="Се решава"
          value={statsLoading ? "..." : stats?.stats?.in_progress}
          color="#38BDF8"
          bg="#F0F9FF"
        />
        <StatCard
          icon={CheckCircle}
          label="Решено"
          value={statsLoading ? "..." : stats?.stats?.resolved}
          color="#22C55E"
          bg="#F0FDF4"
        />
        <StatCard
          icon={XCircle}
          label="Одбиено"
          value={statsLoading ? "..." : stats?.stats?.rejected}
          color="#EF4444"
          bg="#FEF2F2"
        />
      </div>

      {/* Map + Chart row */}
      <div style={styles.midRow}>
        <div style={styles.mapCard}>
          <div style={styles.cardHeader}>
            <MapPin size={16} color="#38BDF8" />
            <span style={styles.cardTitle}>Пријави на мапа</span>
            <span style={styles.cardCount}>{heatmap?.length || 0} локации</span>
          </div>
          <div style={styles.mapWrap}>
            <MapContainer
              center={mapCenter}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {heatmap?.map((point: any) => (
                <CircleMarker
                  key={point.report_id}
                  center={[point.latitude, point.longitude]}
                  radius={8}
                  pathOptions={{
                    color: "#38BDF8",
                    fillColor: "#38BDF8",
                    fillOpacity: 0.7,
                    weight: 2,
                    opacity: 1,
                  }}
                >
                  <Popup>
                    <span
                      style={{
                        fontFamily: "DM Sans, sans-serif",
                        fontSize: 13,
                      }}
                    >
                      Пријава #{point.report_id}
                    </span>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div style={styles.chartCard}>
          <div style={styles.cardHeader}>
            <TrendingUp size={16} color="#6366F1" />
            <span style={styles.cardTitle}>По категорија</span>
          </div>
          {categoryData.length === 0 ? (
            <div style={styles.empty}>Нема податоци</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ left: 8, right: 24, top: 8, bottom: 8 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{
                    fontSize: 12,
                    fontFamily: "DM Sans, sans-serif",
                    fill: "#64748B",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 13,
                    borderRadius: 10,
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  cursor={{ fill: "#F8FAFC" }}
                />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {categoryData.map((_: any, i: number) => (
                    <Cell
                      key={i}
                      fill={
                        ["#38BDF8", "#6366F1", "#22C55E", "#F59E0B", "#EF4444"][
                          i % 5
                        ]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent reports */}
      <div style={styles.tableCard}>
        <div style={styles.cardHeader}>
          <FileText size={16} color="#0F172A" />
          <span style={styles.cardTitle}>Последни пријави</span>
        </div>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["#", "Наслов", "Категорија", "Статус", "Датум"].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReports?.length === 0 && (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    Нема пријави
                  </td>
                </tr>
              )}
              {recentReports?.map((r: any) => (
                <tr key={r.id} className="report-row" style={styles.tr}>
                  <td style={styles.td}>
                    <span style={styles.reportId}>#{r.id}</span>
                  </td>
                  <td style={{ ...styles.td, maxWidth: 220 }}>
                    <span style={styles.reportTitle}>{r.title}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryPill}>
                      {r.category_name || `#${r.category_id}`}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <StatusBadge status={r.status} />
                  </td>
                  <td style={styles.td}>
                    <span style={styles.dateText}>
                      {new Date(r.created_at).toLocaleDateString("mk-MK")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
