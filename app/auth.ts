import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_KEY = 'userLoggedInStatus';

export async function setIsLoggedIn(value: boolean): Promise<void> {
  try {
    if (value) {
      await AsyncStorage.setItem(LOGIN_KEY, 'true');
    } else {
      await AsyncStorage.removeItem(LOGIN_KEY);
    }
    console.log(`[auth.ts] Login status set to: ${value}`);
  } catch (e) {
    console.error("[auth.ts] Failed to set login status in AsyncStorage", e);
  }
}

export async function getIsLoggedIn(): Promise<boolean> {
  try {
    console.log("[auth.ts] Attempting to get login status...");
    const value = await AsyncStorage.getItem(LOGIN_KEY);
    console.log("[auth.ts] Value from AsyncStorage:", value);
    return value === 'true';
  } catch (e) {
    console.error("[auth.ts] Failed to get login status from AsyncStorage", e);
    return false;
  }
}

// Add a default export to satisfy the route warning
export default function AuthScreen() {
  return null;
}
