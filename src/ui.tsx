import React from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { C, F, R, SHADOW } from './theme';
import { Icon, type IconName } from './icons';
import { workoutImage } from './workoutImages';
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

/** Translucent glass surface — for overlays, tiles and floating elements. */
export function Glass({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.glass, style]}>{children}</View>;
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

/** Solid white button — secondary action over photos (ref-c onboarding). */
export function WhiteButton({ label, onPress, icon }: { label: string; onPress: () => void; icon?: IconName }) {
  return (
    <Pressable onPress={onPress} style={styles.whiteBtn}>
      {icon ? <Icon name={icon} size={18} color={C.ink} /> : null}
      <Text style={{ fontFamily: F.bold, fontSize: 15, color: C.ink }}>{label}</Text>
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

/** Small translucent chip that sits on top of a photo. */
export function PhotoChip({ icon, label }: { icon?: IconName; label: string }) {
  return (
    <View style={styles.photoChip}>
      {icon ? <Icon name={icon} size={13} color="#FFF" /> : null}
      <Text style={{ fontFamily: F.bold, fontSize: 11.5, color: '#FFF' }}>{label}</Text>
    </View>
  );
}

/** Round translucent icon button that floats over a photo. */
export function GlassCircleBtn({ icon, onPress, size = 42, iconSize = 20, iconColor = '#FFF', style }: {
  icon: IconName; onPress: () => void; size?: number; iconSize?: number; iconColor?: string; style?: object;
}) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={[{
      width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center',
      backgroundColor: C.glassDark, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)',
    }, style]}>
      <Icon name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

export function Field({ icon, placeholder, value, onChangeText, secure, keyboard, autoCap, pill }: {
  icon: IconName; placeholder: string; value: string; onChangeText: (t: string) => void;
  secure?: boolean; keyboard?: any; autoCap?: any; pill?: boolean;
}) {
  return (
    <View style={[styles.field, pill ? { borderRadius: R.pill, paddingHorizontal: 18 } : null]}>
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

export function Ring({ size = 150, stroke = 13, progress, color = C.lime, glow = false, trackColor, children }: {
  size?: number; stroke?: number; progress: number; color?: string; glow?: boolean;
  trackColor?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor || C.ringTrack} strokeWidth={stroke} fill="none" />
        {glow ? (
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke + 14} fill="none"
            opacity={0.16} strokeLinecap="round" strokeDasharray={`${circ * p} ${circ}`}
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
        ) : null}
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeLinecap="round" strokeDasharray={`${circ * p} ${circ}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      {children}
    </View>
  );
}

/** Slim horizontal workout row (kept for compact lists). */
export function WorkoutCard({ w, onPress, fav, onFav }: {
  w: Workout; onPress: () => void; fav?: boolean; onFav?: () => void;
}) {
  const img = workoutImage(w.id);
  return (
    <Pressable onPress={onPress} style={styles.wcard}>
      {img ? (
        <Image source={img} style={styles.wimg} resizeMode="cover" />
      ) : (
        <LinearGradient colors={[w.tint + '33', w.tint + '0D']} style={styles.wicon}>
          <Icon name={w.icon} size={30} color={w.tint} strokeWidth={1.9} />
        </LinearGradient>
      )}
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

/** Big full-bleed photo banner card — the Workouts list item (v4). */
export function WorkoutBanner({ w, onPress, fav, onFav }: {
  w: Workout; onPress: () => void; fav?: boolean; onFav?: () => void;
}) {
  const img = workoutImage(w.id);
  return (
    <Pressable onPress={onPress} style={styles.banner}>
      {img ? <Image source={img} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      <LinearGradient colors={['rgba(7,9,11,0.05)', 'rgba(7,9,11,0.55)', 'rgba(7,9,11,0.92)']}
        locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      {onFav ? (
        <View style={{ position: 'absolute', top: 14, right: 14 }}>
          <GlassCircleBtn icon="fav" size={40} iconSize={19} iconColor={fav ? '#FF5E8A' : '#FFF'} onPress={onFav} />
        </View>
      ) : null}
      <View style={{ position: 'absolute', left: 18, right: 18, bottom: 16 }}>
        <Tx size={22} w="xbold" color="#FFF">{w.title}</Tx>
        <Tx size={12.5} w="semi" color="#FFFFFFC9" style={{ marginTop: 3 }}>{w.focus} · {w.level} · {w.exercises.length} exercises</Tx>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <PhotoChip icon="clock" label={`${w.minutes} min`} />
          <PhotoChip icon="fire" label={`${w.kcal} kcal`} />
        </View>
      </View>
    </Pressable>
  );
}

/** Large photo card for horizontal carousels (Home "Popular Workouts"). */
export function PopularCard({ w, onPress, width = 240, height = 170 }: {
  w: Workout; onPress: () => void; width?: number; height?: number;
}) {
  const img = workoutImage(w.id);
  return (
    <Pressable onPress={onPress} style={[styles.popCard, { width, height }]}>
      {img ? <Image source={img} style={StyleSheet.absoluteFill} resizeMode="cover" /> : null}
      <LinearGradient colors={['rgba(7,9,11,0)', 'rgba(7,9,11,0.45)', 'rgba(7,9,11,0.9)']}
        locations={[0.3, 0.62, 1]} style={StyleSheet.absoluteFill} />
      <View style={{ position: 'absolute', top: 12, right: 12 }}>
        <PhotoChip icon="fire" label={`${w.kcal} kcal`} />
      </View>
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 14 }}>
        <Tx size={19} w="xbold" color="#FFF" style={{ lineHeight: 24 }}>{w.title}</Tx>
        <Tx size={12} w="semi" color="#FFFFFFC9" style={{ marginTop: 3 }}>{w.minutes} min · {w.level}</Tx>
      </View>
    </Pressable>
  );
}

export function SectionHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 28, marginBottom: 12 }}>
      <Tx size={19} w="xbold">{title}</Tx>
      {action ? <Pressable onPress={onAction}><Tx size={13} w="semi" color={C.lime}>{action}</Tx></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: 18, ...SHADOW },
  glass: { backgroundColor: C.glass, borderRadius: R.lg, borderWidth: 1, borderColor: C.glassBorder },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: R.pill, paddingVertical: 16 },
  ghost: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: R.pill, paddingVertical: 14, borderWidth: 1, borderColor: C.glassBorder, backgroundColor: C.glass },
  whiteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: R.pill, paddingVertical: 15, backgroundColor: '#FFF' },
  chip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: R.pill, marginRight: 8 },
  chipOn: { backgroundColor: C.lime },
  chipOff: { backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder },
  photoChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: C.glassDark, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)', borderRadius: R.pill, paddingHorizontal: 10, paddingVertical: 5 },
  field: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.glass, borderWidth: 1, borderColor: C.glassBorder, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 4, minHeight: 52 },
  fieldInput: { flex: 1, fontFamily: F.med, fontSize: 15, color: C.text, paddingVertical: 10 },
  wcard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: R.lg, padding: 14, marginBottom: 12, ...SHADOW },
  wicon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  wimg: { width: 78, height: 78, borderRadius: R.md },
  banner: { height: 190, borderRadius: R.xl, overflow: 'hidden', marginBottom: 16, backgroundColor: C.card, ...SHADOW },
  popCard: { borderRadius: R.xl, overflow: 'hidden', backgroundColor: C.card, ...SHADOW },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
