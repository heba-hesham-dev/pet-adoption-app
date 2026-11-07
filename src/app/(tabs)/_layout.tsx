// The bottom navigation: Home, Favorites, Add.
// Each Tabs.Screen points to a file or folder in this (tabs) folder:
// (home) folder, favorites.tsx, add folder.
import { Tabs } from 'expo-router/js-tabs';
import { Image, ImageSourcePropType, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

// Icons cut from the Figma iconography. "on" shows when the tab is open.
const icons = {
  home: {
    on: require('@/assets/images/icons/home-filled.png'),
    off: require('@/assets/images/icons/home-outline.png'),
    width: 36,
    height: 29,
  },
  favorites: {
    on: require('@/assets/images/icons/heart-filled.png'),
    off: require('@/assets/images/icons/heart-outline.png'),
    width: 33,
    height: 30,
  },
  add: {
    on: require('@/assets/images/icons/plus.png'),
    off: require('@/assets/images/icons/plus.png'),
    width: 23,
    height: 23,
  },
};

type IconName = keyof typeof icons;

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  const icon = icons[name];
  const source: ImageSourcePropType = focused ? icon.on : icon.off;
  return (
    <Image
      source={source}
      style={{ width: icon.width, height: icon.height, tintColor: Colors.primary }}
      resizeMode="contain"
    />
  );
}

function TabLabel({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.bar, { height: 74 + insets.bottom }],
        tabBarItemStyle: styles.item,
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarLabel: () => <TabLabel text="Home" />,
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarLabel: () => <TabLabel text="Favorites" />,
          tabBarIcon: ({ focused }) => <TabIcon name="favorites" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarLabel: () => <TabLabel text="Add" />,
          tabBarIcon: ({ focused }) => <TabIcon name="add" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Colors.navBackground,
    borderTopWidth: 0,
    paddingTop: 10,
    boxShadow: '0px -4px 4px rgba(0, 0, 0, 0.25)',
  },
  item: {
    gap: 6,
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.navLabel,
  },
});
