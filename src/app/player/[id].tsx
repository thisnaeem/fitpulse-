import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, PrimaryButton, GhostButton, Ring, GlassCircleBtn } from '../../ui';
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
          <Ring size={148} stroke={6} progress={1} glow>
            <LinearGradient colors={['#A3E63540', '#A3E6350A']} style={{ width: 118, height: 118, borderRadius: 59, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="trophy" size={56} color={C.lime} strokeWidth={1.4} />
            </LinearGradient>
          </Ring>
          <Tx size={32} w="xbold" style={{ marginTop: 28, textAlign: 'center' }}>Great work!</Tx>
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
              <View style={{ flex: 1, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.lg, paddingVertical: 16, alignItems: 'center', gap: 4 }}>
                <Icon name="zap" size={21} color={C.lime} />
                <Tx size={20} w="xbold">+{reward.xpEarned} XP</Tx>
                <Tx dim size={11} w="semi">EARNED</Tx>
              </View>
              <View style={{ flex: 1, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.lg, paddingVertical: 16, alignItems: 'center', gap: 4 }}>
                <Icon name="flame" size={21} color={C.amber} />
                <Tx size={20} w="xbold">{reward.streakDays} day{reward.streakDays === 1 ? '' : 's'}</Tx>
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

  const img = workoutImage(w.id);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Full-screen photo background + heavy dark overlay */}
      {img ? <Image source={img} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      <LinearGradient colors={['rgba(7,9,11,0.86)', 'rgba(7,9,11,0.93)', 'rgba(7,9,11,0.97)']}
        locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <GlassCircleBtn icon="left" size={40} iconSize={19} onPress={() => router.back()} />
            <Tx size={13.5} w="semi" color="#FFFFFFD9">{w.title}</Tx>
            <View style={{
              backgroundColor: C.glassDark, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
              borderRadius: R.pill, paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <Tx size={12.5} w="bold" color="#FFF">{idx + 1}/{w.exercises.length}</Tx>
            </View>
          </View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.16)', marginTop: 18, overflow: 'hidden' }}>
            <View style={{ width: `${progress * 100}%`, height: 6, backgroundColor: C.lime, borderRadius: 3 }} />
          </View>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={{ alignItems: 'center', opacity: fade, transform: [{ translateY: slideY }] }}>
              {resting ? (
                <>
                  <Tx size={14} w="xbold" color={C.lime2}>REST</Tx>
                  <Tx size={30} w="xbold" style={{ marginTop: 8, textAlign: 'center', lineHeight: 36 }}>{cur.name}</Tx>
                  <Tx dim size={13.5} w="semi" style={{ marginTop: 5 }}>up next · {cur.detail}</Tx>
                </>
              ) : (
                <>
                  <View style={{
                    backgroundColor: C.glassDark, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
                    borderRadius: R.pill, paddingHorizontal: 13, paddingVertical: 5,
                  }}>
                    <Tx size={12} w="bold" color={w.tint}>{cur.muscle.toUpperCase()}</Tx>
                  </View>
                  <Tx size={34} w="xbold" style={{ marginTop: 14, textAlign: 'center', lineHeight: 40 }}>{cur.name}</Tx>
                  <Tx dim size={14.5} style={{ marginTop: 6 }}>{cur.detail}</Tx>
                </>
              )}
              <Animated.View style={{ marginTop: 30, transform: [{ scale: scalePulse }] }}>
                <Ring size={264} stroke={15} glow trackColor="rgba(255,255,255,0.14)"
                  progress={resting ? left / REST_SECONDS : left / cur.seconds} color={resting ? C.lime2 : C.lime}>
                  <Tx size={13} w="xbold" color={resting ? C.lime2 : C.lime}>{resting ? 'REST' : cur.muscle.toUpperCase()}</Tx>
                  <Tx size={76} w="xbold" style={{ lineHeight: 84 }}>{mm}:{ss}</Tx>
                  <Tx dim size={12.5} w="semi">{resting ? 'GET READY' : 'TIME LEFT'}</Tx>
                </Ring>
              </Animated.View>
              {!resting ? <Tx dim size={13.5} style={{ marginTop: 26, textAlign: 'center', paddingHorizontal: 26, lineHeight: 19 }}>{cur.tip}</Tx> : null}
            </Animated.View>
          </View>

          <View style={{ flexDirection: 'row', gap: 26, alignItems: 'flex-start', justifyContent: 'center' }}>
            <View style={{ alignItems: 'center', gap: 7, marginTop: 10 }}>
              <GlassCircleBtn icon="right" size={56} iconSize={24} onPress={() => setLeft(0)} />
              <Tx dim size={11} w="semi">{resting ? 'Skip rest' : 'Skip'}</Tx>
            </View>
            <View style={{ alignItems: 'center', gap: 7 }}>
              <Pressable onPress={() => setRunning(!running)} style={{
                width: 76, height: 76, borderRadius: 38, backgroundColor: C.lime,
                alignItems: 'center', justifyContent: 'center',
                shadowColor: C.lime, shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 8,
              }}>
                <Icon name={running ? 'pause' : 'play'} size={32} color={C.ink} strokeWidth={2.2} />
              </Pressable>
              <Tx dim size={11} w="semi">{running ? 'Pause' : 'Resume'}</Tx>
            </View>
            <View style={{ alignItems: 'center', gap: 7, marginTop: 10 }}>
              <GlassCircleBtn icon="check" size={56} iconSize={24} onPress={() => router.back()} />
              <Tx dim size={11} w="semi">End</Tx>
            </View>
          </View>
          <Tx dim size={11.5} style={{ textAlign: 'center', marginTop: 14 }}>Total time ~{Math.round(totalSeconds / 60)} min</Tx>
        </View>
      </SafeAreaView>
    </View>
  );
}
