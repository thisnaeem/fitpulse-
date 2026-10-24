import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, Chip, Field, WorkoutBanner } from '../../ui';
import { Icon } from '../../icons';
import { useFit } from '../../store';
import { LEVELS, WORKOUTS } from '../../data';

export default function Workouts() {
  const router = useRouter();
  const fit = useFit();
  const params = useLocalSearchParams<{ focus?: string }>();
  const [level, setLevel] = useState<(typeof LEVELS)[number]>('All');
  const [query, setQuery] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  // Category tiles on Home deep-link here with a focus filter. The route
  // param is the default; a local override (clearing the filter) wins
  // until a different param arrives.
  const [focusOverride, setFocusOverride] = useState<{ forParam?: string; value: string } | null>(null);
  const focus = focusOverride && focusOverride.forParam === params.focus
    ? focusOverride.value
    : (params.focus ?? 'All');
  const clearFocus = () => setFocusOverride({ forParam: params.focus, value: 'All' });

  const list = useMemo(() => WORKOUTS.filter(w =>
    (level === 'All' || w.level === level) &&
    (focus === 'All' || w.focus === focus) &&
    (!favOnly || fit.favorites.includes(w.id)) &&
    (query.trim() === '' || (w.title + ' ' + w.focus).toLowerCase().includes(query.trim().toLowerCase()))
  ), [level, focus, query, favOnly, fit.favorites]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <FlatList
        data={list}
        keyExtractor={w => w.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <Tx size={29} w="xbold">Workouts</Tx>
            <Tx dim size={14} style={{ marginTop: 5 }}>{WORKOUTS.length} guided programs — all at home, no equipment</Tx>
            <View style={{ marginTop: 16 }}>
              <Field pill icon="search" placeholder="Search workouts…" value={query} onChangeText={setQuery} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                {LEVELS.map(l => <Chip key={l} label={l} selected={level === l} onPress={() => setLevel(l)} />)}
              </ScrollView>
              <Pressable onPress={() => setFavOnly(!favOnly)} style={{
                width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginLeft: 4,
                backgroundColor: favOnly ? '#FF5E8A' : C.glass, borderWidth: 1, borderColor: favOnly ? '#FF5E8A' : C.glassBorder,
              }}>
                <Icon name="fav" size={18} color={favOnly ? '#FFF' : C.muted} />
              </Pressable>
            </View>
            {focus !== 'All' ? (
              <Pressable onPress={clearFocus} style={{
                alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 12,
                borderWidth: 1, borderColor: C.lime, borderRadius: R.pill, paddingHorizontal: 13, paddingVertical: 7,
              }}>
                <Tx size={12.5} w="bold" color={C.lime}>Category: {focus}</Tx>
                <Tx size={12.5} w="semi" color={C.lime} style={{ opacity: 0.75 }}>Clear</Tx>
              </Pressable>
            ) : null}
            <View style={{ height: 18 }} />
          </View>
        }
        ListEmptyComponent={<Tx dim size={14} style={{ textAlign: 'center', marginTop: 36 }}>No workouts found — try a different filter.</Tx>}
        renderItem={({ item }) => (
          <WorkoutBanner w={item} onPress={() => router.push(`/workout/${item.id}`)}
            fav={fit.favorites.includes(item.id)} onFav={() => fit.toggleFavorite(item.id)} />
        )}
      />
    </SafeAreaView>
  );
}
