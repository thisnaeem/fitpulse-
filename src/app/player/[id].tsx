import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, PrimaryButton, GhostButton, Ring } from '../../ui';
import { Icon } from '../../icons';
import { workoutById } from '../../data';
import { workoutImage } from '../../workoutImages';
import { useFit, type CompletionResult } from '../../store';
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
  const [reward, setReward] = useState<CompletionResult | null>(null);
  const startedAt = useRef(Date.now());
  const totalSeconds = useMemo(() => w.exercises.reduce((s, e) => s + e.seconds, 0) + REST_SECONDS * (w.exercises.length - 1), [w]);

  // --- Animations (Animated API only) ---
  const fade = useRef(new Animated.Value(1)).current;      // exercise change: fade + slide
  const scalePulse = useRef(new Animated.Value(1)).current; // exercise pulse / rest breathing
  const levelUpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!running || done) return;
    const t = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, [running, done]);

  // Fade + slide transition whenever the exercise or phase changes.
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }, [idx, resting, fade]);

  // Gentle pulse while exercising; slow breathing scale while resting.
  useEffect(() => {
    if (done) return;
    scalePulse.setValue(1);
    const peak = resting ? 1.12 : 1.05;
    const half = resting ? 1700 : 750;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scalePulse, { toValue: peak, duration: half, useNativeDriver: true }),
        Animated.timing(scalePulse, { toValue: 1, duration: half, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => { loop.stop(); scalePulse.setValue(1); };
  }, [resting, done, scalePulse]);

  // LEVEL UP banner pop on the finish screen.
  useEffect(() => {
    if (done && reward?.leveledUp) {
      levelUpAnim.setValue(0);
      Animated.spring(levelUpAnim, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start();
    }
  }, [done, reward, levelUpAnim]);

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
      const res = fit.addDoneWorkout({ workoutId: w.id, title: w.title, minutes, kcal: w.kcal, date: new Date().toISOString() });
      setReward(res);
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
  const slideY = fade.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ flex: 1, padding: 26, justifyContent: 'center', alignItems: 'center' }}>
          <LinearGradient colors={['#A3E63540', '#A3E6350A']} style={{ width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="trophy" size={64} color={C.lime} strokeWidth={1.4} />
          </LinearGradient>
          <Tx size={30} w="xbold" style={{ marginTop: 26, textAlign: 'center' }}>Great work!</Tx>
          <Tx dim size={15} style={{ marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
            {w.title} complete — {w.kcal} kcal burned, {fit.doneWorkouts} workouts in total.
          </Tx>

          {reward?.leveledUp ? (
            <Animated.View style={{
              opacity: levelUpAnim, marginTop: 22, width: '100%',
              transform: [{ scale: levelUpAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }],
            }}>
              <LinearGradient colors={[C.lime2, C.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ borderRadius: R.lg, paddingVertical: 14, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Icon name="award" size={30} color={C.ink} strokeWidth={1.8} />
                <View>
                  <Tx size={19} w="xbold" color={C.ink}>LEVEL UP!</Tx>
                  <Tx size={13} w="semi" color="#0C0F11CC">You reached Level {reward.newLevel}</Tx>
                </View>
              </LinearGradient>
            </Animated.View>
          ) : null}

          {reward ? (
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 22, width: '100%' }}>
              <View style={{ flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.lg, paddingVertical: 14, alignItems: 'center', gap: 4 }}>
                <Icon name="zap" size={21} color={C.lime} />
                <Tx size={18} w="xbold">+{reward.xpEarned} XP</Tx>
                <Tx dim size={11} w="semi">EARNED</Tx>
              </View>
              <View style={{ flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.lg, paddingVertical: 14, alignItems: 'center', gap: 4 }}>
                <Icon name="flame" size={21} color={C.amber} />
                <Tx size={18} w="xbold">{reward.streakDays} day{reward.streakDays === 1 ? '' : 's'}</Tx>
                <Tx dim size={11} w="semi">STREAK</Tx>
              </View>
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 26, width: '100%' }}>
            <View style={{ flex: 1 }}><GhostButton label="Back" onPress={() => router.replace('/(tabs)')} /></View>
            <View style={{ flex: 1 }}><PrimaryButton label="Again" icon="play" onPress={() => router.replace(`/player/${w.id}`)} /></View>
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
          <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ translateY: slideY }] }}>
            {workoutImage(w.id) ? (
              <Image source={workoutImage(w.id)} style={{ width: 300, height: 128, borderRadius: R.lg, marginBottom: 20 }} resizeMode="cover" />
            ) : null}
            {resting ? (
              <>
                <Tx size={15} w="xbold" color={C.blue}>REST — up next:</Tx>
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
            <Animated.View style={{ marginTop: 26, transform: [{ scale: scalePulse }] }}>
              <Ring size={230} stroke={15} progress={resting ? left / REST_SECONDS : left / cur.seconds} color={resting ? C.blue : w.tint}>
                <Tx size={54} w="xbold">{mm}:{ss}</Tx>
                <Tx dim size={12.5} w="semi">{resting ? 'REST' : 'TIME LEFT'}</Tx>
              </Ring>
            </Animated.View>
            {!resting ? <Tx dim size={13.5} style={{ marginTop: 22, textAlign: 'center', paddingHorizontal: 26, lineHeight: 19 }}>{cur.tip}</Tx> : null}
          </Animated.View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <GhostButton label={resting ? 'Skip rest' : 'Skip'} icon="right" onPress={() => setLeft(0)} />
          </View>
          <Pressable onPress={() => setRunning(!running)} style={{
            width: 68, height: 68, borderRadius: 34, backgroundColor: C.lime,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={running ? 'pause' : 'play'} size={30} color={C.ink} strokeWidth={2.2} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <GhostButton label="End" onPress={() => router.back()} />
          </View>
        </View>
        <Tx dim size={11.5} style={{ textAlign: 'center', marginTop: 14 }}>Total time ~{Math.round(totalSeconds / 60)} min</Tx>
      </View>
    </SafeAreaView>
  );
}
