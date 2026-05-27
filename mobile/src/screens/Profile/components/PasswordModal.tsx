import React from 'react'
import { View, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

interface PasswordModalProps {
  visible: boolean
  onClose: () => void
  theme: any
  styles: any
  focused: string | null
  setFocused: (f: string | null) => void
  currentPassword: any
  newPassword: any
  confirmPassword: any
  showCurrent: boolean
  setShowCurrent: (v: boolean) => void
  showNew: boolean
  setShowNew: (v: boolean) => void
  showConfirm: boolean
  setShowConfirm: (v: boolean) => void
  changingPassword: boolean
  onSubmit: () => void
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  visible,
  onClose,
  theme,
  styles,
  focused,
  setFocused,
  currentPassword,
  newPassword,
  confirmPassword,
  showCurrent,
  setShowCurrent,
  showNew,
  setShowNew,
  showConfirm,
  setShowConfirm,
  changingPassword,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={styles.modal} activeOpacity={1} onPress={() => {}}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Промени лозинка</Text>
          <Text style={styles.modalSubtitle}>Внесете ја тековната и новата лозинка</Text>

          {/* Current Password Field */}
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
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowCurrent(!showCurrent)}>
                <Ionicons
                  name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {currentPassword.error && <Text style={styles.errorText}>{currentPassword.error}</Text>}
          </View>

          {/* New Password Field */}
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
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowNew(!showNew)}>
                <Ionicons
                  name={showNew ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {newPassword.error && <Text style={styles.errorText}>{newPassword.error}</Text>}
          </View>

          {/* Confirm Password Field */}
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
              <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {confirmPassword.error && <Text style={styles.errorText}>{confirmPassword.error}</Text>}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Откажи</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, changingPassword && { opacity: 0.7 }]}
              onPress={onSubmit}
              disabled={changingPassword}
              activeOpacity={0.85}
            >
              {changingPassword ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.confirmBtnText}>Зачувај</Text>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  )
}