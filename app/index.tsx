import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { getSeries } from '../src/database/serieRepository';
import type { Serie, SerieFilter } from '../src/types/serie';

const filters: { label: string; value: SerieFilter }[] = [
  { label: 'Todas', value: 'todas' }, { label: 'Assistindo', value: 'assistindo' }, { label: 'Concluídas', value: 'concluidas' },
];

export default function Index() {
  const [filter, setFilter] = useState<SerieFilter>('todas');
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSeries = useCallback(async () => {
    setLoading(true);
    try { setSeries(await getSeries(filter)); setError(''); }
    catch { setError('Não foi possível carregar suas séries.'); }
    finally { setLoading(false); }
  }, [filter]);

  useFocusEffect(useCallback(() => { void loadSeries(); }, [loadSeries]));

  return <View className="flex-1 bg-neutral-950 px-5 pt-6">
    <Text className="text-3xl font-extrabold text-white">Minhas séries</Text>
    <Text className="mb-5 mt-1 text-neutral-400">Seu próximo episódio começa aqui.</Text>
    <View className="mb-5 flex-row rounded-2xl bg-neutral-900 p-1">
      {filters.map((item) => <Pressable key={item.value} onPress={() => setFilter(item.value)} className={`flex-1 items-center rounded-xl px-2 py-3 ${filter === item.value ? 'bg-emerald-400' : ''}`}>
        <Text className={`text-xs font-bold ${filter === item.value ? 'text-neutral-950' : 'text-neutral-400'}`}>{item.label}</Text>
      </Pressable>)}
    </View>
    {error ? <Text className="mb-3 text-red-400">{error}</Text> : null}
    {loading ? <ActivityIndicator color="#34d399" className="mt-10" /> : <FlatList
      data={series}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
      ListEmptyComponent={<View className="flex-1 items-center justify-center py-16"><Text className="text-lg font-bold text-white">Nenhuma série por aqui</Text><Text className="mt-2 text-center text-neutral-500">Adicione sua primeira série para começar.</Text></View>}
      renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: '/detalhe', params: { id: String(item.id) } })} className={`mb-3 rounded-2xl border p-4 ${item.concluida ? 'border-neutral-800 bg-neutral-900/60' : 'border-neutral-800 bg-neutral-900'}`}>
        <View className="flex-row items-start justify-between"><Text className={`mr-3 flex-1 text-lg font-bold ${item.concluida ? 'text-neutral-400 line-through' : 'text-white'}`}>{item.titulo}</Text><Text className={`rounded-full px-2 py-1 text-[10px] font-bold ${item.concluida ? 'bg-blue-950 text-blue-300' : 'bg-emerald-950 text-emerald-300'}`}>{item.concluida ? 'CONCLUÍDA' : 'ASSISTINDO'}</Text></View>
        <Text className="mt-2 text-sm text-neutral-400">{item.plataforma} · {item.temporadas} temporadas</Text>
        <Text className="mt-2 text-sm font-semibold text-amber-300">{item.nota === null ? 'Sem nota' : `${'★'.repeat(item.nota)}${'☆'.repeat(5 - item.nota)} · ${item.nota}/5`}</Text>
      </Pressable>}
    />}
    <Pressable onPress={() => router.push('/form')} className="mb-4 items-center rounded-2xl bg-emerald-400 py-4"><Text className="font-extrabold text-neutral-950">+ Nova série</Text></Pressable>
  </View>;
}
