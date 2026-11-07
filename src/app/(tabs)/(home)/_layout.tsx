// Organizes the screens of the Home tab: Home → Request to Adopt → Request sent.
// They open on top of each other, and the bottom nav stays visible under them.
import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
