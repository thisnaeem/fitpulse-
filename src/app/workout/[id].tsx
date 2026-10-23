import React from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, PrimaryButton } from '../../ui';
import { Icon } from '../../icons';
import { workoutById } from '../../data';
import { useFit } from '../../store';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const fit = useFit();
  const w = workoutById(id || '');
  const fav = fit.favorites.includes(w.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <FlatList
        data={w.exercises}
        keyExtractor={(e, i) => e.name + i}
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <LinearGradient colors={[w.tint, w.tint + 'A6']} style={{ padding: 20, paddingTop: 14, borderBottomLeftRadius: R.xl, borderBottomRightRadius: R.xl }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable onPress={() => router.back()} hitSlop={10} style={hdrBtn}><Icon name="left" size={21} color="#FFF" /></Pressable>
                <Pressable onPress={() => fit.toggleFavorite(w.id)} hitSlop={10} style={hdrBtn}>
                  <Icon name="fav" size={20} color={fav ? '#FF2E63' : '#FFF'} />
                </Pressable>
              </View>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Icon name={w.icon} size={64} color="#FFF" strokeWidth={1.3} />
              </View>
              <Tx size={27} w="xbold" color="#FFF" style={{ textAlign: 'center', marginTop: 12 }}>{w.title}</Tx>
              <Tx size={13.5} w="semi" color="#FFFFFFD9" style={{ textAlign: 'center', marginTop: 6, lineHeight: 19, paddingHorizontal: 12 }}>{w.desc}</Tx>
              <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 16 }}>
                {[
                  { ic: 'clock' as const, t: `${w.minutes} min` },
                  { ic: 'fire' as const, t: `${w.kcal} kcal` },
                  { ic: 'chart' as const, t: w.level },
                ].map((m, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#0000002E', borderRadius: R.pill, paddingHorizontal: 12, paddingVertical: 6 }}>
                    <Icon name={m.ic} size={14} color="#FFF" /><Tx size={12.5} w="bold" color="#FFF">{m.t}</Tx>
                  </View>
                ))}
              </View>
            </LinearGradient>
            <Tx size={17} w="xbold" style={{ paddingHorizontal: 20, marginTop: 22, marginBottom: 6 }}>Exercises ({w.exercises.length})</Tx>
          </View>
        }
        renderItem={({ item, index }) => (
          <View style={{ flexDirection: 'row', gap: 13, paddingHorizontal: 20, paddingVertical: 11, alignItems: 'flex-start' }}>
            <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
              <Tx size={13} w="xbold" color={w.tint}>{index + 1}</Tx>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tx size={15.5} w="bold">{item.name}</Tx>
                <Tx size={13} w="bold" color={w.tint}>{item.detail}</Tx>
              </View>
              <Tx dim size={12.5} style={{ marginTop: 2 }}>{item.muscle} · {item.tip}</Tx>
            </View>
          </View>
        )}
      />
      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 22 }}>
        <PrimaryButton label="Workout shuru karo" icon="play" onPress={() => router.push(`/player/${w.id}`)} />
      </View>
    </SafeAreaView>
  );
}

const hdrBtn = { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0000002E', alignItems: 'center', justifyContent: 'center' } as const;
