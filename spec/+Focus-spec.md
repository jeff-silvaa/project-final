# +Focus — Pomodoro Timer App
### Spec-Driven Development Prompt · Expo SDK 54 · React Native · TypeScript

---

## Visão Geral

| Campo | Valor |
|---|---|
| **App** | +Focus |
| **Plataforma** | iOS e Android (Expo SDK 54) |
| **Linguagem** | TypeScript (strict) |
| **Navegação** | expo-router (file-based) |
| **Estado** | React hooks + AsyncStorage |
| **Notificações** | Som nativo do sistema via `expo-haptics` + `expo-notifications` |

> **Objetivo:** Implementar um Pomodoro Timer com 3 telas (Login, Home, Timer), configurações persistidas e notificação sonora nativa do dispositivo ao fim de cada ciclo.

---

## Dependências

Instale antes de começar:

```bash
npx expo install expo-router
npx expo install expo-notifications
npx expo install expo-haptics
npx expo install @react-native-async-storage/async-storage
npx expo install expo-font @expo-google-fonts/raleway
npx expo install expo-linear-gradient
```

---

## Estrutura de Arquivos

```
app/
  _layout.tsx          ← Stack navigator raiz + carregamento de fontes
  index.tsx            ← Tela de Login
  home.tsx             ← Tela Home (timer parado)
  timer.tsx            ← Tela Timer (timer rodando)
  settings.tsx         ← Configurações (modal)

hooks/
  usePomodoro.ts       ← Toda a lógica do timer + notificação nativa

components/
  TimerScreen.tsx      ← Layout compartilhado entre Home e Timer
  TimerDisplay.tsx     ← Exibe MM:SS + ciclos + fase
  PillButton.tsx       ← Botão reutilizável estilo pill

assets/
  night-sky.jpg        ← Imagem de fundo (adicionar manualmente)
```

---

## Rotas

| Rota | Tela | Descrição |
|---|---|---|
| `/` | `index.tsx` | Login — ponto de entrada |
| `/home` | `home.tsx` | Timer parado, botão iniciar |
| `/timer` | `timer.tsx` | Timer rodando, botões pausar/reiniciar |
| `/settings` | `settings.tsx` | Modal de configurações |

---

## Telas

### 1. Login — `app/index.tsx`

**Layout:**
- Fundo: cor sólida `#2257F5`
- Topo esquerdo: título `"Bem Vindo ao +Focus"` — branco, bold, 32px
- Centro: texto `"CONCENTRE-SE"` rotacionado 90°, letras espaçadas verticalmente (`letterSpacing` alto), branco, opacidade 0.6
- Rodapé: dois botões centralizados com `gap` entre eles

**Botões:**

| Label | Variante | Ação |
|---|---|---|
| Fazer Login | `solid` (fundo branco) | `router.replace('/home')` |
| Criar Conta | `outline` (borda branca) | `router.replace('/home')` |

> Sem autenticação real. Ambos navegam para `/home`.

---

### 2. Home — `app/home.tsx`

**Layout:** usar `<TimerScreen isRunning={false} />`

**Estado inicial do timer:**
- `timeLeft` = 25 × 60 segundos
- `isRunning` = false
- `phase` = `'focus'`
- `currentCycle` = 1

**Botão único:**
- Label: `"▶ Iniciar pomodoro"`
- Ação: `start()` + `router.push('/timer')`

---

### 3. Timer — `app/timer.tsx`

**Layout:** usar `<TimerScreen isRunning={true} />`

**Dois botões lado a lado:**

| Label | Ação |
|---|---|
| ⏸ Pausar | `pause()` |
| ↺ Reiniciar | `reset()` + `router.replace('/home')` |

---

### 4. Configurações — `app/settings.tsx`

**Apresentação:** modal (definir `presentation: 'modal'` no `_layout.tsx`)

**Campos (TextInput, `keyboardType="numeric"`):**

| Label | Chave | Padrão |
|---|---|---|
| Duração do foco | `focusDuration` | 25 min |
| Pausa curta | `shortBreak` | 5 min |
| Pausa longa | `longBreak` | 15 min |
| Total de ciclos | `totalCycles` | 4 |

**Comportamento:**
- Ao abrir: carregar valores do AsyncStorage (chave `@pomodoro_config`) ou usar defaults
- Botão "Salvar": persistir no AsyncStorage → fechar modal → reiniciar timer com novos valores
- Botão voltar no header nativo

---

## Hook — `hooks/usePomodoro.ts`

### Interface

```ts
type Phase = 'focus' | 'short_break' | 'long_break';

interface PomodoroConfig {
  focusDuration: number;   // minutos
  shortBreak: number;      // minutos
  longBreak: number;       // minutos
  totalCycles: number;
}

interface UsePomodoro {
  timeLeft: number;
  formattedTime: string;   // "MM:SS"
  isRunning: boolean;
  phase: Phase;
  currentCycle: number;
  totalCycles: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
}
```

### Regras de negócio

```
Sequência de fases:
  focus → short_break → focus → short_break → ... (a cada 4x focus) → long_break → reinicia

Ao completar uma sessão de foco:
  currentCycle++
  if currentCycle > totalCycles → long_break, depois reset currentCycle = 1
  else → short_break

Ao chegar em 0:
  1. Parar o interval
  2. Disparar notificação nativa (ver seção abaixo)
  3. Aguardar 1500ms
  4. Avançar para próxima fase automaticamente
```

### Formatação de tempo

```ts
const formatTime = (seconds: number): string => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
};
```

> Usar `useRef` para o `intervalId`. **Não** usar `useState` para o interval.

---

## Notificação Sonora Nativa

> Usar o **som padrão do sistema operacional** — sem arquivos de áudio customizados.

### Setup em `app/_layout.tsx`

```ts
import * as Notifications from 'expo-notifications';

// Configurar handler antes de renderizar
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,   // ← usa o som padrão do SO
    shouldSetBadge: false,
  }),
});

// Solicitar permissão ao montar
useEffect(() => {
  Notifications.requestPermissionsAsync();
}, []);
```

### Função de disparo (dentro do `usePomodoro.ts`)

```ts
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

const notifyPhaseEnd = async (phase: Phase, isLastCycle: boolean) => {
  // Vibração háptica junto com o som
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  const messages: Record<string, { title: string; body: string }> = {
    focus:       { title: '🍅 Foco concluído!',     body: 'Hora de descansar.' },
    short_break: { title: '⏰ Pausa encerrada!',     body: 'Vamos focar novamente.' },
    long_break:  { title: '🎉 Ciclo completo!',      body: 'Ótimo trabalho! Reiniciando.' },
  };

  const msg = isLastCycle
    ? { title: '🏆 Todos os ciclos completos!', body: 'Excelente sessão de foco!' }
    : messages[phase];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: msg.title,
      body: msg.body,
      sound: true,   // ← som nativo do dispositivo
    },
    trigger: null,   // disparo imediato
  });
};
```

> Chamar `notifyPhaseEnd(phase, isLastCycle)` no momento em que `timeLeft` chegar a `0`.

---

## Componentes

### `PillButton.tsx`

```ts
interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'outline';   // solid = fundo branco | outline = borda branca
  width?: number | string;
  icon?: React.ReactNode;
}
```

**Estilo base:**
- `borderRadius: 999`
- `paddingVertical: 14`
- `paddingHorizontal: 32`
- `solid` → `backgroundColor: '#fff'`, texto `#111`
- `outline` → `borderWidth: 1.5`, `borderColor: '#fff'`, texto `#fff`

---

### `TimerDisplay.tsx`

```ts
interface TimerDisplayProps {
  formattedTime: string;
  currentCycle: number;
  totalCycles: number;
  phase: Phase;
}
```

**Layout:**
- `formattedTime` → fonte Raleway_100Thin, 85px, cor branca
- `"Ciclos  X/Y"` → branco, letterSpacing 4, abaixo do timer
- Indicador de fase (texto pequeno, opacidade 0.7): `"Foco"` | `"Pausa Curta"` | `"Pausa Longa"`

---

### `TimerScreen.tsx`

```ts
interface TimerScreenProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  timer: Pick<UsePomodoro, 'formattedTime' | 'currentCycle' | 'totalCycles' | 'phase'>;
}
```

**Layout (de cima para baixo):**
1. `ImageBackground` com `assets/night-sky.jpg` + overlay `rgba(0,0,0,0.45)`
2. Header: ícone `⚙` (touchable) → `router.push('/settings')`
3. Texto `"Nome da Atividade"` centralizado
4. `<TimerDisplay />` centralizado verticalmente
5. Rodapé: `<PillButton />` único (Home) ou dois botões lado a lado (Timer)

---

## Persistência

Chave AsyncStorage: `@pomodoro_config`

```ts
// Salvar
await AsyncStorage.setItem('@pomodoro_config', JSON.stringify(config));

// Carregar
const raw = await AsyncStorage.getItem('@pomodoro_config');
const config: PomodoroConfig = raw ? JSON.parse(raw) : DEFAULT_CONFIG;
```

O hook `usePomodoro` deve carregar a config do AsyncStorage no `useEffect` inicial e reagir a mudanças (ex: após salvar nas configurações).

---

## Ordem de Implementação

Implemente **um arquivo por vez**, nesta sequência:

```
1. app/_layout.tsx          ← fonts + permissão de notificação + Notifications.setNotificationHandler
2. hooks/usePomodoro.ts     ← toda a lógica antes das telas
3. components/PillButton.tsx
4. components/TimerDisplay.tsx
5. components/TimerScreen.tsx
6. app/index.tsx            ← Login
7. app/home.tsx             ← Home
8. app/timer.tsx            ← Timer rodando
9. app/settings.tsx         ← Configurações
```

> Após cada arquivo, confirme que não há erros de TypeScript antes de prosseguir.