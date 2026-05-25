proximas alterações, exclui tela home, ficar somente a tela inicial e a tela do timer, adicionei um TextInput para o nome da atividade, e adicionei o nome da atividade no display do timer. 

```markdown# Anotações

### 1. Login — `app/login.tsx`
colocar autenticação com google usando `expo-auth-session/providers/google`

###2. Salvar histórico de pomodoros concluídos usando AsyncStorage
- Chave: `@pomodoro_history`
- Estrutura: array de objetos `{ date: string, activity: string }`
- Exibir histórico em uma aba dentro do settings
- Permitir limpar histórico com um botão