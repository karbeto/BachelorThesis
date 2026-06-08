import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
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

import { useDashboardLogic, RecentReportItem, HeatmapPoint } from "./logic";
import { styles, globalStyles, STATUS_COLORS, STATUS_MK } from "./style";

// Helper component to explicitly update Leaflet's camera center based on data loads
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

// Self-contained component to handle Browser Geolocation safely inside the Leaflet context
function UserLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
        map.setView(coords, 14); // Centers map on the admin's device location
      },
      (error) => {
        console.warn("Browser Geolocation permission denied or unavailable:", error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map]);

  if (!position) return null;

  return (
    <CircleMarker
      center={position}
      radius={8}
      pathOptions={{
        color: "#ffff00",     
        fillColor: "ffff00",
        fillOpacity: 0.9,
        weight: 3,
      }}
    >
      <Popup>
        <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13, fontWeight: 600, color: "#4F46E5" }}>
          📍 Вашата моментална локација
        </span>
      </Popup>
    </CircleMarker>
  );
}

interface StatCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number | undefined;
  color: string;
  bg: string;
}

function StatCard({ icon: Icon, label, value, color, bg }: StatCardProps) {
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
        background: STATUS_COLORS[status] ? STATUS_COLORS[status] + "18" : "#E2E8F0",
        color: STATUS_COLORS[status] || "#64748B",
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
    reportsLoading,
    heatmap,
    recentReports,
    categoryData,
    mapCenter,
    formattedDate,
    handleRowClick,
  } = useDashboardLogic();

  const chartColors = ["#38BDF8", "#6366F1", "#22C55E", "#F59E0B", "#EF4444"];

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
              <RecenterMap center={mapCenter} />
              <UserLocationMarker /> {/* Live browser location engine */}
              
              {heatmap?.map((point: HeatmapPoint) => (
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
                    <span style={{ fontFamily: "DM Sans, sans-serif", fontSize: 13 }}>
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
                      key={`cell-${i}`}
                      fill={chartColors[i % chartColors.length]}
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
              {((!recentReports || recentReports.length === 0) && !reportsLoading) && (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    Нема пријави
                  </td>
                </tr>
              )}
              {reportsLoading && (
                <tr>
                  <td colSpan={5} style={styles.empty}>
                    Се вчитува...
                  </td>
                </tr>
              )}
              {recentReports?.map((r: RecentReportItem) => (
                <tr 
                  key={r.id} 
                  className="report-row" 
                  style={{ ...styles.tr, cursor: 'pointer' }}
                  onClick={() => handleRowClick(r.id)}
                >
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