import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, GlassCircleBtn } from '../../ui';
import { Icon, type IconName } from '../../icons';
import { workoutById } from '../../data';
import { workoutImage } from '../../workoutImages';
import { useFit } from '../../store';
import { sounds } from '../../sound';

export default function WorkoutDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const fit = useFit();
  const insets = useSafeAreaInsets();
  const w = workoutById(id || '');
  const fav = fit.favorites.includes(w.id);
  const img = workoutImage(w.id);

  const stats: { icon: IconName; value: string; label: string }[] = [
    { icon: 'clock', value: String(w.minutes), label: 'MINUTES' },
    { icon: 'fire', value: String(w.kcal), label: 'KCAL' },
    { icon: 'dumbbell', value: String(w.exercises.length), label: 'EXERCISES' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 118 }} showsVerticalScrollIndicator={false}>
        {/* Full-bleed photo hero */}
        <View style={{ height: 320, backgroundColor: C.card }}>
          {img ? <Image source={img} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" /> : null}
          <LinearGradient colors={['rgba(7,9,11,0.35)', 'rgba(7,9,11,0)', 'rgba(7,9,11,0.55)']}
            locations={[0, 0.35, 1]} style={{ position: 'absolute', width: '100%', height: '100%' }} />
          {!img ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={w.icon} size={84} color="#FFF" strokeWidth={1.2} />
            </View>
          ) : null}
          <View style={{
            position: 'absolute', left: 20, right: 20, top: insets.top + 10,
            flexDirection: 'row', justifyContent: 'space-between',
          }}>
            <GlassCircleBtn icon="left" onPress={() => router.back()} />
            <GlassCircleBtn icon="fav" iconColor={fav ? '#FF5E8A' : '#FFF'} onPress={() => fit.toggleFavorite(w.id)} />
          </View>
          <View style={{ position: 'absolute', left: 20, bottom: 44 }}>
            <View style={{
              alignSelf: 'flex-start', backgroundColor: C.glassDark, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
              borderRadius: R.pill, paddingHorizontal: 11, paddingVertical: 5,
            }}>
              <Tx size={11.5} w="bold" color="#FFF">{w.level.toUpperCase()} · {w.focus.toUpperCase()}</Tx>
            </View>
          </View>
        </View>

        {/* Sheet overlapping the hero */}
        <View style={{
          marginTop: -28, backgroundColor: C.sheet, borderTopLeftRadius: R.xl, borderTopRightRadius: R.xl,
          paddingHorizontal: 20, paddingTop: 22,
        }}>
          <Tx size={29} w="xbold" style={{ lineHeight: 34 }}>{w.title}</Tx>
          <Tx dim size={14} style={{ marginTop: 8, lineHeight: 21 }}>{w.desc}</Tx>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            {stats.map(s => (
              <View key={s.label} style={{
                flex: 1, alignItems: 'center', paddingVertical: 14,
                backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.lg,
              }}>
                <Icon name={s.icon} size={19} color={C.lime} />
                <Tx size={24} w="xbold" style={{ marginTop: 6 }}>{s.value}</Tx>
                <Tx dim size={10.5} w="semi" style={{ marginTop: 1 }}>{s.label}</Tx>
              </View>
            ))}
          </View>

          <Tx size={18} w="xbold" style={{ marginTop: 26, marginBottom: 6 }}>Exercises ({w.exercises.length})</Tx>
          {w.exercises.map((item, index) => (
            <View key={item.name + index} style={{ flexDirection: 'row', gap: 13, paddingVertical: 11, alignItems: 'flex-start' }}>
              <View style={{
                width: 36, height: 36, borderRadius: 12, marginTop: 1, alignItems: 'center', justifyContent: 'center',
                backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder,
              }}>
                <Tx size={13.5} w="xbold" color={C.lime}>{index + 1}</Tx>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Tx size={15.5} w="bold">{item.name}</Tx>
                  <Tx size={13} w="bold" color={C.lime}>{item.detail}</Tx>
                </View>
                <Tx dim size={12.5} style={{ marginTop: 2, lineHeight: 17 }}>{item.muscle} · {item.tip}</Tx>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(22, insets.bottom + 12) }}>
        <Pressable onPress={() => { sounds.tap(); router.push(`/player/${w.id}`); }}>
          <LinearGradient colors={[C.lime2, C.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={{ height: 58, borderRadius: R.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Icon name="play" size={20} color={C.ink} strokeWidth={2.2} />
            <Tx size={16.5} w="xbold" color={C.ink}>Start workout</Tx>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}
