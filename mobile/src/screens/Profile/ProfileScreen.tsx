import React, { useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Modal, Switch } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useTheme } from '../../context/ThemeContext'
import { createStyles } from './style'
import { useProfileLogic } from './logic'
import { PasswordModal } from './components/PasswordModal'

export default function ProfileScreen() {
  const { theme } = useTheme()
  const styles = createStyles(theme)
  const {
    user,
    stats,
    isDarkMode,
    toggleTheme,
    passwordModal,
    logoutModal,
    currentPassword,
    newPassword,
    confirmPassword,
    changingPassword,
    handleChangePassword,
    handleLogout,
    getRoleLabel,
  } = useProfileLogic()

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  if (!user) return null

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Pure Typographic Identity Header */}
        <View style={styles.hero}>
          <View style={styles.heroDetails}>
            <Text style={styles.userName} numberOfLines={1}>{user.full_name}</Text>
            <Text style={styles.userEmail} numberOfLines={1}>{user.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
            </View>
          </View>
        </View>

        {/* Left-Aligned Standalone Metric Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Вкупно</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Решено</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Во тек</Text>
          </View>
        </View>

        {/* Floating Settings Preferences List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Поставки</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.primary + '12' }]}>
                <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Темна тема</Text>
                <Text style={styles.rowSubtitle}>{isDarkMode ? 'Вклучена' : 'Исклучена'}</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  toggleTheme()
                }}
                trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.accent + '12' }]}>
                <Ionicons name="call-outline" size={20} color={theme.colors.accent} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Телефон</Text>
                <Text style={styles.rowSubtitle}>{user.phone || 'Не е поставен'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Account Security Row Block */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Безбедност</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity 
              style={styles.row} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                passwordModal.open()
              }} 
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.warning + '12' }]}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.colors.warning} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Промени лозинка</Text>
                <Text style={styles.rowSubtitle}>Ажурирај ја твојата лозинка</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} style={styles.rowRight} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Disconnection Warning Block */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <TouchableOpacity 
              style={styles.logoutRow} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
                logoutModal.open()
              }} 
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.error + '15' }]}>
                <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
              </View>
              <Text style={styles.logoutLabel}>Одјави се</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.error} style={styles.rowRight} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Password Management Overlay Sheet Component */}
      <PasswordModal
        visible={passwordModal.visible}
        onClose={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          passwordModal.close()
        }}
        theme={theme}
        styles={styles}
        focused={focused}
        setFocused={setFocused}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        showCurrent={showCurrent}
        setShowCurrent={setShowCurrent}
        showNew={showNew}
        setShowNew={setShowNew}
        showConfirm={showConfirm}
        setShowConfirm={setShowConfirm}
        changingPassword={changingPassword}
        onSubmit={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          handleChangePassword()
        }}
      />

      {/* Disconnection Confirmation Bottom Sheet */}
      <Modal visible={logoutModal.visible} transparent animationType="slide" onRequestClose={logoutModal.close}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={logoutModal.close}>
          <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={() => {}}>
            <View style={styles.modalHandle} />
            <View style={[styles.rowIcon, {
              backgroundColor: theme.colors.error + '12',
              alignSelf: 'center',
              width: 56,
              height: 56,
              borderRadius: 28,
              marginBottom: theme.spacing.sm,
            }]}>
              <Ionicons name="log-out-outline" size={26} color={theme.colors.error} />
            </View>
            <Text style={styles.logoutModalTitle}>Одјави се?</Text>
            <Text style={styles.logoutModalSubtitle}>Дали сте сигурни дека сакате да се одјавите од апликацијата?</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  logoutModal.close()
                }} 
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Откажи</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dangerBtn} 
                onPress={() => {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
                  handleLogout()
                }} 
                activeOpacity={0.85}
              >
                <Text style={styles.dangerBtnText}>Одјави се</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}