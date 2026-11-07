
import {Image, StyleSheet, Text, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {Colors} from '@/constants/colors'; 
import {pets} from '@/data/pets'; 

export default function HomeScreen() {
  const pet = pets [0];

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>pet adoption</Text>

      <View style={styles.card}>
        <Image source={pet.image} style={styles.photo} />
        <View>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.info}>{pet.breed}</Text>
          <Text style={styles.info}>{pet.age}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  title: { fontSize: 32, fontWeight: '700', marginHorizontal: 24, marginVertical: 16 },
  card: { flexDirection: 'row', gap: 16, backgroundColor: Colors.card, padding: 16 },
  photo: { width: 72, height: 72, borderRadius: 8 },
  name: { fontSize: 24, fontWeight: '700' },
  info: { fontSize: 18 },
}); 
