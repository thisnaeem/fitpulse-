import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Polyline, Circle as SvgCircle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, Card, NumField, PrimaryButton, SectionHead } from '../../ui';
import { Icon } from '../../icons';
import { useFit } from '../../store';
import { ACHIEVEMENTS } from '../../data';

export default function Progress() {
  const fit = useFit();
  const router = useRouter();
  const [newWeight, setNewWeight] = useState('');
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  const ws = fit.weights;
  const min = Math.min(...ws) - 0.6, max = Math.max(...ws) + 0.6;
  const pts = ws.map((v, i) => `${(i / Math.max(1, ws.length - 1)) * 300},${64 - ((v - min) / (max - min)) * 56}`).join(' ');
  const totalKcal = fit.sessions.reduce((s, x) => s + x.kcal, 0);
  const totalMin = fit.sessions.reduce((s, x) => s + x.minutes, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <Tx size={27} w="xbold">Progress</Tx>
        <Tx dim size={14} style={{ marginTop: 5 }}>Tumhari mehnat, aqaida numbers mein</Tx>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
            <Tx size={24} w="xbold">{fit.doneWorkouts}</Tx><Tx dim size={11.5} w="semi" style={{ marginTop: 2 }}>WORKOUTS</Tx>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
            <Tx size={24} w="xbold">{totalMin}</Tx><Tx dim size={11.5} w="semi" style={{ marginTop: 2 }}>MINUTES</Tx>
          </Card>
          <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
            <Tx size={24} w="xbold">{totalKcal}</Tx><Tx dim size={11.5} w="semi" style={{ marginTop: 2 }}>KCAL BURN</Tx>
          </Card>
        </View>

        <SectionHead title="Wazan ka safar" />
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Tx size={15} w="bold">{ws[ws.length - 1]} kg <Tx dim size={12.5}>abhi</Tx></Tx>
            <Tx size={12.5} w="semi" color={ws[ws.length - 1] <= ws[0] ? C.lime : C.muted}>
              kul: {(ws[ws.length - 1] - ws[0]).toFixed(1)} kg
            </Tx>
          </View>
          <Svg width="100%" height={76} viewBox="0 0 300 72" style={{ marginTop: 10 }}>
            <Polyline points={pts} fill="none" stroke={C.lime} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
            {ws.map((v, i) => (
              <SvgCircle key={i} cx={(i / Math.max(1, ws.length - 1)) * 300} cy={64 - ((v - min) / (max - min)) * 56} r={4} fill={C.bg} stroke={C.lime} strokeWidth={2.5} />
            ))}
          </Svg>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 14, alignItems: 'flex-end' }}>
            <NumField label="Naya wazan" value={newWeight} onChange={setNewWeight} unit="kg" />
            <View style={{ flex: 1.2 }}>
              <PrimaryButton label="Add karo" icon="plus" onPress={() => {
                const v = parseFloat(newWeight);
                if (!isNaN(v) && v > 20 && v < 400) { fit.addWeight(v); setNewWeight(''); }
              }} />
            </View>
          </View>
        </Card>

        <SectionHead title="Badges" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {ACHIEVEMENTS.map(a => {
            const got = fit.doneWorkouts >= a.need;
            return (
              <View key={a.id} style={{
                width: 118, alignItems: 'center', padding: 14, borderRadius: R.lg,
                backgroundColor: got ? '#FFB02014' : C.card, borderWidth: 1, borderColor: got ? '#FFB02055' : C.border,
                opacity: got ? 1 : 0.55,
              }}>
                <Icon name={a.icon} size={30} color={got ? C.amber : C.faint} />
                <Tx size={12.5} w="bold" style={{ marginTop: 8, textAlign: 'center' }}>{a.title}</Tx>
                <Tx dim size={10.5} style={{ marginTop: 3, textAlign: 'center' }}>{a.desc}</Tx>
              </View>
            );
          })}
        </ScrollView>

        <SectionHead title="30-Day Challenge" action={`${fit.challenge.length}/30`} />
        <Card>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {days.map(d => {
              const on = fit.challenge.includes(d);
              return (
                <Pressable key={d} onPress={() => fit.toggleChallengeDay(d)} style={{
                  width: '15.5%', aspectRatio: 1, borderRadius: R.sm, alignItems: 'center', justifyContent: 'center',
                  backgroundColor: on ? C.lime : C.card2, borderWidth: 1, borderColor: on ? C.lime : C.border,
                }}>
                  {on ? <Icon name="check" size={17} color={C.ink} strokeWidth={2.6} />
                      : <Tx size={13} w="bold" dim>{d}</Tx>}
                </Pressable>
              );
            })}
          </View>
          <Tx dim size={12.5} style={{ marginTop: 12 }}>Har din workout karke din mark karo — 30 din ki chain todna mat!</Tx>
        </Card>

        <SectionHead title="Recent workouts" />
        {fit.sessions.length === 0 ? (
          <Card><Tx dim size={13.5}>Abhi koi workout complete nahi hua. Pehla aaj hi kar lo!</Tx></Card>
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
