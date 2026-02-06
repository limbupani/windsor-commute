import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MINT_GREEN = '#A8E6CF';
const CHARCOAL = '#1E1E1E';
const LIGHT_BG = '#E9FBF4';

export default function HostHomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Home</Text>
      <Text style={styles.subtitle}>Welcome to the host dashboard</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/select-role')}>
        <Text style={styles.buttonText}>Change Role</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: CHARCOAL },
  subtitle: { fontSize: 16, marginBottom: 40, color: CHARCOAL },
  button: { backgroundColor: CHARCOAL, padding: 16, borderRadius: 8, marginVertical: 10, width: '80%' },
  buttonText: { color: MINT_GREEN, textAlign: 'center', fontSize: 18, fontWeight: '600' },
});
