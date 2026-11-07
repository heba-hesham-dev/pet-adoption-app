// Organizes the screens of the Add tab: Add a Pet → Post published.
// They open on top of each other, and the bottom nav stays visible under them.
import { Stack } from 'expo-router';

export default function AddStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
