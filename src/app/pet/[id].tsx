// Pet Profile: one screen for all 15 pets.
// The id comes from the address (pet/max, pet/luna, ...).
// Heba wrote the first part (photo, name, details line); Claude added the rest.
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { useFavorites } from '@/context/favorites';
import { getPetById } from '@/data/pets';

const SHADOW = '0px 4px 4px rgba(0, 0, 0, 0.25)'; // Figma default drop shadow

export default function PetProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getPetById(id);
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();

  // Is the details overlay open? It starts closed.
  const [showDetails, setShowDetails] = useState(false);

  if (!pet) {
    return <Text>Pet not found</Text>;
  }

  const detailsLine = `${pet.breed} · ${pet.sex} · ${pet.age} · ${pet.size}`;

  return (
    <View style={styles.screen}>
      {/* Header: back arrow + title */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Pet Profile</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Heba's part: photo, name, details line */}
        <View style={styles.photoFrame}>
          <Image source={pet.image} style={styles.photo} />
        </View>
        <Text style={styles.name}>{pet.name}</Text>
        <Text style={styles.details}>{detailsLine}</Text>

        {/* Tags: Vaccinated, Neutered, ... */}
        <View style={styles.tags}>
          {pet.tags.map((tag) => (
            <Text key={tag} style={styles.body}>
              {tag}
            </Text>
          ))}
        </View>

        {/* About, cut to 4 lines */}
        <Text style={[styles.body, styles.aboutTitle]}>
          <Text style={styles.bold}>About</Text> {pet.name}
        </Text>
        <Text style={[styles.body, styles.aboutText]} numberOfLines={4}>
          {pet.about}
        </Text>
        <Pressable onPress={() => setShowDetails(true)} hitSlop={8} style={styles.readMoreButton}>
          <Text style={styles.readMore}>Read more..</Text>
        </Pressable>
      </ScrollView>

      {/* Buttons at the bottom */}
      <View style={[styles.buttons, { paddingBottom: insets.bottom + 8 }]}>
        <AppButton
          label={isFavorite(pet.id) ? 'Saved' : 'Save For Later'}
          variant="outline"
          onPress={() => toggleFavorite(pet.id)}
          style={styles.button}
        />
        <AppButton
          label="Adopt me"
          onPress={() => router.navigate({ pathname: '/request/[id]', params: { id: pet.id } })}
          style={styles.button}
        />
      </View>

      {/* Details overlay: opens from "Read more.." */}
      <Modal
        visible={showDetails}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetails(false)}>
        <View style={[styles.backdrop, { paddingTop: insets.top }]}>
          <View style={styles.sheet}>
            <Pressable
              onPress={() => setShowDetails(false)}
              hitSlop={12}
              style={styles.closeButton}>
              <Ionicons name="close" size={34} color={Colors.primary} />
            </Pressable>

            <ScrollView
              contentContainerStyle={[styles.sheetContent, { paddingBottom: insets.bottom + 24 }]}>
              <Text style={styles.sheetName}>{pet.name}</Text>
              <Text style={styles.details}>{detailsLine}</Text>

              <View style={[styles.tags, styles.sheetTags]}>
                {pet.tags.map((tag) => (
                  <Text key={tag} style={styles.body}>
                    {tag}
                  </Text>
                ))}
              </View>

              <Section title="About" titleExtra={pet.name} lines={[pet.about]} />
              <Section
                title="Personality"
                lines={[pet.personality, `Energy level: ${pet.energyLevel}`]}
              />
              <Section title="Good with" lines={pet.goodWith} />
              <Section title="Care needs" lines={pet.careNeeds} />
              <Section title="Health" lines={[pet.health]} />
              <Section title={`${pet.name}'s story`} lines={[pet.story]} />
              <Section
                lines={[`Location: ${pet.location}`, `Adoption fee: ${pet.adoptionFee}`]}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// One block in the overlay: a bold title, then one line per item
function Section({
  title,
  titleExtra,
  lines,
}: {
  title?: string;
  titleExtra?: string;
  lines: string[];
}) {
  return (
    <View style={styles.section}>
      {title && (
        <Text style={styles.body}>
          <Text style={styles.bold}>{title}</Text>
          {titleExtra ? ` ${titleExtra}` : ''}
        </Text>
      )}
      {lines.map((line) => (
        <Text key={line} style={styles.body}>
          {line}
        </Text>
      ))}
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

  // Main content
  content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 24 },
  photoFrame: { borderRadius: 10, backgroundColor: Colors.card, boxShadow: SHADOW },
  photo: { width: '100%', height: 246, borderRadius: 10 },
  name: { fontFamily: Fonts.bold, fontSize: 30, color: Colors.text, marginTop: 18 },
  details: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.detailText,
    marginTop: 2,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, marginTop: 12 },
  body: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 19, color: Colors.text },
  bold: { fontFamily: Fonts.bold },
  aboutTitle: { marginTop: 22 },
  aboutText: { maxWidth: 300 },
  readMoreButton: { alignSelf: 'flex-start' },
  readMore: { fontFamily: Fonts.regular, fontSize: 16, lineHeight: 19, color: Colors.detailText },

  // Bottom buttons
  buttons: {
    flexDirection: 'row',
    gap: 17,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.background,
  },
  button: { flex: 1, height: 48 },

  // Details overlay
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  sheet: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  closeButton: { alignSelf: 'flex-end', marginTop: 24, marginRight: 24 },
  sheetContent: { paddingHorizontal: 17, paddingTop: 4 },
  sheetName: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text },
  sheetTags: { marginTop: 19 },
  section: { marginTop: 19 },
});
