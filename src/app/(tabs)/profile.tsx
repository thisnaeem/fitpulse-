import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, R } from '../../theme';
import { Tx, Card, Ring, SectionHead } from '../../ui';
import { Icon, type IconName } from '../../icons';
import { useFit } from '../../store';
import { useAuth } from '../../auth';
import { levelFromXp } from '../../game';
import { AdBanner } from '../../ads';

const GOAL_LABEL: Record<string, string> = {
  lose_weight: 'Lose weight', build_muscle: 'Build muscle', stay_fit: 'Stay fit',
};

export default function Profile() {
  const fit = useFit();
  const auth = useAuth();
  const router = useRouter();
  const p = fit.profile;
  const initials = (auth.user?.name || p.name || 'F').trim().charAt(0).toUpperCase();
  const lvl = levelFromXp(fit.xp);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        {/* Lime-tinted glass banner — avatar, identity, mini level ring */}
        <View style={{
          borderRadius: R.xl, padding: 18,
          backgroundColor: C.lime + '12', borderWidth: 1, borderColor: C.lime + '2E',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <LinearGradient colors={[C.lime2, C.lime]} style={{ width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}>
              <Tx size={26} w="xbold" color={C.ink}>{initials}</Tx>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Tx size={20} w="xbold">{auth.user?.name || p.name || 'Guest User'}</Tx>
              <Tx dim size={12.5} style={{ marginTop: 2 }}>{auth.user ? auth.user.email : 'Local mode — data stays on this phone'}</Tx>
              <View style={{ alignSelf: 'flex-start', marginTop: 7, backgroundColor: C.lime + '1F', borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 3 }}>
                <Tx size={11.5} w="bold" color={C.lime}>Goal: {GOAL_LABEL[p.goal]}</Tx>
              </View>
            </View>
            <Ring size={58} stroke={5} progress={lvl.progress}>
              <Tx size={16} w="xbold">{lvl.level}</Tx>
            </Ring>
          </View>
        </View>

        <Pressable onPress={() => router.push('/(tabs)/progress')}>
          <View style={{
            borderRadius: R.lg, padding: 16, marginTop: 12,
            backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Tx size={15} w="xbold">Level {lvl.level} · {lvl.title}</Tx>
                <Tx dim size={12} style={{ marginTop: 2 }}>{fit.xp} XP total · {lvl.needed - lvl.into} XP to Level {lvl.level + 1}</Tx>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Icon name="flame" size={16} color={C.amber} />
                <Tx size={13.5} w="bold" color={C.amber}>{fit.streakDays} day streak</Tx>
              </View>
            </View>
            <View style={{ height: 7, borderRadius: 4, backgroundColor: C.ringTrack, marginTop: 12, overflow: 'hidden' }}>
              <View style={{ width: `${lvl.progress * 100}%`, height: 7, backgroundColor: C.lime, borderRadius: 4 }} />
            </View>
          </View>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
          <Card style={{ flex: 1 }}>
            <Tx dim size={11.5} w="semi">HEIGHT / WEIGHT</Tx>
            <Tx size={19} w="xbold" style={{ marginTop: 5 }}>{p.heightCm} cm · {fit.weights[fit.weights.length - 1]} kg</Tx>
          </Card>
          <Card style={{ flex: 1 }}>
            <Tx dim size={11.5} w="semi">FAVORITES</Tx>
            <Tx size={19} w="xbold" style={{ marginTop: 5 }}>{fit.favorites.length} workouts</Tx>
          </Card>
        </View>

        <SectionHead title="Account" />
        {auth.user ? (
          <>
            <Row icon="check" label="Cloud sync is on" sub="Your data is safely backed up to the cloud" />
            <Row icon="share" label="Sync now" onPress={() => auth.syncNow()} />
            <Row icon="logout" label="Logout" danger onPress={() => auth.logout()} />
          </>
        ) : (
          <>
            <Row icon="user" label="Log in" sub={auth.backendLive ? 'Get your progress on any phone' : 'Login will work once the backend is live'} onPress={() => router.push('/auth/login')} />
            <Row icon="sparkles" label="Create account" sub="Free — takes 30 seconds" onPress={() => router.push('/auth/register')} />
          </>
        )}

        <SectionHead title="Settings" />
        <SoundRow />
        <Row icon="water" label="Daily water goal" sub={`${fit.waterGoal} glasses`} />
        <Row icon="bell" label="Workout reminder" sub="Coming soon" />
        <Row icon="settings" label="Redo setup" sub="Run onboarding again" onPress={() => fit.setProfile({ onboarded: false })} />

        <SectionHead title="About" />
        <Row icon="heart" label="FitPulse" sub="Real fitness at home — no gym needed" />
        <AdBanner style={{ marginTop: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SoundRow() {
  const fit = useFit();
  const on = fit.soundOn;
  return (
    <Pressable onPress={() => fit.setSoundOn(!on)}>
      <Card style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="volume" size={19} color={on ? C.lime : C.muted} />
        </View>
        <View style={{ flex: 1 }}>
          <Tx size={14.5} w="semi">Sound effects</Tx>
          <Tx dim size={12} style={{ marginTop: 1 }}>{on ? 'On — timer cues, taps and fanfares' : 'Off — the app stays silent'}</Tx>
        </View>
        <View style={{
          width: 48, height: 28, borderRadius: 14, justifyContent: 'center', paddingHorizontal: 3,
          backgroundColor: on ? C.lime : C.glass, borderWidth: 1, borderColor: on ? C.lime : C.glassBorder,
        }}>
          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: on ? C.ink : C.muted, alignSelf: on ? 'flex-end' : 'flex-start' }} />
        </View>
      </Card>
    </Pressable>
  );
}

function Row({ icon, label, sub, onPress, danger }: {
  icon: IconName; label: string; sub?: string; onPress?: () => void; danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15 }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={19} color={danger ? C.red : C.muted} />
        </View>
        <View style={{ flex: 1 }}>
          <Tx size={14.5} w="semi" color={danger ? C.red : C.text}>{label}</Tx>
          {sub ? <Tx dim size={12} style={{ marginTop: 1 }}>{sub}</Tx> : null}
        </View>
        {onPress ? <Icon name="chevron" size={18} color={C.faint} /> : null}
      </Card>
    </Pressable>
  );
}
