import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, Card, Ring, WorkoutCard, SectionHead } from '../../ui';
import { Icon } from '../../icons';
import { useFit } from '../../store';
import { ACHIEVEMENTS, WEEK_PLAN, todayWorkout, workoutById } from '../../data';
import { AdBanner } from '../../ads';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Subah bakhair';
  if (h < 17) return 'Assalam-o-Alaikum';
  if (h < 21) return 'Shaam bakhair';
  return 'Shab bakhair';
}

export default function Home() {
  const fit = useFit();
  const router = useRouter();
  const today = todayWorkout();
  const name = fit.profile.name?.split(' ')[0] || 'Champion';
  const pct = Math.min(1, fit.waterToday / fit.waterGoal);
  const nextBadge = ACHIEVEMENTS.find(a => fit.doneWorkouts < a.need);
  const weekIdx = (new Date().getDay() + 6) % 7;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Tx dim size={13.5} w="semi">{greeting()},</Tx>
            <Tx size={24} w="xbold" style={{ marginTop: 2 }}>{name}</Tx>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2A1E05', borderWidth: 1, borderColor: '#4A3608', paddingHorizontal: 12, paddingVertical: 7, borderRadius: R.pill }}>
            <Icon name="flame" size={17} color={C.amber} />
            <Tx size={13.5} w="bold" color={C.amber}>{fit.doneWorkouts} done</Tx>
          </View>
        </View>

        <Pressable onPress={() => router.push(`/workout/${today.id}`)}>
          <LinearGradient colors={[today.tint, today.tint + 'B3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: R.xl, padding: 20, marginTop: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Tx size={12} w="xbold" color="#00000099">AAJ KA WORKOUT</Tx>
              <View style={{ backgroundColor: '#00000030', borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Tx size={11.5} w="bold" color="#FFF">{today.level}</Tx>
              </View>
            </View>
            <Tx size={26} w="xbold" color="#FFF" style={{ marginTop: 12 }}>{today.title}</Tx>
            <Tx size={13.5} w="semi" color="#FFFFFFD9" style={{ marginTop: 5 }}>{today.focus} · {today.exercises.length} exercises</Tx>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="clock" size={16} color="#FFF" /><Tx size={13} w="bold" color="#FFF">{today.minutes} min</Tx>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="fire" size={16} color="#FFF" /><Tx size={13} w="bold" color="#FFF">{today.kcal} kcal</Tx>
              </View>
              <View style={{ marginLeft: 'auto', backgroundColor: '#FFF', borderRadius: R.pill, paddingHorizontal: 16, paddingVertical: 9, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="play" size={15} color={C.ink} /><Tx size={13.5} w="xbold" color={C.ink}>START</Tx>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
            <Ring size={104} stroke={10} progress={pct}>
              <Tx size={19} w="xbold">{fit.waterToday}<Tx size={12} dim>/{fit.waterGoal}</Tx></Tx>
              <Tx dim size={10.5} w="semi">glasses</Tx>
            </Ring>
            <Tx size={13} w="bold" style={{ marginTop: 10 }}>Paani ka goal</Tx>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Pressable onPress={() => fit.setWaterToday(fit.waterToday - 1)} style={stepBtn}><Icon name="minus" size={16} color={C.text} /></Pressable>
              <Pressable onPress={() => fit.setWaterToday(fit.waterToday + 1)} style={[stepBtn, { backgroundColor: C.lime }]}><Icon name="plus" size={16} color={C.ink} /></Pressable>
            </View>
          </Card>
          <View style={{ flex: 1, gap: 12 }}>
            <Card style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="weight" size={19} color={C.blue} />
                <Tx dim size={12} w="semi">AAJ KA WAZAN</Tx>
              </View>
              <Tx size={23} w="xbold" style={{ marginTop: 6 }}>{fit.weights[fit.weights.length - 1]} kg</Tx>
              <Tx size={12} w="semi" color={fit.weights.length > 1 && fit.weights[fit.weights.length - 1] <= fit.weights[0] ? C.lime : C.muted}>
                shuru se {fit.weights.length > 1 ? (fit.weights[fit.weights.length - 1] - fit.weights[0]).toFixed(1) : '0.0'} kg
              </Tx>
            </Card>
            <Card style={{ flex: 1, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Icon name="target" size={19} color={C.violet} />
                <Tx dim size={12} w="semi">30-DAY CHALLENGE</Tx>
              </View>
              <Tx size={23} w="xbold" style={{ marginTop: 6 }}>{fit.challenge.length}/30 din</Tx>
              <View style={{ height: 7, borderRadius: 4, backgroundColor: C.ringTrack, marginTop: 8, overflow: 'hidden' }}>
                <View style={{ width: `${(fit.challenge.length / 30) * 100}%`, height: 7, backgroundColor: C.violet, borderRadius: 4 }} />
              </View>
            </Card>
          </View>
        </View>

        {nextBadge ? (
          <Card style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center', gap: 13 }}>
            <LinearGradient colors={['#FFB02033', '#FFB0200D']} style={{ width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={nextBadge.icon} size={25} color={C.amber} />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Tx size={14.5} w="bold">Agla badge: {nextBadge.title}</Tx>
              <Tx dim size={12.5} style={{ marginTop: 2 }}>Sirf {nextBadge.need - fit.doneWorkouts} workout aur — {nextBadge.desc.toLowerCase()}</Tx>
            </View>
          </Card>
        ) : null}

        <SectionHead title="Is haftay ka plan" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {WEEK_PLAN.map((d, i) => {
            const w = workoutById(d.workoutId);
            const isToday = i === weekIdx;
            return (
              <Pressable key={d.day} onPress={() => router.push(`/workout/${w.id}`)} style={{
                flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: R.md,
                backgroundColor: isToday ? C.lime : C.card, borderWidth: 1, borderColor: isToday ? C.lime : C.border,
              }}>
                <Tx size={11} w="bold" color={isToday ? C.ink : C.muted}>{d.day}</Tx>
                <View style={{ marginTop: 7 }}><Icon name={w.icon} size={19} color={isToday ? C.ink : w.tint} /></View>
              </Pressable>
            );
          })}
        </View>

        <SectionHead title="Popular workouts" action="Sab dekho" onAction={() => router.push('/(tabs)/workouts')} />
        {['hiit', 'chest', 'yoga'].map(id => {
          const w = workoutById(id);
          return <WorkoutCard key={id} w={w} onPress={() => router.push(`/workout/${w.id}`)}
            fav={fit.favorites.includes(id)} onFav={() => fit.toggleFavorite(id)} />;
        })}

        <AdBanner style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const stepBtn = { width: 34, height: 34, borderRadius: 17, backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' } as const;
