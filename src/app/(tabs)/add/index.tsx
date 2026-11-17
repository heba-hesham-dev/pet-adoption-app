// Add a Pet: someone posts their pet for adoption. The post goes to the shelter
// to review, so it does not appear on Home.
// Photos come from the real camera or gallery, only when the user picks them.
import { Ionicons } from '@expo/vector-icons';
import { File } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
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
  SelectField,
  showAlert,
  SingleChoice,
  TextField,
} from '@/components/form-parts';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { API_URL } from '@/constants/api';

const SHADOW = '0px 4px 4px rgba(0, 0, 0, 0.25)';
const MAX_PHOTOS = 5;
const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Turtle', 'Other'];

export default function AddPetScreen() {
  // Changing this number gives a fresh, empty form after posting
  const [formKey, setFormKey] = useState(0);

  return (
    <AddPetForm
      key={formKey}
      onPosted={() => {
        setFormKey((n) => n + 1);
        router.replace('/add/post-published');
      }}
    />
  );
}

type FieldName =
  | 'photos'
  | 'name'
  | 'species'
  | 'breed'
  | 'age'
  | 'sex'
  | 'size'
  | 'about'
  | 'location'
  | 'email'
  | 'phone';
const FIELD_ORDER: FieldName[] = [
  'photos',
  'name',
  'species',
  'breed',
  'age',
  'sex',
  'size',
  'about',
  'location',
  'email',
  'phone',
];

function AddPetForm({ onPosted }: { onPosted: () => void }) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const positions = useRef<Partial<Record<FieldName, number>>>({});
  const saveY = (name: FieldName) => (event: { nativeEvent: { layout: { y: number } } }) => {
    positions.current[name] = event.nativeEvent.layout.y;
  };

  const [photos, setPhotos] = useState<string[]>([]); // photo addresses on the phone
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [size, setSize] = useState('');
  const [health, setHealth] = useState<string[]>([]);
  const [goodWith, setGoodWith] = useState<string[]>([]);
  const [about, setAbout] = useState('');
  const [location, setLocation] = useState('');
  const [fee, setFee] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);
  const [showPhotoSheet, setShowPhotoSheet] = useState(false);

  const required = (value: string) => (value.trim() ? undefined : REQUIRED_MESSAGE);
  const errors: Record<FieldName, string | undefined> = {
    photos: photos.length > 0 ? undefined : 'Please add at least one photo',
    name: required(name),
    species: required(species),
    breed: required(breed),
    age: required(age),
    sex: required(sex),
    size: required(size),
    about: required(about),
    location: required(location),
    email: !email.trim()
      ? REQUIRED_MESSAGE
      : /^\S+@\S+\.\S+$/.test(email.trim())
        ? undefined
        : 'Please enter a valid email',
    phone: required(phone),
  };
  const errorFor = (field: FieldName) => (submitted ? errors[field] : undefined);

  // Is the post being sent right now? The button shows "Posting..." meanwhile.
  const [posting, setPosting] = useState(false);

  const post = async () => {
    const firstMissing = FIELD_ORDER.find((field) => errors[field]);
    if (firstMissing) {
      setSubmitted(true);
      const y = positions.current[firstMissing] ?? 0;
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
      return;
    }

    setPosting(true);
    try {
      // FormData carries text and photo files together (JSON can't carry files)
      const formData = new FormData();
      formData.append('name', name);
      formData.append('species', species);
      formData.append('breed', breed);
      formData.append('age', age);
      formData.append('sex', sex);
      formData.append('size', size);
      formData.append('health', JSON.stringify(health));
      formData.append('goodWith', JSON.stringify(goodWith));
      formData.append('about', about);
      formData.append('location', location);
      formData.append('adoptionFee', fee);
      formData.append('email', email);
      formData.append('phone', phone);

      // Each photo goes in as a file named "photos", the name the server expects.
      // File (from expo-file-system) opens the photo on the phone so fetch can send it.
      for (const uri of photos) {
        if (Platform.OS === 'web') {
          // In a browser the photo is already in memory, so turn it into a Blob
          const blob = await (await fetch(uri)).blob();
          const extension = blob.type.split('/')[1] ?? 'jpg';
          formData.append('photos', blob, `photo.${extension}`);
        } else {
          formData.append('photos', new File(uri));
        }
      }

      // No headers here: fetch sets the right one for FormData by itself
      const response = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // The server explains what went wrong in "error"
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? `Server error ${response.status}`);
      }

      onPosted();
    } catch (error) {
      console.error('Post failed:', error); // shows the real reason in the Expo terminal
      showAlert('Something went wrong', 'Please check your connection and try again.');
    } finally {
      setPosting(false);
    }
  };

  // ----- Photos -----
  const addPhotos = (uris: string[]) =>
    setPhotos((current) => [...current, ...uris].slice(0, MAX_PHOTOS));

  // iPhone can't open the camera or gallery while the bottom sheet is still closing.
  // So we remember what was tapped, close the sheet, and run it once the sheet is gone.
  const pendingPhotoAction = useRef<(() => void) | null>(null);
  const runPendingPhotoAction = () => {
    const action = pendingPhotoAction.current;
    pendingPhotoAction.current = null;
    action?.();
  };
  const closeSheetThen = (action: () => void) => {
    pendingPhotoAction.current = action;
    setShowPhotoSheet(false);
    // onDismiss (below) only fires on iPhone, so Android uses a short wait instead
    if (Platform.OS !== 'ios') setTimeout(runPendingPhotoAction, 300);
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      showAlert('Camera access needed', 'Allow camera access in Settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) addPhotos(result.assets.map((asset) => asset.uri));
  };

  const chooseFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS - photos.length,
      quality: 0.7,
    });
    if (!result.canceled) addPhotos(result.assets.map((asset) => asset.uri));
  };

  const removePhoto = (uri: string) => setPhotos((current) => current.filter((p) => p !== uri));

  const photoError = errorFor('photos');

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 6 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.navigate('/')} hitSlop={12} style={styles.backButton}>
            <Ionicons name="chevron-back" size={32} color={Colors.primary} />
          </Pressable>
          <Text style={styles.headerTitle}>Add a Pet</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets>
        {/* Photos box */}
        <View onLayout={saveY('photos')}>
          {photos.length === 0 ? (
            <Pressable
              onPress={() => setShowPhotoSheet(true)}
              style={[styles.photoBox, photoError && styles.photoBoxError]}>
              <Ionicons name="add" size={34} color={Colors.primary} />
              <Text style={styles.photoTitle}>Add pet photos</Text>
              <Text style={styles.photoHint}>Up to {MAX_PHOTOS} photos</Text>
            </Pressable>
          ) : (
            <View style={[styles.photoBox, styles.photoGrid]}>
              {photos.map((uri) => (
                <View key={uri}>
                  <Image source={{ uri }} style={styles.thumb} />
                  <Pressable onPress={() => removePhoto(uri)} hitSlop={8} style={styles.removePhoto}>
                    <Ionicons name="close" size={14} color={Colors.white} />
                  </Pressable>
                </View>
              ))}
              {photos.length < MAX_PHOTOS && (
                <Pressable onPress={() => setShowPhotoSheet(true)} style={styles.addMore}>
                  <Ionicons name="add" size={28} color={Colors.primary} />
                </Pressable>
              )}
            </View>
          )}
          {photoError ? <Text style={styles.errorText}>{photoError}</Text> : null}
        </View>

        <TextField
          label="Pet name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Max"
          autoCapitalize="words"
          error={errorFor('name')}
          onLayout={saveY('name')}
        />

        <SelectField
          label="Species"
          value={species}
          placeholder="Select species"
          onPress={() => setShowSpecies((open) => !open)}
          error={errorFor('species')}
          onLayout={saveY('species')}>
          {showSpecies && (
            <View style={styles.dropdown}>
              {SPECIES.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setSpecies(option);
                    setShowSpecies(false);
                  }}
                  style={({ pressed }) => [styles.dropdownItem, pressed && styles.dropdownPressed]}>
                  <Text
                    style={[styles.dropdownText, species === option && styles.dropdownSelected]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </SelectField>

        <TextField
          label="Breed"
          value={breed}
          onChangeText={setBreed}
          placeholder="e.g. Golden Retriever"
          autoCapitalize="words"
          error={errorFor('breed')}
          onLayout={saveY('breed')}
        />
        <TextField
          label="Age"
          value={age}
          onChangeText={setAge}
          placeholder="e.g. 3 years"
          error={errorFor('age')}
          onLayout={saveY('age')}
        />
        <SingleChoice
          label="Sex"
          options={['Male', 'Female']}
          value={sex}
          onChange={setSex}
          error={errorFor('sex')}
          onLayout={saveY('sex')}
        />
        <SingleChoice
          label="Size"
          options={['Small', 'Medium', 'Large']}
          value={size}
          onChange={setSize}
          error={errorFor('size')}
          onLayout={saveY('size')}
        />
        <MultiChoice
          label="Health"
          options={['Vaccinated', 'Spayed / Neutered', 'Microchipped', 'House-trained']}
          values={health}
          onChange={setHealth}
        />
        <MultiChoice
          label="Good with"
          options={['Kids', 'Dogs', 'Cats']}
          values={goodWith}
          onChange={setGoodWith}
        />
        <TextField
          label="About the pet"
          value={about}
          onChangeText={setAbout}
          placeholder="Personality, energy level, care needs..."
          multiline
          error={errorFor('about')}
          onLayout={saveY('about')}
        />
        <TextField
          label="Location"
          value={location}
          onChangeText={setLocation}
          placeholder="City or shelter name"
          error={errorFor('location')}
          onLayout={saveY('location')}
        />
        <TextField
          label="Adoption fee (optional)"
          value={fee}
          onChangeText={setFee}
          placeholder="e.g. 1,500 EGP"
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

        <AppButton
          label={posting ? 'Posting...' : 'Post for adoption'}
          onPress={posting ? undefined : post}
          style={styles.postButton}
        />
      </ScrollView>

      {/* Photo bottom sheet */}
      <Modal
        visible={showPhotoSheet}
        animationType="slide"
        transparent
        onRequestClose={() => setShowPhotoSheet(false)}
        onDismiss={runPendingPhotoAction}>
        <Pressable style={styles.backdrop} onPress={() => setShowPhotoSheet(false)} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>Add pet photos</Text>
          <Pressable
            onPress={() => closeSheetThen(takePhoto)}
            style={({ pressed }) => [styles.sheetOption, pressed && styles.sheetOptionPressed]}>
            <Text style={styles.sheetOptionText}>Take photo</Text>
          </Pressable>
          <Pressable
            onPress={() => closeSheetThen(chooseFromGallery)}
            style={({ pressed }) => [styles.sheetOption, pressed && styles.sheetOptionPressed]}>
            <Text style={styles.sheetOptionText}>Choose from gallery</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
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

  // Photos
  photoBox: {
    minHeight: 148,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoBoxError: { borderColor: Colors.error },
  photoTitle: { fontFamily: Fonts.semiBold, fontSize: 16, color: Colors.label, marginTop: 4 },
  photoHint: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
  },
  thumb: { width: 92, height: 92, borderRadius: 8 },
  removePhoto: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMore: {
    width: 92,
    height: 92,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.error, marginTop: 6 },

  // Species list
  dropdown: {
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: Colors.white,
    paddingVertical: 6,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.15)',
  },
  dropdownItem: { paddingHorizontal: 20, paddingVertical: 8 },
  dropdownPressed: { backgroundColor: Colors.inputBackground },
  dropdownText: { fontFamily: Fonts.regular, fontSize: 18, color: Colors.label },
  dropdownSelected: { fontFamily: Fonts.semiBold, color: Colors.primary },

  postButton: { height: 48, marginTop: 28, boxShadow: SHADOW },

  // Bottom sheet
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.35)' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.inputBorder,
  },
  sheetTitle: { fontFamily: Fonts.semiBold, fontSize: 20, color: Colors.label, marginTop: 8 },
  sheetOption: {
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  sheetOptionPressed: { backgroundColor: Colors.inputBackground },
  sheetOptionText: { fontFamily: Fonts.regular, fontSize: 18, color: Colors.label },
});
