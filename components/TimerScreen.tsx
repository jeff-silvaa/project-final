import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import PillButton from './PillButton';
import TimerDisplay from './TimerDisplay';

type Phase = 'focus' | 'short_break' | 'long_break';

interface TimerScreenProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  timer: Pick<
    {
      formattedTime: string;
      currentCycle: number;
      totalCycles: number;
      phase: Phase;
    },
    'formattedTime' | 'currentCycle' | 'totalCycles' | 'phase'
  >;
}

export default function TimerScreen({ isRunning, onStart, onPause, onReset, timer }: TimerScreenProps) {
  const router = useRouter();

  return (
    <ImageBackground source={require('../assets/night-sky.jpg')} style={styles.background} resizeMode="cover">
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.settingsButton} onPress={() => router.push('/settings')}>
            ⚙
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.activityName}>Nome da Atividade</Text>
          <TimerDisplay
            formattedTime={timer.formattedTime}
            currentCycle={timer.currentCycle}
            totalCycles={timer.totalCycles}
            phase={timer.phase}
          />
        </View>

        <View style={styles.footer}>
          {isRunning ? (
            <View style={styles.buttonRow}>
              <PillButton label="⏸ Pausar" onPress={onPause} variant="outline" width="48%" />
              <PillButton label="↺ Reiniciar" onPress={onReset} variant="solid" width="48%" />
            </View>
          ) : (
            <PillButton label="▶ Iniciar pomodoro" onPress={onStart} variant="solid" width="100%" />
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-end',
  },
  settingsButton: {
    color: '#fff',
    fontSize: 28,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  activityName: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Raleway_700Bold',
    marginBottom: 24,
  },
  footer: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});
