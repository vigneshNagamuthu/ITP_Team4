import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Home = () => {
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [adminMenuVisible, setAdminMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toFixed(2) + '°N');
    setLongitude(location.coords.longitude.toFixed(2) + '°E');
  };

  const handleLogout = () => {
    setAdminMenuVisible(false);
    setLatitude(null);
    setLongitude(null);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.dashboardTitle}>DashBoard</Text>
        <TouchableOpacity onPress={() => setAdminMenuVisible(true)}>
          <Text style={styles.adminText}>Admin</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={adminMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAdminMenuVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setAdminMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#b30000" style={{ marginRight: 8 }} />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      <View style={styles.centerContainer}>
        <TouchableOpacity style={styles.button} onPress={getLocation}>
          <Text style={styles.buttonText}>GET LOCATION</Text>
        </TouchableOpacity>
        {latitude && longitude && (
          <View style={styles.locationContainer}>
            <Text>Latitude</Text>
            <Text>{latitude}</Text>
            <Text>Longitude</Text>
            <Text>{longitude}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTime: {
    fontSize: 14,
    color: 'black',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '80%',
    marginBottom: 30,
    paddingTop: 20,
    alignSelf: 'center',
  },
  dashboardTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'black',
  },
  adminText: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownMenu: {
    marginTop: 60,
    marginRight: 20,
    backgroundColor: '#fff',
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
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownText: {
    color: '#b30000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#d3d3d3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
  },
  locationContainer: {
    alignItems: 'center',
  },
});

export default Home;