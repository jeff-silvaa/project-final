import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import PillButton from '../components/PillButton';
import GoogleLogo from '../components/GoogleLogo';

export default function LoginScreen() {
  const router = useRouter();

  const handleNavigateHome = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.title}>Bem Vindo ao +Focus</Text>
      </View>

      <View style={styles.middleSection}>
        <Text style={styles.centerText}>CONCENTRE-SE</Text>
      </View>

      <View style={styles.footer}>
        <PillButton
          label="Entrar com o Google"
          onPress={handleNavigateHome}
          variant="solid"
          width={260}
          icon={<GoogleLogo />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2257F5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  topSection: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 52,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'Raleway_700Bold',
  },
  middleSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 28,
    letterSpacing: 12,
    lineHeight: 34,
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
});
