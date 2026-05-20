import { useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Phase = 'focus' | 'short_break' | 'long_break';

export interface PomodoroConfig {
  focusDuration: number;
  shortBreak: number;
  longBreak: number;
  totalCycles: number;
}

export interface UsePomodoro {
  timeLeft: number;
  formattedTime: string;
  isRunning: boolean;
  phase: Phase;
  currentCycle: number;
  totalCycles: number;
  config: PomodoroConfig;

  start: () => void;
  pause: () => void;
  reset: () => void;
  updateConfig: (config: PomodoroConfig) => Promise<void>;
}

const STORAGE_KEY = '@pomodoro_config';

export const DEFAULT_CONFIG: PomodoroConfig = {
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  totalCycles: 4,
};

const formatTime = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function usePomodoro(): UsePomodoro {
  const [config, setConfig] = useState<PomodoroConfig | null>(null);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_CONFIG.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('focus');
  const [currentCycle, setCurrentCycle] = useState(1);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ✅ Refs para evitar stale closure dentro do setInterval
  const phaseRef = useRef<Phase>('focus');
  const currentCycleRef = useRef(1);
  const configRef = useRef<PomodoroConfig>(DEFAULT_CONFIG);

  // Mantém os refs sincronizados com o state
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { currentCycleRef.current = currentCycle; }, [currentCycle]);
  useEffect(() => { if (config) configRef.current = config; }, [config]);

  const clearTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : DEFAULT_CONFIG;
        setConfig(parsed);
        setTimeLeft(parsed.focusDuration * 60);
      } catch {
        setConfig(DEFAULT_CONFIG);
      }
    };
    load();
  }, []);

  const safeConfig = config ?? DEFAULT_CONFIG;

  // ✅ Lógica de transição de fase ao chegar em zero
  const advancePhase = () => {
    const cfg = configRef.current;
    const phase = phaseRef.current;
    const cycle = currentCycleRef.current;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (phase === 'focus') {
      const isLastCycle = cycle >= cfg.totalCycles;

      if (isLastCycle) {
        // Todos os ciclos completos — reinicia
        Notifications.scheduleNotificationAsync({
          content: { title: '🎉 Sessão completa!', body: 'Você completou todos os ciclos.' },
          trigger: null,
        });
        setPhase('long_break');
        phaseRef.current = 'long_break';
        setTimeLeft(cfg.longBreak * 60);
      } else {
        Notifications.scheduleNotificationAsync({
          content: { title: '☕ Pausa curta!', body: 'Descanse por alguns minutos.' },
          trigger: null,
        });
        setPhase('short_break');
        phaseRef.current = 'short_break';
        setTimeLeft(cfg.shortBreak * 60);
      }
    } else if (phase === 'short_break') {
      const nextCycle = cycle + 1;
      Notifications.scheduleNotificationAsync({
        content: { title: '🎯 Foco!', body: `Ciclo ${nextCycle} de ${cfg.totalCycles}` },
        trigger: null,
      });
      setCurrentCycle(nextCycle);
      currentCycleRef.current = nextCycle;
      setPhase('focus');
      phaseRef.current = 'focus';
      setTimeLeft(cfg.focusDuration * 60);
    } else {
      // long_break → reinicia tudo
      Notifications.scheduleNotificationAsync({
        content: { title: '🔄 Nova sessão!', body: 'Pronto para começar de novo?' },
        trigger: null,
      });
      setCurrentCycle(1);
      currentCycleRef.current = 1;
      setPhase('focus');
      phaseRef.current = 'focus';
      setTimeLeft(cfg.focusDuration * 60);
    }
  };

  const start = () => {
    if (isRunning) return;
    setIsRunning(true);
    clearTimer();

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // ✅ Chama a transição quando o tempo acabar
          clearTimer();
          advancePhase();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    setIsRunning(false);
    clearTimer();
  };

  const reset = () => {
    pause();
    const cfg = configRef.current;
    setPhase('focus');
    phaseRef.current = 'focus';
    setCurrentCycle(1);
    currentCycleRef.current = 1;
    setTimeLeft(cfg.focusDuration * 60);
  };

  const updateConfig = async (newConfig: PomodoroConfig) => {
    setConfig(newConfig);
    configRef.current = newConfig;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));

    setPhase('focus');
    phaseRef.current = 'focus';
    setCurrentCycle(1);
    currentCycleRef.current = 1;
    setTimeLeft(newConfig.focusDuration * 60);
    setIsRunning(false);
    clearTimer();
  };

  return {
    timeLeft,
    formattedTime: formatTime(timeLeft),
    isRunning,
    phase,
    currentCycle,
    totalCycles: safeConfig.totalCycles,
    config: safeConfig,

    start,
    pause,
    reset,
    updateConfig,
  };
}