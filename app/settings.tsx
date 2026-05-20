import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import usePomodoro, { PomodoroConfig } from '../hooks/usePomodoro';
import PillButton from '../components/PillButton';

export default function SettingsScreen() {
  const router = useRouter();
  const { config, updateConfig } = usePomodoro();

  const [focusDuration, setFocusDuration] = useState(String(config.focusDuration));
  const [shortBreak, setShortBreak] = useState(String(config.shortBreak));
  const [longBreak, setLongBreak] = useState(String(config.longBreak));
  const [totalCycles, setTotalCycles] = useState(String(config.totalCycles));

  const handleSave = async () => {
    const next: PomodoroConfig = {
      focusDuration: Math.max(Number(focusDuration) || 1, 1),
      shortBreak: Math.max(Number(shortBreak) || 1, 1),
      longBreak: Math.max(Number(longBreak) || 1, 1),
      totalCycles: Math.max(Number(totalCycles) || 1, 1),
    };

    await updateConfig(next);
    router.back();
  };

  const renderField = (
    label: string,
    value: string,
    setValue: (t: string) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        style={styles.input}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Configurações</Text>

        {renderField('Foco (min)', focusDuration, setFocusDuration)}
        {renderField('Pausa curta', shortBreak, setShortBreak)}
        {renderField('Pausa longa', longBreak, setLongBreak)}
        {renderField('Ciclos', totalCycles, setTotalCycles)}

        <PillButton label="Salvar" onPress={handleSave} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24, gap: 20 },
  header: { fontSize: 24, fontWeight: '700' },
  field: { gap: 8 },
  label: { fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
  },
});