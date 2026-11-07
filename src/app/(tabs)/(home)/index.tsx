// Home screen. Home Screen 1, 2 and 3 in Figma are this one screen:
// the Dog / Cat / Others tabs only change which pets the list shows.
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PetCard } from '@/components/pet-card';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { Category, getPetsByCategory } from '@/data/pets';

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'dog', label: 'Dog' },
  { key: 'cat', label: 'Cat' },
  { key: 'other', label: 'Others' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  // Which tab is selected. It starts on "dog".
  const [category, setCategory] = useState<Category>('dog');

  // Only the pets of the selected tab
  const petsToShow = getPetsByCategory(category);

  return (
    <View style={styles.screen}>
      {/* 1. Title */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <Text style={styles.title}>pet adoption</Text>
      </View>

      {/* 2. Dog / Cat / Others tabs */}
      <View style={styles.tabs}>
        {CATEGORIES.map((item) => {
          const selected = item.key === category;
          return (
            <Pressable
              key={item.key}
              onPress={() => setCategory(item.key)}
              style={[styles.tab, selected && styles.tabSelected]}>
              <Text style={[styles.tabText, selected && styles.tabTextSelected]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* 3 + 4. One card for every pet in the list */}
      <FlatList
        data={petsToShow}
        keyExtractor={(pet) => pet.id}
        renderItem={({ item }) => <PetCard pet={item} />}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.background,
    paddingHorizontal: 25,
    paddingBottom: 36,
    zIndex: 2,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', // Figma default drop shadow
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 32,
    color: Colors.text,
  },
  tabs: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: Colors.card,
    zIndex: 1,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  tab: {
    flex: 1,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    color: Colors.primary,
  },
  tabTextSelected: {
    color: Colors.tabSelectedText,
  },
  list: {
    paddingTop: 14,
    paddingHorizontal: 0,
    paddingBottom: 24,
  },
  gap: {
    height: 12,
  },
});
