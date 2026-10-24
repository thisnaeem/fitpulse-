import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, Ring, SectionHead, PopularCard } from '../../ui';
import { Icon, type IconName } from '../../icons';
import { useFit } from '../../store';
import { ACHIEVEMENTS, WEEK_PLAN, todayWorkout, workoutById } from '../../data';
import { levelFromXp, achievementValue, isAchievementUnlocked, type GameStats } from '../../game';
import { workoutImage } from '../../workoutImages';
import { PROMO } from '../../promoImages';
import { AdBanner } from '../../ads';
import { sounds } from '../../sound';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

const CATEGORIES: { label: string; icon: IconName; focus: string }[] = [
  { label: 'All', icon: 'sparkles', focus: 'All' },
  { label: 'Strength', icon: 'muscle', focus: 'Strength' },
  { label: 'Cardio', icon: 'heart', focus: 'Cardio' },
  { label: 'Flexibility', icon: 'yoga', focus: 'Flexibility' },
  { label: 'Quick', icon: 'timer', focus: 'Quick' },
];

const POPULAR = ['hiit', 'chest', 'strength', 'yoga', 'cardio'];

export default function Home() {
  const fit = useFit();
  const router = useRouter();
  const today = todayWorkout();
  const name = fit.profile.name?.split(' ')[0] || 'Athlete';
  const pct = Math.min(1, fit.waterToday / fit.waterGoal);
  const lvl = levelFromXp(fit.xp);
  const stats: GameStats = {
    doneWorkouts: fit.doneWorkouts, streakDays: fit.streakDays, xp: fit.xp,
    weightsCount: fit.weights.length, challengeDays: fit.challenge.length,
  };
  const nextBadge = ACHIEVEMENTS.find(a => !isAchievementUnlocked(a, stats));
  const weekIdx = (new Date().getDay() + 6) % 7;
  const lastWeight = fit.weights[fit.weights.length - 1];
  const weightDelta = fit.weights.length > 1 ? lastWeight - fit.weights[0] : 0;

  const goWorkouts = (focus?: string) =>
    router.push({ pathname: '/(tabs)/workouts', params: focus ? { focus } : {} });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        {/* Header — "Hi, Name" + round avatar (ref-c) */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Tx dim size={13} w="semi">{greeting()}</Tx>
            <Tx size={26} w="xbold" style={{ marginTop: 2 }}>Hi, {name}</Tx>
          </View>
          <Pressable onPress={() => router.push('/(tabs)/profile')}>
            <LinearGradient colors={[C.lime2, C.lime]} style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
              <Tx size={19} w="xbold" color={C.ink}>{name.charAt(0).toUpperCase()}</Tx>
            </LinearGradient>
          </Pressable>
        </View>

        {/* Search bar — opens the Workouts tab */}
        <Pressable onPress={() => goWorkouts()} style={{
          flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18, height: 52,
          backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.pill, paddingHorizontal: 18,
        }}>
          <Icon name="search" size={19} color={C.faint} />
          <Tx dim size={14} style={{ flex: 1 }}>Search workouts…</Tx>
        </Pressable>

        {/* Solid LIME banner — today's workout (ref-c) */}
        <Pressable onPress={() => router.push(`/workout/${today.id}`)}>
          <LinearGradient colors={[C.lime2, C.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ borderRadius: R.xl, marginTop: 18, height: 172, overflow: 'hidden' }}>
            <Image source={PROMO.banner} resizeMode="cover"
              style={{ position: 'absolute', right: -6, top: 0, bottom: 0, width: 158, height: 172 }} />
            <View style={{ flex: 1, padding: 20, paddingRight: 138 }}>
              <Tx size={11} w="xbold" color="#0C0F1199">TODAY'S WORKOUT</Tx>
              <Tx size={23} w="xbold" color={C.ink} style={{ marginTop: 6, lineHeight: 28 }}>{today.title}</Tx>
              <Tx size={12.5} w="semi" color="#0C0F11B3" style={{ marginTop: 5 }}>
                {today.minutes} min · {today.kcal} kcal · {today.level}
              </Tx>
              <View style={{
                alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14,
                backgroundColor: C.ink, borderRadius: R.pill, paddingHorizontal: 16, paddingVertical: 9,
              }}>
                <Icon name="play" size={14} color={C.lime2} />
                <Tx size={13} w="xbold" color="#FFF">Start now</Tx>
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        {/* Gamification — ONE slim row */}
        <Pressable onPress={() => router.push('/(tabs)/progress')} style={{
          flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14, paddingVertical: 10, paddingHorizontal: 14,
          backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.pill,
        }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' }}>
            <Tx size={13} w="xbold" color={C.ink}>{lvl.level}</Tx>
          </View>
          <Tx size={13.5} w="bold" style={{ flex: 1 }}>Level {lvl.level} · {lvl.title}</Tx>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="flame" size={15} color={C.amber} />
            <Tx size={13} w="bold" color={C.amber}>{fit.streakDays}</Tx>
          </View>
          <View style={{ width: 1, height: 18, backgroundColor: C.glassBorder }} />
          <Tx size={13} w="bold" color={C.lime}>{fit.xp} XP</Tx>
        </Pressable>

        {/* Category tiles (ref-c / ref-d) */}
        <SectionHead title="Categories" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {CATEGORIES.map(cat => (
            <Pressable key={cat.label} onPress={() => goWorkouts(cat.focus)} style={{ flex: 1, alignItems: 'center' }}>
              <View style={{
                width: '100%', aspectRatio: 1, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
                backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder,
              }}>
                <Icon name={cat.icon} size={26} color={C.lime} strokeWidth={1.7} />
              </View>
              <Tx size={11.5} w="semi" dim style={{ marginTop: 7 }}>{cat.label}</Tx>
            </Pressable>
          ))}
        </View>

        {/* Popular workouts — horizontal photo cards (ref-c) */}
        <SectionHead title="Popular Workouts" action="View All" onAction={() => goWorkouts()} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          style={{ marginHorizontal: -20 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
          {POPULAR.map(id => {
            const w = workoutById(id);
            return <PopularCard key={id} w={w} onPress={() => router.push(`/workout/${w.id}`)} />;
          })}
        </ScrollView>

        {/* Water — clean wide glass card */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 26, padding: 18,
          backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.lg,
        }}>
          <Ring size={86} stroke={9} progress={pct} color={C.blue} trackColor={C.glassBorder}>
            <Tx size={17} w="xbold">{fit.waterToday}<Tx size={11} dim>/{fit.waterGoal}</Tx></Tx>
          </Ring>
          <View style={{ flex: 1 }}>
            <Tx size={15} w="bold">Water goal</Tx>
            <Tx dim size={12.5} style={{ marginTop: 3 }}>{Math.round(pct * 100)}% of today's goal</Tx>
            <Tx size={30} w="xbold" style={{ marginTop: 4 }}>{fit.waterToday} <Tx size={14} dim>glasses</Tx></Tx>
          </View>
          <View style={{ gap: 10 }}>
            <Pressable onPress={() => { sounds.tap(); fit.setWaterToday(fit.waterToday - 1); }} style={stepBtn}><Icon name="minus" size={16} color={C.text} /></Pressable>
            <Pressable onPress={() => { sounds.tap(); fit.setWaterToday(fit.waterToday + 1); }} style={[stepBtn, { backgroundColor: C.lime, borderColor: C.lime }]}><Icon name="plus" size={16} color={C.ink} /></Pressable>
          </View>
        </View>

        {/* Weight — clean wide glass card */}
        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12, padding: 18,
          backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.lg,
        }}>
          <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: C.blue + '1F', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="weight" size={22} color={C.blue} />
          </View>
          <View style={{ flex: 1 }}>
            <Tx dim size={11.5} w="semi">TODAY'S WEIGHT</Tx>
            <Tx size={30} w="xbold" style={{ marginTop: 2 }}>{lastWeight} <Tx size={14} dim>kg</Tx></Tx>
          </View>
          <Tx size={12.5} w="semi" color={weightDelta <= 0 ? C.lime : C.muted}>
            {fit.weights.length > 1 ? `${weightDelta.toFixed(1)} kg since start` : 'Log in Progress'}
          </Tx>
        </View>

        {/* 30-day challenge — photo strip header */}
        <Pressable onPress={() => router.push('/(tabs)/progress')}>
          <View style={{ marginTop: 12, borderRadius: R.lg, overflow: 'hidden', backgroundColor: C.card, borderWidth: 1, borderColor: C.border }}>
            {workoutImage('stretch') ? (
              <Image source={workoutImage('stretch')} style={{ width: '100%', height: 76 }} resizeMode="cover" />
            ) : null}
            <View style={{ padding: 18, paddingTop: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <Tx size={15} w="bold">30-Day Challenge</Tx>
                <Tx size={22} w="xbold">{fit.challenge.length}<Tx size={13} dim>/30 days</Tx></Tx>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: C.ringTrack, marginTop: 10, overflow: 'hidden' }}>
                <View style={{ width: `${(fit.challenge.length / 30) * 100}%`, height: 8, backgroundColor: C.lime, borderRadius: 4 }} />
              </View>
            </View>
          </View>
        </Pressable>

        {/* Next badge */}
        {nextBadge ? (
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 12, padding: 16,
            backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.lg,
          }}>
            <View style={{ width: 46, height: 46, borderRadius: 14, backgroundColor: C.amber + '1F', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={nextBadge.icon} size={24} color={C.amber} />
            </View>
            <View style={{ flex: 1 }}>
              <Tx size={14.5} w="bold">Next badge: {nextBadge.title}</Tx>
              <Tx dim size={12.5} style={{ marginTop: 2 }}>
                {nextBadge.kind === 'workouts'
                  ? `Only ${nextBadge.need - achievementValue(nextBadge, stats)} more workout${nextBadge.need - achievementValue(nextBadge, stats) === 1 ? '' : 's'} to go`
                  : nextBadge.desc}
              </Tx>
            </View>
          </View>
        ) : null}

        {/* This week's plan — slim row */}
        <SectionHead title="This week's plan" />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {WEEK_PLAN.map((d, i) => {
            const w = workoutById(d.workoutId);
            const isToday = i === weekIdx;
            return (
              <Pressable key={d.day} onPress={() => router.push(`/workout/${w.id}`)} style={{
                flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: R.md,
                backgroundColor: isToday ? C.lime : C.glass, borderWidth: 1, borderColor: isToday ? C.lime : C.glassBorder,
              }}>
                <Tx size={11} w="bold" color={isToday ? C.ink : C.muted}>{d.day}</Tx>
                <View style={{ marginTop: 7 }}><Icon name={w.icon} size={19} color={isToday ? C.ink : w.tint} /></View>
              </Pressable>
            );
          })}
        </View>

        <AdBanner style={{ marginTop: 22 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const stepBtn = { width: 36, height: 36, borderRadius: 18, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, alignItems: 'center', justifyContent: 'center' } as const;
