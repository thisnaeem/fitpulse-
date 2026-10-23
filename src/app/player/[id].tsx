import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, PrimaryButton, GhostButton, Ring } from '../../ui';
import { Icon } from '../../icons';
import { workoutById } from '../../data';
import { useFit } from '../../store';
import { useAuth } from '../../auth';
import { API_URL } from '../../config';
import { showWorkoutInterstitial } from '../../ads';

const REST_SECONDS = 10;

export default function Player() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const fit = useFit();
  const auth = useAuth();
  const w = useMemo(() => workoutById(id || ''), [id]);

  const [idx, setIdx] = useState(0);
  const [resting, setResting] = useState(false);
  const [left, setLeft] = useState(w.exercises[0].seconds);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const startedAt = useRef(Date.now());
  const totalSeconds = useMemo(() => w.exercises.reduce((s, e) => s + e.seconds, 0) + REST_SECONDS * (w.exercises.length - 1), [w]);

  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  useEffect(() => {
    if (left > 0 || done) return;
    if (resting) {
      setResting(false);
      setLeft(w.exercises[idx].seconds);
      setRunning(true);
    } else if (idx < w.exercises.length - 1) {
      setIdx(idx + 1);
      setResting(true);
      setLeft(REST_SECONDS);
      setRunning(true);
    } else {
      setDone(true);
      const minutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
      fit.addDoneWorkout({ workoutId: w.id, title: w.title, minutes, kcal: w.kcal, date: new Date().toISOString() });
      if (auth.token && API_URL) {
        fetch(API_URL + '/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${auth.token}` },
          body: JSON.stringify({ workout_id: w.id, title: w.title, minutes, calories: w.kcal }),
        }).catch(() => {});
        auth.syncNow();
      }
      showWorkoutInterstitial();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const cur = w.exercises[idx];
  const progress = done ? 1 : (idx / w.exercises.length) + (resting ? 0 : (1 - left / cur.seconds) / w.exercises.length);
  const mm = String(Math.floor(left / 60)).padStart(1, '0');
  const ss = String(left % 60).padStart(2, '0');

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1, padding: 26, justifyContent: 'center', alignItems: 'center' }}>
          <LinearGradient colors={['#A3E63540', '#A3E6350A']} style={{ width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trophy" size={64} color={C.lime} strokeWidth={1.4} />
          </LinearGradient>
          <Tx size={30} w="xbold" style={{ marginTop: 26, textAlign: 'center' }}>Shandaar kaam!</Tx>
          <Tx dim size={15} style={{ marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
            {w.title} mukammal — {w.kcal} kcal burn, {fit.doneWorkouts} workouts kul ho gaye.
          </Tx>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 26, width: '100%' }}>
            <View style={{ flex: 1 }}><GhostButton label="Wapas" onPress={() => router.replace('/(tabs)')} /></View>
            <View style={{ flex: 1 }}><PrimaryButton label="Phir se" icon="play" onPress={() => router.replace(`/player/${w.id}`)} /></View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ flex: 1, padding: 22 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pressable onPress={() => router.back()} hitSlop={10}><Icon name="left" size={24} color={C.text} /></Pressable>
          <Tx dim size={13} w="semi">{w.title}</Tx>
          <Tx size={13} w="bold" color={w.tint}>{idx + 1}/{w.exercises.length}</Tx>
        </View>
        <View style={{ height: 8, borderRadius: 4, backgroundColor: C.ringTrack, marginTop: 16, overflow: 'hidden' }}>
          <View style={{ width: `${progress * 100}%`, height: 8, backgroundColor: w.tint, borderRadius: 4 }} />
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {resting ? (
            <>
              <Tx size={15} w="xbold" color={C.blue}>AARAM — agli exercise:</Tx>
              <Tx size={24} w="xbold" style={{ marginTop: 8, textAlign: 'center' }}>{cur.name}</Tx>
            </>
          ) : (
            <>
              <View style={{ backgroundColor: w.tint + '1E', borderRadius: R.pill, paddingHorizontal: 13, paddingVertical: 5 }}>
                <Tx size={12.5} w="bold" color={w.tint}>{cur.muscle.toUpperCase()}</Tx>
              </View>
              <Tx size={30} w="xbold" style={{ marginTop: 14, textAlign: 'center' }}>{cur.name}</Tx>
              <Tx dim size={14.5} style={{ marginTop: 6 }}>{cur.detail}</Tx>
            </>
          )}
          <View style={{ marginTop: 26 }}>
            <Ring size={230} stroke={15} progress={resting ? left / REST_SECONDS : left / cur.seconds} color={resting ? C.blue : w.tint}>
              <Tx size={54} w="xbold">{mm}:{ss}</Tx>
              <Tx dim size={12.5} w="semi">{resting ? 'REST' : 'BAQI WAQT'}</Tx>
            </Ring>
          </View>
          {!resting ? <Tx dim size={13.5} style={{ marginTop: 22, textAlign: 'center', paddingHorizontal: 26, lineHeight: 19 }}>💡 {cur.tip}</Tx> : null}
        </View>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <GhostButton label={resting ? 'Rest skip' : 'Skip'} icon="right" onPress={() => setLeft(0)} />
          </View>
          <Pressable onPress={() => setRunning(!running)} style={{
            width: 68, height: 68, borderRadius: 34, backgroundColor: C.lime,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={running ? 'pause' : 'play'} size={30} color={C.ink} strokeWidth={2.2} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <GhostButton label="Khatam" onPress={() => router.back()} />
          </View>
        </View>
        <Tx dim size={11.5} style={{ textAlign: 'center', marginTop: 14 }}>Kul waqt ~{Math.round(totalSeconds / 60)} minute</Tx>
      </View>
    </SafeAreaView>
  );
}
