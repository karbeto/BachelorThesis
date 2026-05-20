import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { createStyles } from './style'
import { useProfileLogic } from './logic'

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
    getInitials,
  } = useProfileLogic()

  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  if (!user) return null

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {getInitials(user.full_name)}
              </Text>
            </View>
            <View style={styles.roleDot} />
          </View>
          <Text style={styles.userName}>{user.full_name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{getRoleLabel(user.role)}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Вкупно</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {stats.resolved}
            </Text>
            <Text style={styles.statLabel}>Решено</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {stats.pending}
            </Text>
            <Text style={styles.statLabel}>Во тек</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Поставки</Text>
          <View style={styles.sectionCard}>
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.info + '20' }]}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={18}
                  color={theme.colors.info}
                />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Темна тема</Text>
                <Text style={styles.rowSubtitle}>
                  {isDarkMode ? 'Вклучена' : 'Исклучена'}
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.accent,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.row, styles.rowLast]}>
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.accent + '20' }]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={theme.colors.accent}
                />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Телефон</Text>
                <Text style={styles.rowSubtitle}>
                  {user.phone || 'Не е поставен'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Безбедност</Text>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={[styles.row, styles.rowLast]}
              onPress={passwordModal.open}
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={theme.colors.warning}
                />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Промени лозинка</Text>
                <Text style={styles.rowSubtitle}>Ажурирај ја твојата лозинка</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            <TouchableOpacity
              style={styles.logoutRow}
              onPress={logoutModal.open}
              activeOpacity={0.7}
            >
              <View style={[styles.rowIcon, { backgroundColor: theme.colors.error + '15' }]}>
                <Ionicons
                  name="log-out-outline"
                  size={18}
                  color={theme.colors.error}
                />
              </View>
              <Text style={styles.logoutLabel}>Одјави се</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.error}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModal.visible}
        transparent
        animationType="slide"
        onRequestClose={passwordModal.close}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={passwordModal.close}
        >
          <TouchableOpacity
            style={styles.modal}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Промени лозинка</Text>
            <Text style={styles.modalSubtitle}>
              Внесете ја тековната и новата лозинка
            </Text>

            {/* Current password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Тековна лозинка</Text>
              <View style={[
                styles.inputRow,
                focused === 'current' && styles.inputRowFocused,
                currentPassword.error && styles.inputRowError,
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={currentPassword.value}
                  onChangeText={currentPassword.onChange}
                  onFocus={() => setFocused('current')}
                  onBlur={() => setFocused(null)}
                  secureTextEntry={!showCurrent}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowCurrent(!showCurrent)}
                >
                  <Ionicons
                    name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {currentPassword.error && (
                <Text style={styles.errorText}>{currentPassword.error}</Text>
              )}
            </View>

            {/* New password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Нова лозинка</Text>
              <View style={[
                styles.inputRow,
                focused === 'new' && styles.inputRowFocused,
                newPassword.error && styles.inputRowError,
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={newPassword.value}
                  onChangeText={newPassword.onChange}
                  onFocus={() => setFocused('new')}
                  onBlur={() => setFocused(null)}
                  secureTextEntry={!showNew}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowNew(!showNew)}
                >
                  <Ionicons
                    name={showNew ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {newPassword.error && (
                <Text style={styles.errorText}>{newPassword.error}</Text>
              )}
            </View>

            {/* Confirm password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Потврди нова лозинка</Text>
              <View style={[
                styles.inputRow,
                focused === 'confirm' && styles.inputRowFocused,
                confirmPassword.error && styles.inputRowError,
              ]}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={confirmPassword.value}
                  onChangeText={confirmPassword.onChange}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  secureTextEntry={!showConfirm}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword.error && (
                <Text style={styles.errorText}>{confirmPassword.error}</Text>
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={passwordModal.close}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Откажи</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, changingPassword && { opacity: 0.7 }]}
                onPress={handleChangePassword}
                disabled={changingPassword}
                activeOpacity={0.85}
              >
                {changingPassword ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmBtnText}>Зачувај</Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Logout Confirm Modal */}
      <Modal
        visible={logoutModal.visible}
        transparent
        animationType="slide"
        onRequestClose={logoutModal.close}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={logoutModal.close}
        >
          <TouchableOpacity
            style={styles.modal}
            activeOpacity={1}
            onPress={() => {}}
          >
            <View style={styles.modalHandle} />
            <View style={[styles.rowIcon, {
              backgroundColor: theme.colors.error + '15',
              alignSelf: 'center',
              width: 56,
              height: 56,
              borderRadius: 28,
              marginBottom: theme.spacing.sm,
            }]}>
              <Ionicons name="log-out-outline" size={26} color={theme.colors.error} />
            </View>
            <Text style={styles.logoutModalTitle}>Одјави се?</Text>
            <Text style={styles.logoutModalSubtitle}>
              Дали сте сигурни дека сакате да се одјавите од апликацијата?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={logoutModal.close}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Откажи</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dangerBtn}
                onPress={handleLogout}
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