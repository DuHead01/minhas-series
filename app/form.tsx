import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { createSerie, getSerieById, updateSerie } from '../src/database/serieRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const serieId = id ? Number(id) : null;
  const [titulo, setTitulo] = useState('');
  const [plataforma, setPlataforma] = useState('');
  const [temporadas, setTemporadas] = useState('0');
  const [nota, setNota] = useState<number | null>(null);
  const [loading, setLoading] = useState(Boolean(serieId));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    if (!serieId) return () => { active = false; };
    void getSerieById(serieId).then((serie) => {
      if (!active) return;
      if (!serie) { Alert.alert('Série não encontrada'); router.back(); return; }
      setTitulo(serie.titulo); setPlataforma(serie.plataforma); setTemporadas(String(serie.temporadas)); setNota(serie.nota);
    }).catch(() => { if (active) Alert.alert('Erro', 'Não foi possível carregar a série.'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [serieId]);

  async function save() {
    const seasonCount = Number(temporadas);
    if (!titulo.trim() || !plataforma.trim()) { Alert.alert('Campos obrigatórios', 'Informe o título e a plataforma.'); return; }
    if (temporadas.trim() === '' || !Number.isInteger(seasonCount) || seasonCount < 0) { Alert.alert('Temporadas inválidas', 'Informe um número inteiro igual ou maior que zero.'); return; }
    setSaving(true);
    try {
      const input = { titulo: titulo.trim(), plataforma: plataforma.trim(), temporadas: seasonCount, nota };
      if (serieId) await updateSerie(serieId, input); else await createSerie(input);
      router.back();
    } catch { Alert.alert('Erro', 'Não foi possível salvar a série.'); }
    finally { setSaving(false); }
  }

  const inputClass = 'rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-4 text-base text-white';
  if (loading) return <View className="flex-1 items-center justify-center bg-neutral-950"><Text className="text-neutral-300">Carregando série...</Text></View>;

  return <ScrollView className="flex-1 bg-neutral-950" contentContainerClassName="px-5 pb-10 pt-6">
    <Text className="mb-1 text-2xl font-extrabold text-white">{serieId ? 'Editar série' : 'Nova série'}</Text>
    <Text className="mb-6 text-neutral-400">Preencha os detalhes da sua série.</Text>
    <Text className="mb-2 font-semibold text-neutral-200">Título</Text>
    <TextInput value={titulo} onChangeText={setTitulo} placeholder="Ex.: The Bear" placeholderTextColor="#737373" className={`${inputClass} mb-5`} />
    <Text className="mb-2 font-semibold text-neutral-200">Plataforma</Text>
    <TextInput value={plataforma} onChangeText={setPlataforma} placeholder="Ex.: Disney+" placeholderTextColor="#737373" className={`${inputClass} mb-5`} />
    <Text className="mb-2 font-semibold text-neutral-200">Temporadas assistidas</Text>
    <TextInput value={temporadas} onChangeText={setTemporadas} keyboardType="numeric" placeholder="0" placeholderTextColor="#737373" className={`${inputClass} mb-5`} />
    <Text className="mb-2 font-semibold text-neutral-200">Sua nota</Text>
    <View className="mb-8 flex-row items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => <Pressable key={value} onPress={() => setNota(nota === value ? null : value)} className={`h-12 flex-1 items-center justify-center rounded-xl ${nota !== null && value <= nota ? 'bg-amber-400' : 'bg-neutral-900'}`}><Text className={`text-xl ${nota !== null && value <= nota ? 'text-neutral-950' : 'text-neutral-500'}`}>★</Text></Pressable>)}
      {nota !== null ? <Pressable onPress={() => setNota(null)} className="px-2"><Text className="text-xs text-neutral-400">Limpar</Text></Pressable> : null}
    </View>
    <Pressable disabled={saving} onPress={() => void save()} className="items-center rounded-2xl bg-emerald-400 py-4"><Text className="font-extrabold text-neutral-950">{saving ? 'Salvando...' : 'Salvar série'}</Text></Pressable>
  </ScrollView>;
}
