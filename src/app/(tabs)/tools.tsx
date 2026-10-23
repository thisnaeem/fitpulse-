import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { C, R } from '../../theme';
import { Tx, Card, Chip, NumField, SectionHead } from '../../ui';
import { Icon } from '../../icons';
import { useFit } from '../../store';
import { AdBanner } from '../../ads';

const ACTIVITY = [
  { k: 'sedentary', label: 'Sedentary (little or none)', mult: 1.2 },
  { k: 'light', label: 'Light exercise (1-3 days)', mult: 1.375 },
  { k: 'moderate', label: 'Moderate (3-5 days)', mult: 1.55 },
  { k: 'active', label: 'Heavy (6-7 days)', mult: 1.725 },
] as const;

export default function Tools() {
  const fit = useFit();
  const [weight, setWeight] = useState(String(fit.weights[fit.weights.length - 1] || 72));
  const [height, setHeight] = useState(String(fit.profile.heightCm || 170));
  const [age, setAge] = useState(String(fit.profile.age || 25));
  const [male, setMale] = useState(fit.profile.gender !== 'female');
  const [act, setAct] = useState<(typeof ACTIVITY)[number]>(ACTIVITY[1]);

  const w = parseFloat(weight) || 0, h = parseFloat(height) || 0, a = parseFloat(age) || 0;
  const { bmi, cat, catColor, bmr, tdee } = useMemo(() => {
    const b = h > 0 ? w / Math.pow(h / 100, 2) : 0;
    let category = '—', color = C.muted;
    if (b > 0 && b < 18.5) { category = 'Underweight'; color = C.blue; }
    else if (b < 25) { category = 'Healthy'; color = C.lime; }
    else if (b < 30) { category = 'Overweight'; color = C.amber; }
    else if (b >= 30) { category = 'Obese'; color = C.red; }
    const bmrV = 10 * w + 6.25 * h - 5 * a + (male ? 5 : -161);
    return { bmi: b, cat: category, catColor: color, bmr: Math.max(0, Math.round(bmrV)), tdee: Math.max(0, Math.round(bmrV * act.mult)) };
  }, [w, h, a, male, act]);

  const bmiPct = Math.max(0, Math.min(1, (bmi - 14) / (36 - 14)));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#14324A', '#0D1B28']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={{ borderRadius: R.xl, padding: 18, borderWidth: 1, borderColor: C.blue + '30' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
            <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: C.blue + '24', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="calc" size={25} color={C.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Tx size={25} w="xbold">Tools</Tx>
              <Tx dim size={13} style={{ marginTop: 2 }}>BMI, calories and daily needs — backed by science</Tx>
            </View>
          </View>
        </LinearGradient>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 18 }}>
          <NumField label="Weight" value={weight} onChange={setWeight} unit="kg" />
          <NumField label="Height" value={height} onChange={setHeight} unit="cm" />
          <NumField label="Age" value={age} onChange={setAge} unit="yr" />
        </View>
        <View style={{ flexDirection: 'row', marginTop: 14 }}>
          <Chip label="Male" selected={male} onPress={() => setMale(true)} />
          <Chip label="Female" selected={!male} onPress={() => setMale(false)} />
        </View>

        <Card style={{ marginTop: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <Tx dim size={12.5} w="semi">YOUR BMI</Tx>
            <Tx size={13} w="bold" color={catColor}>{cat}</Tx>
          </View>
          <Tx size={44} w="xbold" style={{ marginTop: 6 }}>{bmi ? bmi.toFixed(1) : '—'}</Tx>
          <View style={{ height: 10, borderRadius: 5, marginTop: 12, flexDirection: 'row', overflow: 'hidden' }}>
            <LinearGradient colors={['#4CC3FF', '#A3E635', '#FFB020', '#FF6B5E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }} />
          </View>
          <View style={{ position: 'relative', height: 0 }}>
            <View style={{ position: 'absolute', left: `${bmiPct * 100}%`, top: -16, marginLeft: -2, width: 4, height: 22, borderRadius: 2, backgroundColor: '#FFF' }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Tx dim size={11}>14</Tx><Tx dim size={11}>18.5</Tx><Tx dim size={11}>25</Tx><Tx dim size={11}>30</Tx><Tx dim size={11}>36</Tx>
          </View>
        </Card>

        <SectionHead title="Daily calories" />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Card style={{ flex: 1 }}>
            <Icon name="fire" size={20} color={C.amber} />
            <Tx size={24} w="xbold" style={{ marginTop: 8 }}>{bmr}</Tx>
            <Tx dim size={12} w="semi">BMR — burn at rest</Tx>
          </Card>
          <Card style={{ flex: 1 }}>
            <Icon name="zap" size={20} color={C.lime} />
            <Tx size={24} w="xbold" style={{ marginTop: 8 }}>{tdee}</Tx>
            <Tx dim size={12} w="semi">TDEE — total daily burn</Tx>
          </Card>
        </View>
        <Tx size={13} w="semi" dim style={{ marginTop: 16, marginBottom: 8 }}>Activity level</Tx>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {ACTIVITY.map(x => <Chip key={x.k} label={x.label} selected={act.k === x.k} onPress={() => setAct(x)} />)}
        </View>
        <Card style={{ marginTop: 16 }}>
          <Tx size={14.5} w="bold">Based on your goal</Tx>
          <View style={{ marginTop: 10, gap: 8 }}>
            <Row label="Lose weight" value={`${Math.max(0, tdee - 500)} kcal`} color={C.blue} />
            <Row label="Maintain weight" value={`${tdee} kcal`} color={C.lime} />
            <Row label="Build muscle" value={`${tdee + 300} kcal`} color={C.violet} />
          </View>
          <Tx dim size={12} style={{ marginTop: 12, lineHeight: 17 }}>Protein target: about {Math.round(w * 1.8)} g per day (1.6–2.2 g/kg for muscle goals).</Tx>
        </Card>

        <SectionHead title="Water target" />
        <Card>
          <Tx dim size={13.5} style={{ lineHeight: 19 }}>Based on your weight, your daily water target is <Tx size={13.5} w="bold" color={C.text}>{(w * 0.033).toFixed(1)} litres</Tx> (~{Math.round(w * 0.033 / 0.25)} glasses). Your current goal is {fit.waterGoal} glasses.</Tx>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[6, 8, 10, 12].map(n => <Chip key={n} label={`${n} glasses`} selected={fit.waterGoal === n} onPress={() => fit.setWaterGoal(n)} />)}
          </View>
        </Card>

        <AdBanner style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 10 }} />
      <Tx size={13.5} style={{ flex: 1 }}>{label}</Tx>
      <Tx size={13.5} w="bold">{value}</Tx>
    </View>
  );
}
