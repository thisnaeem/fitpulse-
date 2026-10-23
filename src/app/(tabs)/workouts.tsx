import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../theme';
import { Tx, Chip, Field, WorkoutCard } from '../../ui';
import { Icon } from '../../icons';
import { useFit } from '../../store';
import { LEVELS, WORKOUTS } from '../../data';

export default function Workouts() {
  const router = useRouter();
  const fit = useFit();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');
  const [query, setQuery] = useState('');
  const [favOnly, setFavOnly] = useState(false);

  const list = useMemo(() => WORKOUTS.filter(w =>
    (level === 'All' || w.level === level) &&
    (!favOnly || fit.favorites.includes(w.id)) &&
    (query.trim() === '' || (w.title + ' ' + w.focus).toLowerCase().includes(query.trim().toLowerCase()))
  ), [level, query, favOnly, fit.favorites]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <FlatList
        data={list}
        keyExtractor={w => w.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 26 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Tx size={27} w="xbold">Workouts</Tx>
            <Tx dim size={14} style={{ marginTop: 5 }}>{WORKOUTS.length} guided programs — sab ghar par, bina equipment</Tx>
            <View style={{ marginTop: 16 }}>
              <Field icon="search" placeholder="Workout dhoondo…" value={query} onChangeText={setQuery} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                {LEVELS.map(l => <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} />)}
              </View>
              <Pressable onPress={() => setFavOnly(!favOnly)} style={{
                width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
                backgroundColor: favOnly ? '#FF5E8A' : C.card, borderWidth: 1, borderColor: favOnly ? '#FF5E8A' : C.border,
              }}>
                <Icon name="fav" size={18} color={favOnly ? '#FFF' : C.muted} />
              </Pressable>
            </View>
          </View>
        }
        ListEmptyComponent={<Tx dim size={14} style={{ textAlign: 'center', marginTop: 36 }}>Koi workout nahi mila — filter badal kar dekho.</Tx>}
        renderItem={({ item }) => (
          <WorkoutCard w={item} onPress={() => router.push(`/workout/${item.id}`)}
            fav={fit.favorites.includes(item.id)} onFav={() => fit.toggleFavorite(item.id)} />
        )}
      />
    </SafeAreaView>
  );
}
