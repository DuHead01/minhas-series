import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return <Stack screenOptions={{ headerStyle: { backgroundColor: '#171717' }, headerTintColor: '#fff', contentStyle: { backgroundColor: '#0a0a0a' } }}>
    <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
    <Stack.Screen name="form" options={{ title: 'Série' }} />
    <Stack.Screen name="detalhe" options={{ title: 'Detalhes' }} />
  </Stack>;
}
