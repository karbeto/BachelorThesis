import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./style";
import { useMapLogic, STATUS_COLORS } from "./logic";
import { generateMapHtml } from "../../utils/mapTemplate";
import { MapLegend } from "./components/MapLegend";
import { ReportPreviewCard } from "./components/ReportPreviewCard";

const FILTER_OPTIONS = [
  { value: "", label: "Сите пријави" },
  { value: "submitted", label: "Поднесено" },
  { value: "in_progress", label: "Се решава" },
  { value: "resolved", label: "Решено" },
  { value: "rejected", label: "Одбиено" },
];

export default function MapScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const {
    reports,
    userLocation,
    isLoading,
    selectedReport,
    filterStatus,
    showFilters,
    setShowFilters,
    handleWebViewMessage,
    handleCardClose,
    handleCardPress,
    handleSubmitPress,
    handleFilterChange,
  } = useMapLogic();

  // Re-compiles HTML map source when markers change OR user location shifts coordinates
  const mapHtml = useMemo(() => {
    return generateMapHtml(reports, userLocation);
  }, [reports, userLocation]);

  return (
    <View style={styles.container}>
      {/* WebView Container Layer */}
      <View style={styles.map}>
        <WebView
          originWhitelist={["*"]}
          source={{ html: mapHtml }}
          onMessage={(event) => handleWebViewMessage(event.nativeEvent.data)}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>

      {/* Top Header Floating Control Panel Bar */}
      <View style={styles.topBar}>
        <View style={styles.titlePill}>
          <Ionicons name="map" size={16} color={theme.colors.accent} />
          <Text style={styles.titleText}>Пријави во областа</Text>
          {isLoading ? (
            <ActivityIndicator size="small" color={theme.colors.accent} style={{ marginLeft: 6 }} />
          ) : (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{reports.length}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterBtn,
            showFilters && { backgroundColor: theme.colors.primary },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowFilters(!showFilters);
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name="filter"
            size={18}
            color={showFilters ? "#FFFFFF" : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Conditional Filtering Action Dropdown Overlay */}
      {showFilters && (
        <View style={styles.filterDropdown}>
          {FILTER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.filterItem,
                filterStatus === opt.value && styles.filterItemActive,
              ]}
              onPress={() => handleFilterChange(opt.value)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.filterDot,
                  {
                    backgroundColor: opt.value
                      ? STATUS_COLORS[opt.value]
                      : theme.colors.textSecondary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.filterText,
                  filterStatus === opt.value && styles.filterTextActive,
                ]}
              >
                {opt.label}
              </Text>
              {filterStatus === opt.value && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={theme.colors.primary}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Bottom Floating Display Overlays (Legend OR Selected Detail Preview Card) */}
      {!selectedReport ? (
        <MapLegend styles={styles} />
      ) : (
        <ReportPreviewCard
          report={selectedReport}
          onClose={handleCardClose}
          onPress={handleCardPress}
          theme={theme}
          styles={styles}
        />
      )}

      {/* Action Submission Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleSubmitPress();
        }}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}