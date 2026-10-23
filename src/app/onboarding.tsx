import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { C, R } from '../theme';
import { Tx, PrimaryButton, GhostButton, Chip, NumField, Field } from '../ui';
import { Icon, type IconName } from '../icons';
import { useFit } from '../store';

const W = Dimensions.get('window').width;

const SLIDES: { icon: IconName; tint: string; title: string; sub: string }[] = [
  { icon: 'flame', tint: '#FF7A45', title: 'Ghar baithe\nasli fitness', sub: 'Bina gym, bina equipment — guided workouts jo waqai kaam karte hain, har level ke liye.' },
  { icon: 'chart', tint: '#4CC3FF', title: 'Progress jo\nnazar aaye', sub: 'Wazan, paani, streak aur 30-day challenge — tumhari har jeet track hoti hai.' },
  { icon: 'trophy', tint: '#FFB020', title: 'Roz ka saathi,\nroz ki jeet', sub: 'Chhote chhote roz ke goals, badges aur reminders — adat banti hai, natija milta hai.' },
];

export default function Onboarding() {
  const router = useRouter();
  const fit = useFit();
  const [page, setPage] = useState(0);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'lose_weight' | 'build_muscle' | 'stay_fit'>('stay_fit');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('72');

  const setupPage = page >= SLIDES.length;

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {!setupPage ? (
        <View style={{ flex: 1 }}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={e => setPage(Math.round(e.nativeEvent.contentOffset.x / W))}>
            {SLIDES.map((s, i) => (
              <View key={i} style={{ width: W, flex: 1, paddingHorizontal: 28, paddingTop: 46 }}>
                <LinearGradient colors={[s.tint + '40', s.tint + '0A']} style={{
                  width: 190, height: 190, borderRadius: 60, alignSelf: 'center',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 44,
                }}>
                  <Icon name={s.icon} size={92} color={s.tint} strokeWidth={1.4} />
                </LinearGradient>
                <Tx size={34} w="xbold" style={{ lineHeight: 42 }}>{s.title}</Tx>
                <Tx dim size={16} style={{ marginTop: 14, lineHeight: 24 }}>{s.sub}</Tx>
              </View>
            ))}
          </ScrollView>
          <View style={{ paddingHorizontal: 28, paddingBottom: 18 }}>
            <View style={{ flexDirection: 'row', gap: 7, marginBottom: 24, justifyContent: 'center' }}>
              {SLIDES.map((_, i) => (
                <View key={i} style={{ width: i === page ? 26 : 8, height: 8, borderRadius: 4, backgroundColor: i === page ? C.lime : C.border }} />
              ))}
            </View>
            <PrimaryButton label={page === SLIDES.length - 1 ? 'Shuru karein' : 'Aage'} icon="right"
              onPress={() => setPage(page + 1)} />
            <Pressable onPress={() => setPage(SLIDES.length)} style={{ alignItems: 'center', marginTop: 16 }}>
              <Tx dim size={14} w="semi">Skip</Tx>
            </Pressable>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 30 }}>
          <Tx size={28} w="xbold">Tumhara plan banayein</Tx>
          <Tx dim size={15} style={{ marginTop: 8, lineHeight: 22 }}>Ye details tumhare calories aur goals ko personal banayengi.</Tx>

          <Tx size={13} w="semi" dim style={{ marginTop: 26, marginBottom: 8 }}>Tumhara naam</Tx>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Chip label="Male" selected={gender === 'male'} onPress={() => setGender('male')} />
            <Chip label="Female" selected={gender === 'female'} onPress={() => setGender('female')} />
          </View>
          <View style={{ height: 14 }} />
          <Tx size={12} w="semi" dim style={{ marginBottom: 6 }}>Naam (optional)</Tx>
          <Field icon="user" placeholder="Maslan: Ali Khan" value={name} onChangeText={setName} autoCap="words" />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <NumField label="Umar" value={age} onChange={setAge} unit="saal" />
            <NumField label="Qad" value={height} onChange={setHeight} unit="cm" />
            <NumField label="Wazan" value={weight} onChange={setWeight} unit="kg" />
          </View>

          <Tx size={13} w="semi" dim style={{ marginTop: 24, marginBottom: 10 }}>Tumhara goal</Tx>
          {([
            ['lose_weight', 'target', 'Wazan kam karna'],
            ['build_muscle', 'muscle', 'Muscle banana'],
            ['stay_fit', 'heart', 'Bas fit rehna'],
          ] as const).map(([g, ic, label]) => (
            <Pressable key={g} onPress={() => setGoal(g)} style={{
              flexDirection: 'row', alignItems: 'center', gap: 12, padding: 15, marginBottom: 10,
              borderRadius: R.md, borderWidth: 1.5,
              borderColor: goal === g ? C.lime : C.border, backgroundColor: goal === g ? C.lime + '14' : C.card,
            }}>
              <Icon name={ic} size={22} color={goal === g ? C.lime : C.muted} />
              <Tx size={15} w="semi" style={{ flex: 1 }}>{label}</Tx>
              {goal === g ? <Icon name="check" size={20} color={C.lime} /> : null}
            </Pressable>
          ))}

          <View style={{ height: 12 }} />
          <PrimaryButton label="Account bana kar save karo" icon="user" onPress={() => finish(true)} />
          <View style={{ height: 12 }} />
          <GhostButton label="Guest ke tor par continue" onPress={() => finish(false)} />
          <Tx dim size={12} style={{ textAlign: 'center', marginTop: 14, lineHeight: 17 }}>
            Account se tumhara data Neon cloud mein mehfooz rehta hai aur kisi bhi phone par wapas mil jata hai.
          </Tx>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
