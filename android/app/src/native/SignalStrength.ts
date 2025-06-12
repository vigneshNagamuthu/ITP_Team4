import { PermissionsAndroid, Platform } from 'react-native';
import { NativeModules } from 'react-native';

const { SignalStrength } = NativeModules;

export type SignalInfo = {
  rsrp: number;
  rsrq: number;
  sinr: number;
};

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      ]);

      const hasLocationPermission =
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
      const hasPhoneStatePermission =
        granted[PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE] === PermissionsAndroid.RESULTS.GRANTED;

      if (!hasLocationPermission || !hasPhoneStatePermission) {
        console.warn('Required permissions not granted');
      }

      return hasLocationPermission && hasPhoneStatePermission;
    } catch (err) {
      console.error('Permission request error:', err);
      return false;
    }
  }
  return true; // Permissions are not required for non-Android platforms
};

export const getSignalInfo = async (): Promise<SignalInfo | null> => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.error('Permissions not granted');
    return null;
  }

  if (!SignalStrength) {
    console.error('SignalStrength module is not linked properly');
    alert('Native module not found. Please rebuild the project.');
    return null;
  }

  try {
    const result: SignalInfo = await SignalStrength.getSignalInfo();
    console.log('Signal Info:', result);
    return result;
  } catch (error) {
    console.error('Error getting signal info:', error);
    alert('Error fetching signal data');
    return null;
  }
};