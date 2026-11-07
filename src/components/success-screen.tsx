// The "done" screen used by Request sent and Post published:
// header title, orange check circle, message, and Back to Home.
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type Props = {
  headerTitle: string;
  title: string;
  message: string;
};

export function SuccessScreen({ headerTitle, title, message }: Props) {
  const insets = useSafeAreaInsets();

  const backToHome = () => {
    // Close this success screen first, so the tab starts fresh next time
    if (router.canDismiss()) router.dismissAll();
    router.navigate('/');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.circle}>
          <Ionicons name="checkmark-sharp" size={64} color={Colors.white} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <AppButton label="Back to Home" onPress={backToHome} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.background,
    paddingBottom: 8,
    zIndex: 1,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  headerRow: { height: 48, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 24, color: Colors.text },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  circle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    color: Colors.label,
    marginTop: 18,
    textAlign: 'center',
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 19,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 14,
  },
  button: { alignSelf: 'stretch', height: 48, marginTop: 18, marginHorizontal: -20 },
});
