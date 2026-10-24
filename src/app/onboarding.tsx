import React, { useRef, useState, type ComponentRef } from 'react';
import { Dimensions, Image, Pressable, ScrollView, View, type ImageSourcePropType } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, R } from '../theme';
import { Tx, PrimaryButton, WhiteButton, GhostButton, Chip, NumField, Field } from '../ui';
import { Icon } from '../icons';
import { useFit } from '../store';
import { PROMO } from '../promoImages';
import { workoutImage } from '../workoutImages';

const W = Dimensions.get('window').width;

const SLIDES: { image?: ImageSourcePropType; top: string; accent: string; sub: string }[] = [
  { image: PROMO.onboard1, top: 'Real fitness,', accent: 'right at home', sub: 'No gym, no equipment — guided workouts that actually work, for every level.' },
  { image: PROMO.onboard2, top: 'Progress you', accent: 'can actually see', sub: 'Weight, water, streaks and a 30-day challenge — every win gets tracked.' },
  { image: workoutImage('cardio'), top: 'Show up daily,', accent: 'win daily', sub: 'Small daily goals, XP, levels and badges — build the habit, get the results.' },
];

export default function Onboarding() {
  const router = useRouter();
  const fit = useFit();
  const insets = useSafeAreaInsets();
  const pagerRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'lose_weight' | 'build_muscle' | 'stay_fit'>('stay_fit');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('72');

  const setupPage = page >= SLIDES.length;

  const next = () => {
    if (page >= SLIDES.length - 1) { setPage(SLIDES.length); return; }
    const target = page + 1;
    pagerRef.current?.scrollTo({ x: target * W, animated: true });
    setPage(target);
  };

  const finish = (withAccount: boolean) => {
    fit.setProfile({
      name: name.trim(), goal, gender,
      age: parseInt(age) || 25, heightCm: parseFloat(height) || 170, onboarded: true,
    });
    const w = parseFloat(weight);
    if (!isNaN(w)) fit.addWeight(w);
    if (withAccount) router.replace('/auth/register');
    else router.replace('/(tabs)');
  };

  if (setupPage) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 30 }}>
          <Tx size={29} w="xbold">Let's build your plan</Tx>
          <Tx dim size={15} style={{ marginTop: 8, lineHeight: 22 }}>These details personalize your calorie targets and goals.</Tx>

          <Tx size={13} w="semi" dim style={{ marginTop: 26, marginBottom: 8 }}>Gender</Tx>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Male" selected={gender === 'male'} onPress={() => setGender('male')} />
            <Chip label="Female" selected={gender === 'female'} onPress={() => setGender('female')} />
          </View>
          <View style={{ height: 14 }} />
          <Tx size={12} w="semi" dim style={{ marginBottom: 6 }}>Name (optional)</Tx>
          <Field icon="user" placeholder="e.g. Ali Khan" value={name} onChangeText={setName} autoCap="words" />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <NumField label="Age" value={age} onChange={setAge} unit="yrs" />
            <NumField label="Height" value={height} onChange={setHeight} unit="cm" />
            <NumField label="Weight" value={weight} onChange={setWeight} unit="kg" />
          </View>

          <Tx size={13} w="semi" dim style={{ marginTop: 24, marginBottom: 10 }}>Your goal</Tx>
          {([
            ['lose_weight', 'target', 'Lose weight'],
            ['build_muscle', 'muscle', 'Build muscle'],
            ['stay_fit', 'heart', 'Just stay fit'],
          ] as const).map(([g, ic, label]) => (
            <Pressable key={g} onPress={() => setGoal(g)} style={{
              flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, marginBottom: 10,
              borderRadius: R.lg, borderWidth: 1.5,
              borderColor: goal === g ? C.lime : C.glassBorder, backgroundColor: goal === g ? C.lime + '14' : C.glass,
            }}>
              <Icon name={ic} size={22} color={goal === g ? C.lime : C.muted} />
              <Tx size={15} w="semi" style={{ flex: 1 }}>{label}</Tx>
              {goal === g ? <Icon name="check" size={20} color={C.lime} /> : null}
            </Pressable>
          ))}

          <View style={{ height: 12 }} />
          <PrimaryButton label="Create account & save" icon="user" onPress={() => finish(true)} />
          <View style={{ height: 12 }} />
          <GhostButton label="Continue as guest" onPress={() => finish(false)} />
          <Tx dim size={12} style={{ textAlign: 'center', marginTop: 14, lineHeight: 17 }}>
            With an account, your data is safely backed up to the cloud and restored on any phone.
          </Tx>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView ref={pagerRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setPage(Math.round(e.nativeEvent.contentOffset.x / W))}>
        {SLIDES.map((s, i) => (
          <View key={i} style={{ width: W }}>
            {s.image ? (
              <Image source={s.image} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="cover" />
            ) : null}
            <LinearGradient colors={['rgba(7,9,11,0.25)', 'rgba(7,9,11,0.05)', 'rgba(7,9,11,0.94)']}
              locations={[0, 0.4, 0.85]} style={{ position: 'absolute', width: '100%', height: '100%' }} />
            <View style={{ position: 'absolute', left: 26, right: 26, bottom: 208 }}>
              <Tx size={37} w="xbold" color="#FFF" style={{ lineHeight: 44 }}>{s.top}</Tx>
              <Tx size={37} w="xbold" color={C.lime2} style={{ lineHeight: 44 }}>{s.accent}</Tx>
              <Tx size={15.5} color="#FFFFFFD9" style={{ marginTop: 12, lineHeight: 23 }}>{s.sub}</Tx>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Controls overlaid on the photo (ref-c) */}
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: insets.bottom + 20 }}>
        <View style={{ flexDirection: 'row', gap: 7, marginBottom: 22 }}>
          {SLIDES.map((_, i) => (
            <View key={i} style={{ width: i === page ? 26 : 8, height: 8, borderRadius: 4, backgroundColor: i === page ? C.lime : 'rgba(255,255,255,0.35)' }} />
          ))}
        </View>
        <PrimaryButton label={page === SLIDES.length - 1 ? 'Get started' : 'Next'} icon="right" onPress={next} />
        <View style={{ height: 12 }} />
        <WhiteButton label="Skip" onPress={() => setPage(SLIDES.length)} />
      </View>
    </View>
  );
}
