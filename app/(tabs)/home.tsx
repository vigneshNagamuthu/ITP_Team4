import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'app/ThemeContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  NativeModules,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { SignalStrength } = NativeModules;

const Home = () => {
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [adminMenuVisible, setAdminMenuVisible] = useState(false);
  const [signalInfo, setSignalInfo] = useState<{ rsrp?: number; rsrq?: number; sinr?: number } | null>(null);
  const router = useRouter();
  const { effectiveTheme } = useTheme();

  const requestSignalPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const getLocation = async () => {
    try {
      // Use Geolocation API or expo-location if you want more accuracy
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(5) + '°N');
          setLongitude(position.coords.longitude.toFixed(5) + '°E');
        },
        (error) => {
          console.error('Location fetch error:', error);
          alert('Error fetching location');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } catch (err) {
      console.error('Location fetch error:', err);
      alert('Error fetching location');
    }
  };

  const getSignal = async () => {
    const hasPermission = await requestSignalPermissions();
    if (!hasPermission) {
      alert('Permission to access signal info was denied');
      return;
    }

    if (!SignalStrength) {
      console.error('SignalStrength module is not linked properly');
      alert('Native module not found. Please rebuild the project.');
      return;
    }

    try {
      const data = await SignalStrength.getSignalInfo();
      console.log('Signal Data:', data);
      setSignalInfo({
        rsrp: data.rsrp,
        rsrq: data.rsrq,
        sinr: data.sinr ?? data.snr,
      });
    } catch (err) {
      console.error('Signal fetch error:', err);
      alert('Error fetching signal data');
    }
  };

  const handleLogout = () => {
    setAdminMenuVisible(false);
    setLatitude(null);
    setLongitude(null);
    setSignalInfo(null);
    router.replace('../login');
  };

  const themeStyles = effectiveTheme === 'dark'
    ? { backgroundColor: '#222', textColor: '#fff', buttonColor: '#444' }
    : { backgroundColor: '#fff', textColor: '#000', buttonColor: '#d3d3d3' };

  return (
    <View style={[styles.container, { backgroundColor: themeStyles.backgroundColor }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.dashboardTitle, { color: themeStyles.textColor }]}>DashBoard</Text>
        <TouchableOpacity onPress={() => setAdminMenuVisible(true)}>
          <Text style={[styles.adminText, { color: themeStyles.textColor }]}>Admin</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={adminMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAdminMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAdminMenuVisible(false)}>
          <View style={[styles.dropdownMenu, { backgroundColor: themeStyles.backgroundColor }]}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#b30000" style={{ marginRight: 8 }} />
              <Text style={[styles.dropdownText, { color: themeStyles.textColor }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <View style={styles.centerContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.buttonColor }]} onPress={getLocation}>
          <Text style={[styles.buttonText, { color: themeStyles.textColor }]}>GET LOCATION</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: themeStyles.buttonColor }]} onPress={getSignal}>
          <Text style={[styles.buttonText, { color: themeStyles.textColor }]}>GET SIGNAL</Text>
        </TouchableOpacity>

        {(latitude && longitude) && (
          <View style={styles.locationContainer}>
            <Text style={{ color: themeStyles.textColor }}>Latitude: {latitude}</Text>
            <Text style={{ color: themeStyles.textColor }}>Longitude: {longitude}</Text>
          </View>
        )}

        {signalInfo && (
          <View style={styles.locationContainer}>
            <Text style={{ color: themeStyles.textColor }}>RSRP: {signalInfo.rsrp} dBm</Text>
            <Text style={{ color: themeStyles.textColor }}>RSRQ: {signalInfo.rsrq} dB</Text>
            <Text style={{ color: themeStyles.textColor }}>SINR: {signalInfo.sinr} dB</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '80%',
    marginBottom: 30,
    paddingTop: 20,
    alignSelf: 'center',
  },
  dashboardTitle: { fontSize: 36, fontWeight: 'bold' },
  adminText: { fontSize: 18, textDecorationLine: 'underline' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    marginTop: 60,
    marginRight: 20,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 140,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  dropdownText: { fontSize: 16, fontWeight: 'bold' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: { fontSize: 16 },
  locationContainer: { alignItems: 'center', marginTop: 20 },
});

export default Home;