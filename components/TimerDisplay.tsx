import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

type Phase = 'focus' | 'short_break' | 'long_break';

interface TimerDisplayProps {
  formattedTime: string;
  currentCycle: number;
  totalCycles: number;
  phase: Phase;
}

const phaseLabelMap: Record<Phase, string> = {
  focus: 'Foco',
  short_break: 'Pausa Curta',
  long_break: 'Pausa Longa',
};

export default function TimerDisplay({ formattedTime, currentCycle, totalCycles, phase }: TimerDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formattedTime}</Text>
      <Text style={styles.cycles}>Ciclos {currentCycle}/{totalCycles}</Text>
      <Text style={styles.phase}>{phaseLabelMap[phase]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  time: {
    fontSize: 85,
    color: '#fff',
    fontFamily: 'Raleway_100Thin',
  },
  cycles: {
    color: '#fff',
    letterSpacing: 4,
    fontSize: 14,
    fontFamily: 'Raleway_400Regular',
  },
  phase: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontFamily: 'Raleway_400Regular',
  },
});
