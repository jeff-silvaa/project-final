import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import TimerScreen from '../components/TimerScreen';
import usePomodoro from '../hooks/usePomodoro';

export default function TimerPage() {
  const router = useRouter();
  const { formattedTime, currentCycle, totalCycles, phase, isRunning, start, pause, reset } = usePomodoro();

  useEffect(() => {
    start();
  }, []);

  const handleReset = () => {
    reset();
    router.replace('/home');
  };

  return (
    <TimerScreen
      isRunning={isRunning}
      onStart={start}
      onPause={pause}
      onReset={handleReset}
      timer={{ formattedTime, currentCycle, totalCycles, phase }}
    />
  );
}
