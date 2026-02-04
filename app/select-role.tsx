import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SelectRoleScreen() {
  const router = useRouter();

  const chooseRole = async (role: 'rider' | 'host') => {
    await AsyncStorage.setItem('userRole', role);
    router.replace(`(${role})`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>

      <TouchableOpacity style={styles.button} onPress={() => chooseRole('rider')}>
        <Text style={styles.buttonText}>I am a Rider</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => chooseRole('host')}>
        <Text style={styles.buttonText}>I am a Host</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 40 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, marginVertical: 10, width: '80%' },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 18 },
});