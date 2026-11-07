// Shared memory for Favorites.
// Home, Pet Profile and Favorites all read from here, so they always agree.
// It also shows the dark message at the bottom ("Added to favorites", ...).
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type FavoritesValue = {
  favoriteIds: string[]; // ids of saved pets, newest first
  isFavorite: (id: string) => boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
};

type Message = { text: string; onUndo?: () => void };

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // Starts empty: nothing is saved when the app opens
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [message, setMessage] = useState<Message | null>(null);

  const isFavorite = (id: string) => favoriteIds.includes(id);

  const addFavorite = (id: string) => {
    if (isFavorite(id)) return;
    setFavoriteIds([id, ...favoriteIds]);
    setMessage({ text: 'Added to favorites' });
  };

  const removeFavorite = (id: string) => {
    const before = favoriteIds; // remember the list, so Undo can bring it back
    setFavoriteIds(favoriteIds.filter((savedId) => savedId !== id));
    setMessage({
      text: 'Removed from favorites',
      onUndo: () => {
        setFavoriteIds(before);
        setMessage(null);
      },
    });
  };

  const toggleFavorite = (id: string) => (isFavorite(id) ? removeFavorite(id) : addFavorite(id));

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, addFavorite, removeFavorite, toggleFavorite }}>
      <View style={styles.app}>
        {children}
        <Snackbar message={message} onHide={() => setMessage(null)} />
      </View>
    </FavoritesContext.Provider>
  );
}

// Screens call this to use the shared favorites
export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('useFavorites must be used inside FavoritesProvider');
  return value;
}

// The dark message bar. Fades in, waits, then fades out by itself.
function Snackbar({ message, onHide }: { message: Message | null; onHide: () => void }) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    opacity.setValue(0);
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    // Messages with Undo stay longer, so there's time to tap it
    const timer = setTimeout(
      () => {
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(
          ({ finished }) => finished && onHide(),
        );
      },
      message.onUndo ? 4000 : 2500,
    );
    return () => clearTimeout(timer);
  }, [message]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!message) return null;

  return (
    <Animated.View
      style={[styles.snackbar, { bottom: insets.bottom + 90, opacity }]}
      pointerEvents="box-none">
      <Text style={styles.snackbarText}>{message.text}</Text>
      {message.onUndo && (
        <Pressable onPress={message.onUndo} hitSlop={12}>
          <Text style={styles.undo}>Undo</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1 },
  snackbar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.snackbar,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  snackbarText: { fontFamily: Fonts.regular, fontSize: 16, color: Colors.white },
  undo: { fontFamily: Fonts.semiBold, fontSize: 16, color: Colors.primary },
});
