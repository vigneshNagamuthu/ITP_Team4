import { ThemeType, useTheme } from 'app/ThemeContext';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Option = { label: string; value: ThemeType }; // Update value to ThemeType
type ModalState = { visible: boolean; key: string; options: Option[] };

const OPTIONS: { [key: string]: Option[] } = {
  theme: [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System Default', value: 'system' },
  ],
};

function getLabel(options: Option[], value: ThemeType): string {
  const found = options.find((opt) => opt.value === value);
  return found ? found.label : '';
}

export default function SettingsScreen() {
  const { theme, effectiveTheme, setTheme } = useTheme();
  const [dataConsent, setDataConsent] = useState<boolean>(false);
  const [modal, setModal] = useState<ModalState>({ visible: false, key: '', options: [] });

  const openModal = (key: string, options: Option[]) => setModal({ visible: true, key, options });
  const closeModal = () => setModal({ visible: false, key: '', options: [] });

  const handleSelect = (value: ThemeType) => { // Type value as ThemeType
    if (modal.key === 'theme') {
      setTheme(value); // Now TypeScript knows value is ThemeType
    }
    closeModal();
  };

  const themeStyles = effectiveTheme === 'dark' 
    ? { backgroundColor: '#222', textColor: '#fff', sectionColor: '#333' }
    : { backgroundColor: '#fff', textColor: '#000', sectionColor: '#f8f8f8' };

  const renderModalSetting = (key: keyof typeof OPTIONS, label: string, value: ThemeType) => (
    <TouchableOpacity style={styles.rowColumn} onPress={() => openModal(key as string, OPTIONS[key])}>
      <Text style={[styles.settingLabel, { color: themeStyles.textColor }]}>{label}</Text>
      <View style={styles.selectedValueBox}>
        <Text style={styles.selectedValue}>{getLabel(OPTIONS[key], value)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: themeStyles.backgroundColor }]}>
      <Text style={[styles.header, { color: themeStyles.textColor }]}>User Preferences</Text>
      <View style={[styles.section, { backgroundColor: themeStyles.sectionColor }]}>
        {renderModalSetting('theme', 'Theme', theme)}
        <Text style={[styles.unitInfo, { color: themeStyles.textColor }]}>
        </Text>
      </View>

      <Text style={[styles.header, { color: themeStyles.textColor }]}>Privacy & Permissions</Text>
      <View style={[styles.section, { backgroundColor: themeStyles.sectionColor }]}>
        <View style={styles.row}>
          <Text style={{ color: themeStyles.textColor }}>Data Consent</Text>
          <Switch value={dataConsent} onValueChange={setDataConsent} />
        </View>
        <Button title="Delete All Data" onPress={() => {}} color="#b30000" />
        <Text style={[styles.subHeader, { color: themeStyles.textColor }]}>Permissions Overview</Text>
        <Text style={{ color: themeStyles.textColor, fontSize: 13 }}>GPS: Granted</Text>
        <Text style={{ color: themeStyles.textColor, fontSize: 13 }}>Storage: Granted</Text>
      </View>

      <Modal visible={modal.visible} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={[styles.modalContent, { backgroundColor: themeStyles.backgroundColor }]}>
            {modal.options.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.modalItem}
                onPress={() => handleSelect(opt.value)}
              >
                <Text style={[styles.modalText, { color: themeStyles.textColor }]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTime: {
    fontSize: 14,
  },
  header: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, marginLeft: 10 },
  section: { margin: 10, borderRadius: 8, padding: 10, marginBottom: 0 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  rowColumn: { flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10 },
  subHeader: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  selectedValueBox: { marginTop: 6, width: '100%' },
  selectedValue: { color: '#4A90E2', fontWeight: 'bold', fontSize: 16 },
  settingLabel: { fontSize: 16, fontWeight: '500' },
  unitInfo: { fontSize: 14, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { borderRadius: 10, padding: 20, minWidth: 220, elevation: 8 },
  modalItem: { paddingVertical: 12 },
  modalText: { fontSize: 18, textAlign: 'center' },
});