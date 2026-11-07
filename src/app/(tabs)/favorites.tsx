// Favorites screen. Shows the pets saved with "Save For Later".
// The heart removes a pet (with Undo); View opens its profile.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useFavorites } from '@/context/favorites';
import { getPetById, Pet } from '@/data/pets';

const SHADOW = '0px 4px 4px rgba(0, 0, 0, 0.25)'; // Figma default drop shadow
const heartIcon = require('@/assets/images/icons/heart-filled.png');
const heartOutlineIcon = require('@/assets/images/icons/heart-outline.png');

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const { favoriteIds, removeFavorite } = useFavorites();

  // Turn the saved ids into pets, newest first
  const savedPets = favoriteIds
    .map((id) => getPetById(id))
    .filter((pet): pet is Pet => pet !== undefined);

  const goHome = () => router.navigate('/');

  return (
    <View style={styles.screen}>
      {/* Header: back arrow + title */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={goHome} hitSlop={12} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Favorites</Text>
        </View>
      </View>

      {savedPets.length === 0 ? (
        // Empty state: nothing saved yet
        <View style={styles.empty}>
          <Image source={heartOutlineIcon} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No saved pets yet</Text>
          <Text style={styles.emptyText}>Tap Save For Later on any pet to see it here.</Text>
          <AppButton label="Browse pets" onPress={goHome} style={styles.emptyButton} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {savedPets.map((pet) => (
            // Animated.View: the card fades out when removed, and the cards below slide up
            <Animated.View
              key={pet.id}
              exiting={FadeOut.duration(200)}
              layout={LinearTransition.duration(250)}
              style={styles.card}>
              <Image source={pet.image} style={styles.photo} />

              <View style={styles.info}>
                <Text style={styles.name}>{pet.name}</Text>
                <Pressable
                  onPress={() => router.push({ pathname: '/pet/[id]', params: { id: pet.id } })}
                  style={({ pressed }) => [styles.viewButton, pressed && styles.viewButtonPressed]}>
                  <Text style={styles.viewText}>View</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => removeFavorite(pet.id)} hitSlop={12} style={styles.heart}>
                <Image source={heartIcon} style={styles.heartIcon} />
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.background,
    paddingBottom: 8,
    zIndex: 1,
    boxShadow: SHADOW,
  },
  headerRow: { height: 48, alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 8, top: 0, bottom: 0, justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.text },

  // Cards
  list: { gap: 16, paddingBottom: 100 },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingTop: 18,
    paddingLeft: 20,
    paddingRight: 18,
    height: 172,
    boxShadow: SHADOW,
  },
  photo: { width: 76, height: 73 },
  info: { flex: 1, marginLeft: 8, paddingTop: 12 },
  name: { fontFamily: Fonts.semiBold, fontSize: 28, color: Colors.text, marginLeft: 9 },
  viewButton: {
    width: 120,
    height: 40,
    borderRadius: 20,
    marginTop: 6,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonPressed: { backgroundColor: Colors.primaryPressed },
  viewText: { fontFamily: Fonts.semiBold, fontSize: 24, color: Colors.white },
  heart: { position: 'absolute', top: 13, right: 18 },
  heartIcon: { width: 24, height: 22, tintColor: Colors.primary },

  // Empty state
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  emptyIcon: { width: 66, height: 60, tintColor: Colors.primary },
  emptyTitle: { fontFamily: Fonts.semiBold, fontSize: 22, color: Colors.text, marginTop: 20 },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyButton: { width: 200, height: 48, marginTop: 24 },
});
