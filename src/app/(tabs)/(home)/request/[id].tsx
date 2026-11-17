// Request to Adopt: one form for every pet (request/max, request/luna, ...).
// Required: everything except Message. Empty fields get a red outline and
// "Please fill this in", and the screen scrolls to the first one.
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Alert, Image, Modal, Pressable, ScrollView,
  type ScrollViewInstance,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/app-button';
import {
  MultiChoice,
  REQUIRED_MESSAGE,
  SectionTitle,
  SelectField,
  SingleChoice,
  TextField,
} from '@/components/form-parts';
import { API_URL } from '@/constants/api';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { getPetById, Pet } from '@/data/pets';

const SHADOW = '0px 4px 4px rgba(0, 0, 0, 0.25)';
const BOOKING_DAYS = 30; // visits can be booked from tomorrow up to 30 days ahead

export default function RequestToAdoptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = getPetById(id);

  // Changing this number gives a fresh, empty form after a request is sent
  const [formKey, setFormKey] = useState(0);

  if (!pet) {
    return <Text>Pet not found</Text>;
  }

  return (
    <RequestForm
      key={`${pet.id}-${formKey}`}
      pet={pet}
      onSent={() => {
        setFormKey((n) => n + 1);
        router.replace('/request-sent');
      }}
    />
  );
}

type FieldName = 'fullName' | 'phone' | 'email' | 'homeType' | 'kids' | 'otherPets' | 'date' | 'time';
const FIELD_ORDER: FieldName[] = [
  'fullName',
  'phone',
  'email',
  'homeType',
  'kids',
  'otherPets',
  'date',
  'time',
];

function RequestForm({ pet, onSent }: { pet: Pet; onSent: () => void }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const positions = useRef<Partial<Record<FieldName, number>>>({});
  const saveY = (name: FieldName) => (event: { nativeEvent: { layout: { y: number } } }) => {
    positions.current[name] = event.nativeEvent.layout.y;
  };

  // What the user typed or picked
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [homeType, setHomeType] = useState('');
  const [kids, setKids] = useState('');
  const [otherPets, setOtherPets] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  // Errors show only after the first tap on Send request
  const [submitted, setSubmitted] = useState(false);

  // Date picker
  const tomorrow = startOfDay(addDays(new Date(), 1));
  const lastDay = startOfDay(addDays(new Date(), BOOKING_DAYS));
  const [showCalendar, setShowCalendar] = useState(false);
  const [draftDate, setDraftDate] = useState<Date>(tomorrow);

  const errors: Record<FieldName, string | undefined> = {
    fullName: fullName.trim() ? undefined : REQUIRED_MESSAGE,
    phone: phone.trim() ? undefined : REQUIRED_MESSAGE,
    email: !email.trim()
      ? REQUIRED_MESSAGE
      : /^\S+@\S+\.\S+$/.test(email.trim())
        ? undefined
        : 'Please enter a valid email',
    homeType: homeType ? undefined : REQUIRED_MESSAGE,
    kids: kids ? undefined : REQUIRED_MESSAGE,
    otherPets: otherPets.length > 0 ? undefined : REQUIRED_MESSAGE,
    date: date ? undefined : REQUIRED_MESSAGE,
    time: time ? undefined : REQUIRED_MESSAGE,
  };
  const errorFor = (name: FieldName) => (submitted ? errors[name] : undefined);
const [sending, setSending] = useState(false);

  const sendRequest = async () => {
  const firstMissing = FIELD_ORDER.find((name) => errors[name]);
  if (firstMissing) {
    setSubmitted(true);
    const y = positions.current[firstMissing] ?? 0;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
    return;
  }

  setSending(true);
  try {
    const response = await fetch(`${API_URL}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        petId: pet.id,
        petName: pet.name,
        petBreed: pet.breed,
        fullName,
        phone,
        email,
        homeType,
        kidsAtHome: kids,
        otherPets,
        visitDate: date,
        visitTime: time,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error('Request failed');
    }

    onSent();
  } catch {
    Alert.alert('Something went wrong', 'Please check your connection and try again.');
  } finally {
    setSending(false);
  }
};

  const openCalendar = () => {
    setDraftDate(date ?? tomorrow);
    setShowCalendar(true);
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Request to Adopt</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        {/* Which pet this request is for */}
        <View style={styles.petCard}>
          <Image source={pet.image} style={styles.petPhoto} />
          <View style={styles.petInfo}>
            <Text style={styles.petHint}>You're requesting to adopt</Text>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petMeta}>
              {pet.breed} · {pet.age}
            </Text>
          </View>
        </View>

        <SectionTitle>Your details</SectionTitle>
        <TextField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. Sara Ahmed"
          autoComplete="name"
          autoCapitalize="words"
          error={errorFor('fullName')}
          onLayout={saveY('fullName')}
        />
        <TextField
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          placeholder="e.g. 010 1234 5678"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errorFor('phone')}
          onLayout={saveY('phone')}
        />
        <TextField
          label="Email address"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          error={errorFor('email')}
          onLayout={saveY('email')}
        />

        <SectionTitle>About your home</SectionTitle>
        <SingleChoice
          label="Home type"
          options={['Apartment', 'House with a yard']}
          value={homeType}
          onChange={setHomeType}
          error={errorFor('homeType')}
          onLayout={saveY('homeType')}
        />
        <SingleChoice
          label="Kids at home?"
          options={['Yes', 'No']}
          value={kids}
          onChange={setKids}
          error={errorFor('kids')}
          onLayout={saveY('kids')}
        />
        <MultiChoice
          label="Other pets?"
          options={['None', 'Dogs', 'Cats', 'Other']}
          noneOption="None"
          values={otherPets}
          onChange={setOtherPets}
          error={errorFor('otherPets')}
          onLayout={saveY('otherPets')}
        />

        <SectionTitle>Book a visit</SectionTitle>
        <SelectField
          label="Preferred date"
          value={date ? formatDate(date) : undefined}
          placeholder="Select a date"
          onPress={openCalendar}
          error={errorFor('date')}
          onLayout={saveY('date')}
        />
        <SingleChoice
          label="Preferred time"
          options={['Morning', 'Afternoon', 'Evening']}
          value={time}
          onChange={setTime}
          error={errorFor('time')}
          onLayout={saveY('time')}
        />
        <TextField
          label="Message (optional)"
          value={message}
          onChangeText={setMessage}
          placeholder="Anything the shelter should know?"
          multiline
        />

        <AppButton
  label={sending ? 'Sending...' : 'Send request'}
  onPress={sending ? undefined : sendRequest}
  style={styles.sendButton}
/>
        <Text style={styles.note}>The shelter will contact you to confirm your visit.</Text>
      </ScrollView>

      {/* Calendar sheet */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent
        onRequestClose={() => setShowCalendar(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowCalendar(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Preferred date</Text>
          <DateTimePicker
            value={draftDate}
            mode="date"
            display="inline"
            minimumDate={tomorrow}
            maximumDate={lastDay}
            accentColor={Colors.primary}
            themeVariant="light"
            onValueChange={(_event, picked) => setDraftDate(picked)}
          />
          <AppButton
            label="Done"
            onPress={() => {
              setDate(draftDate);
              setShowCalendar(false);
            }}
            style={styles.doneButton}
          />
        </View>
      </Modal>
    </View>
  );
}

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.background,
    paddingBottom: 8,
    zIndex: 1,
    boxShadow: SHADOW,
  },
  headerRow: { height: 48, alignItems: 'center', justifyContent: 'center' },
  backButton: { position: 'absolute', left: 8, top: 0, bottom: 0, justifyContent: 'center' },
  headerTitle: { fontFamily: Fonts.bold, fontSize: 28, color: Colors.text },

  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 32 },

  petCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
  },
  petPhoto: { width: 64, height: 64, borderRadius: 8 },
  petInfo: { flex: 1 },
  petHint: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary },
  petName: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.label, marginTop: 2 },
  petMeta: { fontFamily: Fonts.regular, fontSize: 15, color: Colors.textSecondary, marginTop: 2 },

  sendButton: { height: 48, marginTop: 28, boxShadow: SHADOW },
  note: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },

  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.inputBorder,
  },
  sheetTitle: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.label, marginTop: 14 },
  doneButton: { height: 48, marginTop: 8 },
});
