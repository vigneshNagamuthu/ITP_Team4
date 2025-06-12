// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'app/ThemeContext';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  const { effectiveTheme } = useTheme();

  const tabBarStyles = effectiveTheme === 'dark'
    ? { backgroundColor: '#222', activeTintColor: '#4A90E2', inactiveTintColor: '#888' }
    : { backgroundColor: '#fff', activeTintColor: '#4A90E2', inactiveTintColor: '#666' };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tabBarStyles.activeTintColor,
        tabBarInactiveTintColor: tabBarStyles.inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarStyles.backgroundColor,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}