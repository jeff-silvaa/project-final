import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useFonts, Raleway_100Thin, Raleway_400Regular, Raleway_700Bold } from '@expo-google-fonts/raleway';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Raleway_100Thin,
    Raleway_400Regular,
    Raleway_700Bold,
  });

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="settings"
        options={{
          presentation: 'modal',
          headerShown: true,
          title: 'Configurações',
        }}
      />
    </Stack>
  );
}
