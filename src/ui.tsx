import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { C, F, R, SHADOW } from './theme';
import { Icon, type IconName } from './icons';
import type { Workout } from './data';

export function Tx({ children, style, dim, size = 14, w = 'med', color }: {
  children: React.ReactNode; style?: object; dim?: boolean; size?: number;
  w?: 'reg' | 'med' | 'semi' | 'bold' | 'xbold'; color?: string;
}) {
  const fontFamily = { reg: F.reg, med: F.med, semi: F.semi, bold: F.bold, xbold: F.xbold }[w];
  return <Text style={[{ fontFamily, fontSize: size, color: color || (dim ? C.muted : C.text) }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function PrimaryButton({ label, onPress, icon, disabled }: {
  label: string; onPress: () => void; icon?: IconName; disabled?: boolean;
}) {
  return (
    <Pressable onPress={disabled ? undefined : onPress} style={{ opacity: disabled ? 0.5 : 1 }}>
      <LinearGradient colors={[C.lime2, C.lime]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.primary}>
        {icon ? <Icon name={icon} size={20} color={C.ink} strokeWidth={2.2} /> : null}
        <Text style={{ fontFamily: F.xbold, fontSize: 16, color: C.ink }}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  return (
    <Pressable onPress={onPress} style={styles.ghost}>
      {icon ? <Icon name={icon} size={18} color={C.text} /> : null}
      <Text style={{ fontFamily: F.semi, fontSize: 14, color: C.text }}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}>
      <Text style={{ fontFamily: F.semi, fontSize: 12.5, color: selected ? C.ink : C.muted }}>{label}</Text>
    </Pressable>
  );
}

export function Field({ icon, placeholder, value, onChangeText, secure, keyboard, autoCap }: {
  icon: IconName; placeholder: string; value: string; onChangeText: (t: string) => void;
  secure?: boolean; keyboard?: any; autoCap?: any;
}) {
  return (
    <View style={styles.field}>
      <Icon name={icon} size={19} color={C.faint} />
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor={C.faint}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        keyboardType={keyboard || 'default'}
        autoCapitalize={autoCap || 'none'}
        autoCorrect={false}
      />
    </View>
  );
}

export function NumField({ label, value, onChange, unit }: {
  label: string; value: string; onChange: (t: string) => void; unit?: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Tx dim size={12} w="semi" style={{ marginBottom: 6 }}>{label}</Tx>
      <View style={[styles.field, { paddingHorizontal: 12 }]}>
        <TextInput
          style={[styles.fieldInput, { textAlign: 'center', fontFamily: F.bold, fontSize: 17 }]}
          value={value} onChangeText={onChange} keyboardType="decimal-pad"
          placeholderTextColor={C.faint} placeholder="0"
        />
        {unit ? <Tx dim size={12}>{unit}</Tx> : null}
      </View>
    </View>
  );
}

export function Ring({ size = 150, stroke = 13, progress, color = C.lime, children }: {
  size?: number; stroke?: number; progress: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.ringTrack} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={`${circ * p} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      {children}
    </View>
  );
}

export function WorkoutCard({ w, onPress, fav, onFav }: {
  w: Workout; onPress: () => void; fav?: boolean; onFav?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.wcard}>
      <LinearGradient colors={[w.tint + '33', w.tint + '0D']} style={styles.wicon}>
        <Icon name={w.icon} size={30} color={w.tint} strokeWidth={1.9} />
      </LinearGradient>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <Tx size={16} w="bold">{w.title}</Tx>
        <Tx dim size={12.5} style={{ marginTop: 3 }}>{w.focus} · {w.level}</Tx>
        <View style={{ flexDirection: 'row', gap: 14, marginTop: 7 }}>
          <View style={styles.meta}><Icon name="clock" size={14} color={C.faint} /><Tx dim size={12}>{w.minutes} min</Tx></View>
          <View style={styles.meta}><Icon name="fire" size={14} color={C.faint} /><Tx dim size={12}>{w.kcal} kcal</Tx></View>
          <View style={styles.meta}><Icon name="dumbbell" size={14} color={C.faint} /><Tx dim size={12}>{w.exercises.length} moves</Tx></View>
        </View>
      </View>
      {onFav ? (
        <Pressable onPress={onFav} hitSlop={10} style={{ padding: 4 }}>
          <Icon name="fav" size={21} color={fav ? '#FF5E8A' : C.faint} />
        </Pressable>
      ) : null}
    </Pressable>
  );
}

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 26, marginBottom: 12 }}>
      <Tx size={18} w="xbold">{title}</Tx>
      {action ? <Pressable onPress={onAction}><Tx size={13} w="semi" color={C.lime}>{action}</Tx></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: 18, ...SHADOW },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: R.md, paddingVertical: 15 },
  ghost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: R.md, paddingVertical: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.card },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: R.pill, marginRight: 8 },
  chipOn: { backgroundColor: C.lime },
  chipOff: { backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 4, minHeight: 52 },
  fieldInput: { flex: 1, fontFamily: F.med, fontSize: 15, color: C.text, paddingVertical: 10 },
  wcard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.lg, padding: 14, marginBottom: 12, ...SHADOW },
  wicon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
