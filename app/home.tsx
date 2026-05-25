import { StyleSheet, View, TextInput, } from 'react-native';
import { useRouter } from 'expo-router';
import TimerScreen from '../components/TimerScreen';
import { useState } from 'react';


export default function HomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/timer');
  };

  return (
    <View style={styles.container}>
      <TimerScreen
        isRunning={false}
        onStart={handleStart}
        onPause={() => undefined}
        onReset={() => undefined}
        timer={{ formattedTime: '25:00', currentCycle: 1, totalCycles: 4, phase: 'focus' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  activityName: {
  color: '#fff',
  fontSize: 24,
  textAlign: 'center',
  fontFamily: 'Raleway_700Bold',
},
});
