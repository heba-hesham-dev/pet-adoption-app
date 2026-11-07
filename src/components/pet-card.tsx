// The white card on Home: photo, name, breed, age, and two buttons.
// One component, reused for every pet in the list.
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { Colors } from '@/constants/colors';
import { useFavorites } from '@/context/favorites';
import { Fonts } from '@/constants/fonts';
import { Pet } from '@/data/pets';

type Props = {
  pet: Pet;
};

export function PetCard({ pet }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(pet.id);

  return (
    // Tapping the card opens this pet's profile: pet/max, pet/luna, ...
    <Pressable
      onPress={() => router.push({ pathname: '/pet/[id]', params: { id: pet.id } })}
      style={styles.card}>
      <View style={styles.top}>
        <Image source={pet.image} style={styles.photo} />
        <View>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.detail}>{pet.breed}</Text>
          <Text style={styles.detail}>{pet.age}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <AppButton
          label={saved ? 'Saved' : 'Save For Later'}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    paddingTop: 13,
    paddingBottom: 11,
    paddingHorizontal: 14,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)', // Figma default drop shadow
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    paddingLeft: 6,
  },
  photo: {
    width: 76,
    height: 73,
    borderRadius: 4,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.text,
  },
  detail: {
    fontFamily: Fonts.regular,
    fontSize: 20,
    color: Colors.text,
  },
  buttons: {
    flexDirection: 'row',
    gap: 21,
    marginTop: 14,
  },
  button: {
    flex: 1,
  },
});
