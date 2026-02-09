import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false, title: 'Rider Login' }} />
    </Stack>
  );
}
