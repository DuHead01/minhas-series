import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { deleteSerie, getSerieById, toggleSerieConcluida } from '../src/database/serieRepository';
import type { Serie } from '../src/types/serie';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serieId = Number(id);
  const [serie, setSerie] = useState<Serie | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSerie = useCallback(async () => {
    if (!Number.isInteger(serieId) || serieId < 1) { setSerie(null); setLoading(false); return; }
    setLoading(true);
    try { setSerie(await getSerieById(serieId)); }
    catch { Alert.alert('Erro', 'Não foi possível carregar a série.'); }
    finally { setLoading(false); }
  }, [serieId]);

  useFocusEffect(useCallback(() => { void loadSerie(); }, [loadSerie]));

  async function toggle() {
    if (!serie) return;
    await toggleSerieConcluida(serie.id);
    await loadSerie();
  }

  function confirmDelete() {
    if (!serie) return;
    Alert.alert('Excluir série', `Deseja excluir "${serie.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => { void deleteSerie(serie.id).then(() => router.replace('/')).catch(() => Alert.alert('Erro', 'Não foi possível excluir a série.')); } },
    ]);
  }

  if (loading) return <View className="flex-1 items-center justify-center bg-neutral-950"><ActivityIndicator color="#34d399" /></View>;
  if (!serie) return <View className="flex-1 items-center justify-center bg-neutral-950 px-6"><Text className="text-lg text-white">Série não encontrada.</Text><Pressable onPress={() => router.replace('/')} className="mt-5 rounded-xl bg-emerald-400 px-5 py-3"><Text className="font-bold text-neutral-950">Voltar à lista</Text></Pressable></View>;

  return <ScrollView className="flex-1 bg-neutral-950" contentContainerClassName="px-5 pb-10 pt-6">
    <View className="mb-6 rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
      <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-emerald-300">{serie.concluida ? 'Concluída' : 'Assistindo'}</Text>
      <Text className="text-3xl font-extrabold text-white">{serie.titulo}</Text>
      <Text className="mt-2 text-lg text-neutral-400">{serie.plataforma}</Text>
      <View className="my-6 h-px bg-neutral-800" />
      <Text className="mb-2 text-neutral-400">Temporadas assistidas</Text><Text className="text-xl font-bold text-white">{serie.temporadas}</Text>
      <Text className="mb-2 mt-5 text-neutral-400">Nota</Text><Text className="text-xl font-bold text-amber-300">{serie.nota === null ? 'Sem nota' : `${'★'.repeat(serie.nota)}${'☆'.repeat(5 - serie.nota)} (${serie.nota}/5)`}</Text>
      <Text className="mb-2 mt-5 text-neutral-400">Adicionada em</Text><Text className="text-base text-white">{new Date(serie.createdAt).toLocaleDateString('pt-BR')}</Text>
    </View>
    <Pressable onPress={() => void toggle()} className="mb-3 items-center rounded-2xl bg-emerald-400 py-4"><Text className="font-extrabold text-neutral-950">{serie.concluida ? 'Voltar para assistindo' : 'Marcar como concluída'}</Text></Pressable>
    <Pressable onPress={() => router.push({ pathname: '/form', params: { id: String(serie.id) } })} className="mb-3 items-center rounded-2xl border border-neutral-700 py-4"><Text className="font-bold text-white">Editar</Text></Pressable>
    <Pressable onPress={confirmDelete} className="items-center rounded-2xl py-4"><Text className="font-bold text-red-400">Excluir série</Text></Pressable>
  </ScrollView>;
}
