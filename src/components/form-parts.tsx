// Pieces shared by the two forms (Request to Adopt and Add a Pet):
// section titles, text fields, dropdown-style fields, chips, and the red error line.
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import {
  Alert,
  KeyboardTypeOptions,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export const REQUIRED_MESSAGE = 'Please fill this in';

// A pop-up message that works on the phone and on the web
// (React Native's Alert doesn't show anything in a browser).
export function showAlert(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
}

// Orange title like "Your details" or "Book a visit"
export function SectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

// Label + whatever is inside + the red error line under it.
// onLayout tells the form where this field is, so it can scroll to the first empty one.
function FieldShell({
  label,
  error,
  onLayout,
  children,
}: {
  label: string;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.field} onLayout={onLayout}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

// A box you type in
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  onLayout,
  multiline,
  keyboardType,
  autoComplete,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoComplete?: TextInputProps['autoComplete'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
}) {
  return (
    <FieldShell label={label} error={error} onLayout={onLayout}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        style={[styles.input, multiline && styles.inputMultiline, error && styles.inputError]}
      />
    </FieldShell>
  );
}

// Looks like a text box with ▾, but opens something when tapped (date, species)
export function SelectField({
  label,
  value,
  placeholder,
  onPress,
  error,
  onLayout,
  children,
}: {
  label: string;
  value?: string;
  placeholder: string;
  onPress: () => void;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  children?: ReactNode; // e.g. the species list that opens under the field
}) {
  return (
    <FieldShell label={label} error={error} onLayout={onLayout}>
      <Pressable onPress={onPress} style={[styles.input, styles.select, error && styles.inputError]}>
        <Text style={[styles.inputText, !value && styles.placeholder]}>{value || placeholder}</Text>
        <Ionicons name="caret-down" size={12} color={Colors.label} />
      </Pressable>
      {children}
    </FieldShell>
  );
}

// One round option button
export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}>
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

// A row of chips where only ONE can be picked (like a radio button)
export function SingleChoice({
  label,
  options,
  value,
  onChange,
  error,
  onLayout,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  return (
    <FieldShell label={label} error={error} onLayout={onLayout}>
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={value === option}
            onPress={() => onChange(option)}
          />
        ))}
      </View>
    </FieldShell>
  );
}

// A row of chips where MANY can be picked (like checkboxes).
// "noneOption" (e.g. "None") clears the others, and picking another clears it.
export function MultiChoice({
  label,
  options,
  values,
  onChange,
  noneOption,
  error,
  onLayout,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
  noneOption?: string;
  error?: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const toggle = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter((v) => v !== option));
    } else if (option === noneOption) {
      onChange([option]);
    } else {
      onChange([...values.filter((v) => v !== noneOption), option]);
    }
  };

  return (
    <FieldShell label={label} error={error} onLayout={onLayout}>
      <View style={styles.chips}>
        {options.map((option) => (
          <Chip
            key={option}
            label={option}
            selected={values.includes(option)}
            onPress={() => toggle(option)}
          />
        ))}
      </View>
    </FieldShell>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 20, color: Colors.primary, marginTop: 24 },
  field: { marginTop: 18 },
  label: { fontFamily: Fonts.semiBold, fontSize: 18, color: Colors.label, marginBottom: 10 },
  input: {
    minHeight: 46,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    backgroundColor: Colors.inputBackground,
    paddingHorizontal: 15,
    fontFamily: Fonts.regular,
    fontSize: 18,
    color: Colors.text,
  },
  inputMultiline: { height: 100, paddingTop: 12, textAlignVertical: 'top' },
  inputError: { borderColor: Colors.error, borderWidth: 1.5 },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inputText: { fontFamily: Fonts.regular, fontSize: 18, color: Colors.text },
  placeholder: { color: Colors.placeholder },
  error: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.error, marginTop: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    height: 36,
    paddingHorizontal: 17,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.inputBackground,
    justifyContent: 'center',
  },
  chipSelected: { backgroundColor: Colors.primary },
  chipText: { fontFamily: Fonts.regular, fontSize: 16, color: Colors.primary },
  chipTextSelected: { color: Colors.inputBackground },
});
