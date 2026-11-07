// One button used everywhere: "Adopt me" (primary) and "Save For Later" (outline).
// While the finger is on it, the button gets darker (pressed state).
import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline';
  style?: StyleProp<ViewStyle>;
};

export function AppButton({ label, onPress, variant = 'primary', style }: Props) {
  const outline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        outline ? styles.outline : styles.primary,
        pressed && (outline ? styles.outlinePressed : styles.primaryPressed),
        style,
      ]}>
      <Text style={[styles.label, outline ? styles.outlineLabel : styles.primaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: Colors.primary },
  primaryPressed: { backgroundColor: Colors.primaryPressed },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  outlinePressed: { backgroundColor: Colors.inputBackground },
  label: { fontFamily: Fonts.semiBold, fontSize: 18 },
  primaryLabel: { color: Colors.white },
  outlineLabel: { color: Colors.primary },
});
