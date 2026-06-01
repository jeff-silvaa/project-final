import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import TimerScreen from '../components/TimerScreen';
import usePomodoro from '../hooks/usePomodoro';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function TimerPage() {
  const router = useRouter();

  const {
    formattedTime,
    currentCycle,
    totalCycles,
    phase,
    isRunning,
    isPaused,
    start,
    pause,
    reset,
    reloadConfig
  } = usePomodoro();

  useFocusEffect(
    useCallback(() => {
      reloadConfig();
    }, [])
  );

  return (
    <TimerScreen
      isRunning={isRunning}
      isPaused={isPaused}
      onStart={start}
      onPause={pause}
      onReset={reset}
      timer={{
        formattedTime,
        currentCycle,
        totalCycles,
        phase
      }}
    />
  );
}