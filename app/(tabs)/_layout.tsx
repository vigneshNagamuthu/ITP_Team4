// app/(tabs)/_layout.tsx
import { Ionicons } from '@expo/vector-icons'; // For tab icons
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide default header to use your custom one
        tabBarActiveTintColor: '#4A90E2', // Active tab color
        tabBarInactiveTintColor: '#888', // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#000', // Dark background for the tab bar
          borderTopWidth: 0, // Remove border at top of tab bar
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="home" // Corresponds to app/(tabs)/home.tsx
        options={{
          title: 'Dashboard', // Label for the tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      {/* You can add more tabs here later, e.g.:
      <Tabs.Screen
        name="settings" // Corresponds to app/(tabs)/settings.tsx
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      />
      */}
    </Tabs>
  );
}
