// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native'; // Import these if you use them for loading
import { getIsLoggedIn } from './auth';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(true);

  // Initial render log
  console.log('RootLayout rendered. isReady:', isReady);

  useEffect(() => {
    // Log immediately when useEffect starts
    console.log('--- useEffect callback fired ---');

    const checkLoginStatus = async () => {
      console.log('--- checkLoginStatus initiated inside useEffect ---');
      try {
        const loggedIn = await getIsLoggedIn(); // This is the line where the error occurred before
        console.log('Logged In Status:', loggedIn);

        const currentSegment = segments[0]?.[0];
        console.log('Current Segment:', currentSegment);

        const inAuthGroup = currentSegment === 'login' || currentSegment === 'signup';
        console.log('In Auth Group:', inAuthGroup);

        if (!loggedIn && !inAuthGroup) {
          console.log('Redirecting to /login');
          router.replace('/login');
        } else if (loggedIn && inAuthGroup) {
          console.log('Redirecting to /home (from auth page)');
          router.replace('/home');
        } else {
          console.log('No redirect needed, path is:', segments.join('/'));
        }
      } catch (error) {
        console.error("CRITICAL ERROR during login status check in _layout.tsx:", error);
      } finally {
        // This will always run, ensuring isReady is set to true
        setIsReady(true);
        console.log('--- checkLoginStatus finished, isReady set to true ---');
      }
    };

    checkLoginStatus();
  }, [router, segments]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text>Loading app authentication...</Text>
      </View>
    );
  }

  return <Slot />;
}
