import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Polyline, Polygon, Circle as SvgCircle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, Card, NumField, PrimaryButton, Ring, SectionHead } from '../../ui';
import { Icon } from '../../icons';
import { useFit, localDateKey, type Session } from '../../store';
import { ACHIEVEMENTS } from '../../data';
import { levelFromXp, achievementValue, isAchievementUnlocked, type GameStats } from '../../game';

function minutesByDay(sessions: Session[], daysBack: number) {
  const out: { key: string; label: string; minutes: number; isToday: boolean }[] = [];
  for (let i = daysBack - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    const minutes = sessions
      .filter(s => localDateKey(new Date(s.date)) === key)
      .reduce((sum, s) => sum + s.minutes, 0);
    out.push({
      key,
      label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      minutes,
      isToday: i === 0,
    });
  }
  return out;
}

export default function Progress() {
  const fit = useFit();
  const router = useRouter();
  const [newWeight, setNewWeight] = useState('');
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const lvl = levelFromXp(fit.xp);
  const stats: GameStats = useMemo(() => ({
    doneWorkouts: fit.doneWorkouts,
    streakDays: fit.streakDays,
    xp: fit.xp,
    weightsCount: fit.weights.length,
    challengeDays: fit.challenge.length,
  }), [fit.doneWorkouts, fit.streakDays, fit.xp, fit.weights.length, fit.challenge.length]);
  const unlockedCount = ACHIEVEMENTS.filter(a => isAchievementUnlocked(a, stats)).length;

  const week = useMemo(() => minutesByDay(fit.sessions, 7), [fit.sessions]);
  const weekMax = Math.max(10, ...week.map(d => d.minutes));

  const estKcal = Math.round(fit.totalMinutes * 7);

  const ws = fit.weights;
  const min = Math.min(...ws) - 0.6, max = Math.max(...ws) + 0.6;
  const linePts = ws.map((v, i) => `${(i / Math.max(1, ws.length - 1)) * 300},${64 - ((v - min) / (max - min)) * 56}`).join(' ');
  const areaPts = ws.length > 1 ? `0,72 ${linePts} 300,72` : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        <Tx size={29} w="xbold">Progress</Tx>
        <Tx dim size={14} style={{ marginTop: 5 }}>Your hard work, in real numbers</Tx>

        {/* Level card — big ring + oversized XP */}
        <View style={{
          marginTop: 18, padding: 20, borderRadius: R.xl, flexDirection: 'row', alignItems: 'center', gap: 18,
          backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder,
        }}>
          <Ring size={112} stroke={11} progress={lvl.progress} glow>
            <Tx size={34} w="xbold">{lvl.level}</Tx>
            <Tx dim size={10} w="semi">LEVEL</Tx>
          </Ring>
          <View style={{ flex: 1 }}>
            <Tx size={12} w="xbold" color={C.lime}>{lvl.title.toUpperCase()}</Tx>
            <Tx size={38} w="xbold" style={{ marginTop: 2 }}>{fit.xp}<Tx size={16} dim> XP</Tx></Tx>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: C.ringTrack, marginTop: 10, overflow: 'hidden' }}>
              <LinearGradient colors={[C.lime2, C.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ width: `${lvl.progress * 100}%`, height: 8, borderRadius: 4 }} />
            </View>
            <Tx dim size={12} style={{ marginTop: 7 }}>{lvl.into} / {lvl.needed} XP — {lvl.needed - lvl.into} to Level {lvl.level + 1}</Tx>
          </View>
        </View>

        {/* Streak + badges */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <View style={{
            flex: 1.15, padding: 16, borderRadius: R.lg,
            backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <Icon name="flame" size={19} color={C.amber} />
              <Tx size={12} w="xbold" color={C.amber}>STREAK</Tx>
            </View>
            <Tx size={38} w="xbold" style={{ marginTop: 6 }}>{fit.streakDays} <Tx size={15} dim>day{fit.streakDays === 1 ? '' : 's'}</Tx></Tx>
            <Tx dim size={12} style={{ marginTop: 3 }}>{fit.streakDays > 0 ? 'Keep the fire alive — train today!' : 'Finish a workout to start your streak.'}</Tx>
          </View>
          <Card style={{ flex: 1, justifyContent: 'center' }}>
            <Tx size={32} w="xbold">{unlockedCount}<Tx size={15} dim>/{ACHIEVEMENTS.length}</Tx></Tx>
            <Tx dim size={11.5} w="semi" style={{ marginTop: 2 }}>BADGES UNLOCKED</Tx>
          </Card>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
            <Tx size={32} w="xbold">{fit.doneWorkouts}</Tx><Tx dim size={11.5} w="semi" style={{ marginTop: 3 }}>WORKOUTS</Tx>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
            <Tx size={32} w="xbold">{fit.totalMinutes}</Tx><Tx dim size={11.5} w="semi" style={{ marginTop: 3 }}>MINUTES</Tx>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
            <Tx size={32} w="xbold">{estKcal}</Tx><Tx dim size={11.5} w="semi" style={{ marginTop: 3 }}>EST. KCAL</Tx>
          </Card>
        </View>

        {/* Last 7 days */}
        <SectionHead title="Last 7 days" />
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 142 }}>
            {week.map(d => (
              <View key={d.key} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <Tx size={11.5} w="bold" color={d.isToday ? C.lime : C.muted}>{d.minutes > 0 ? d.minutes : ''}</Tx>
                <View style={{
                  width: 26, marginTop: 5,
                  borderTopLeftRadius: 9, borderTopRightRadius: 9, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
                  height: Math.max(5, (d.minutes / weekMax) * 92),
                  backgroundColor: d.minutes === 0 ? C.ringTrack : d.isToday ? C.lime : C.lime + '66',
                }} />
                <Tx size={11} w={d.isToday ? 'bold' : 'semi'} color={d.isToday ? C.lime : C.faint} style={{ marginTop: 7 }}>{d.label}</Tx>
              </View>
            ))}
          </View>
          <Tx dim size={12} style={{ marginTop: 10 }}>Minutes trained per day. Today is highlighted — make it count.</Tx>
        </Card>

        {/* Weight journey */}
        <SectionHead title="Weight journey" />
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Tx size={15} w="bold">{ws[ws.length - 1]} kg <Tx dim size={12.5}>current</Tx></Tx>
            <Tx size={12.5} w="semi" color={ws[ws.length - 1] <= ws[0] ? C.lime : C.muted}>
              total: {(ws[ws.length - 1] - ws[0]).toFixed(1)} kg
            </Tx>
          </View>
          <Svg width="100%" height={76} viewBox="0 0 300 72" style={{ marginTop: 10 }}>
            {areaPts ? <Polygon points={areaPts} fill={C.lime} opacity={0.08} /> : null}
            <Polyline points={linePts} fill="none" stroke={C.lime} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
            {ws.map((v, i) => (
              <SvgCircle key={i} cx={(i / Math.max(1, ws.length - 1)) * 300} cy={64 - ((v - min) / (max - min)) * 56} r={4} fill={C.bg} stroke={C.lime} strokeWidth={2.5} />
            ))}
          </Svg>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Tx dim size={11}>start {ws[0]} kg</Tx>
            <Tx dim size={11}>{ws.length} entries</Tx>
          </View>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 14, alignItems: 'flex-end' }}>
            <NumField label="New weight" value={newWeight} onChange={setNewWeight} unit="kg" />
            <View style={{ flex: 1.2 }}>
              <PrimaryButton label="Add" icon="plus" onPress={() => {
                const v = parseFloat(newWeight);
                if (!isNaN(v) && v > 20 && v < 400) { fit.addWeight(v); setNewWeight(''); }
              }} />
            </View>
          </View>
        </Card>

        {/* Achievements grid */}
        <SectionHead title="Achievements" action={`${unlockedCount}/${ACHIEVEMENTS.length}`} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {ACHIEVEMENTS.map(a => {
            const value = achievementValue(a, stats);
            const got = isAchievementUnlocked(a, stats);
            return (
              <View key={a.id} style={{
                width: '48.5%', padding: 14, borderRadius: R.lg,
                backgroundColor: got ? '#FFB02014' : C.glass, borderWidth: 1, borderColor: got ? '#FFB02055' : C.glassBorder,
                opacity: got ? 1 : 0.85,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <Icon name={a.icon} size={28} color={got ? C.amber : C.faint} />
                  {got
                    ? <Icon name="check" size={17} color={C.lime} strokeWidth={2.4} />
                    : <Tx size={11} w="bold" dim>{value}/{a.need}</Tx>}
                </View>
                <Tx size={13.5} w="bold" style={{ marginTop: 9 }}>{a.title}</Tx>
                <Tx dim size={11.5} style={{ marginTop: 3, lineHeight: 16 }}>{a.desc}</Tx>
                {!got ? (
                  <View style={{ height: 5, borderRadius: 3, backgroundColor: C.ringTrack, marginTop: 10, overflow: 'hidden' }}>
                    <View style={{ width: `${Math.min(100, (value / a.need) * 100)}%`, height: 5, backgroundColor: C.lime, borderRadius: 3 }} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        {/* 30-day challenge */}
        <SectionHead title="30-Day Challenge" action={`${fit.challenge.length}/30`} />
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {days.map(d => {
              const on = fit.challenge.includes(d);
              return (
                <Pressable key={d} onPress={() => fit.toggleChallengeDay(d)} style={{
                  width: '15.5%', aspectRatio: 1, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: on ? C.lime : C.glass, borderWidth: 1, borderColor: on ? C.lime : C.glassBorder,
                }}>
                  {on ? <Icon name="check" size={17} color={C.ink} strokeWidth={2.6} />
                      : <Tx size={13} w="bold" dim>{d}</Tx>}
                </Pressable>
              );
            })}
          </View>
          <Tx dim size={12.5} style={{ marginTop: 12 }}>Train every day and mark it off — don't break the 30-day chain!</Tx>
        </Card>

        {/* Recent sessions */}
        <SectionHead title="Recent workouts" />
        {fit.sessions.length === 0 ? (
          <Card><Tx dim size={13.5}>No workouts completed yet. Finish your first one today!</Tx></Card>
        ) : fit.sessions.slice(0, 8).map((s, i) => (
          <Pressable key={i} onPress={() => router.push(`/workout/${s.workoutId}`)}>
            <Card style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
              <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="check" size={20} color={C.lime} />
              </View>
              <View style={{ flex: 1 }}>
                <Tx size={14.5} w="bold">{s.title}</Tx>
                <Tx dim size={12}>{new Date(s.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {s.minutes} min · {s.kcal} kcal</Tx>
              </View>
              <Icon name="chevron" size={18} color={C.faint} />
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
