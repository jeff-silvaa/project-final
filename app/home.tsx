import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import TimerScreen from '../components/TimerScreen';

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
});
