// The first file the app runs. It loads the Inter font,
// then shows the screens. Every screen file inside src/app becomes a route.
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { FavoritesProvider } from '@/context/favorites';

// Keep the splash screen visible until the font is ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    // FavoritesProvider wraps the whole app, so every screen can use the saved pets
    <FavoritesProvider>
      <StatusBar style="dark" />
      {/* Stack = screens that open on top of each other (Pet Profile, Request to Adopt) */}
      <Stack screenOptions={{ headerShown: false }} />
    </FavoritesProvider>
  );
}
