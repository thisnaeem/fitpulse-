import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { levelFromXp, xpForWorkout } from './game';

/** FitPulse store — offline-first on-device state. When the user signs in,
 *  this state is synced to the Neon backend via src/auth.tsx (push/pull). */

export interface Profile {
  name: string;
  goal: 'lose_weight' | 'build_muscle' | 'stay_fit';
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  onboarded: boolean;
}

export interface Session {
  workoutId: string;
  title: string;
  minutes: number;
  kcal: number;
  date: string; // ISO
}

export interface CompletionResult {
  xpEarned: number;
  streakDays: number;
  leveledUp: boolean;
  newLevel: number;
}

export interface FitStore {
  loaded: boolean;
  profile: Profile;
  waterByDate: Record<string, number>;
  weights: number[];
  challenge: number[];
  doneWorkouts: number;
  favorites: string[];
  sessions: Session[];
  waterGoal: number;
  xp: number;
  streakDays: number;
  lastDoneDate: string | null;
  totalMinutes: number;
  setProfile: (p: Partial<Profile>) => void;
  setWaterToday: (n: number) => void;
  waterToday: number;
  addWeight: (n: number) => void;
  toggleChallengeDay: (day: number) => void;
  addDoneWorkout: (s: Session) => CompletionResult;
  toggleFavorite: (id: string) => void;
  setWaterGoal: (n: number) => void;
  hydrate: (snap: Partial<Snapshot>) => void;
  snapshot: () => Snapshot;
}

export interface Snapshot {
  profile: Profile; waterByDate: Record<string, number>; weights: number[];
  challenge: number[]; doneWorkouts: number; favorites: string[];
  sessions: Session[]; waterGoal: number;
  xp: number; streakDays: number; lastDoneDate: string | null; totalMinutes: number;
}

const DEFAULT_PROFILE: Profile = { name: '', goal: 'stay_fit', gender: 'male', age: 25, heightCm: 170, onboarded: false };
const DEFAULT_WEIGHTS = [72.5, 72.1, 71.8];
const KEY = 'fitpulse_v2';
const Ctx = createContext<FitStore | null>(null);
export const todayKey = () => new Date().toISOString().slice(0, 10);

/** Local calendar date as YYYY-MM-DD (device timezone — used for streaks). */
export const localDateKey = (d: Date = new Date()) => {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export function FitStoreProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [waterByDate, setWaterByDate] = useState<Record<string, number>>({});
  const [weights, setWeights] = useState<number[]>(DEFAULT_WEIGHTS);
  const [challenge, setChallenge] = useState<number[]>([]);
  const [doneWorkouts, setDoneWorkouts] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [waterGoal, setWaterGoalState] = useState(8);
  const [xp, setXp] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [lastDoneDate, setLastDoneDate] = useState<string | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const stateRef = useRef<Snapshot | null>(null);

  const snapshot = (): Snapshot => ({
    profile, waterByDate, weights, challenge, doneWorkouts, favorites, sessions, waterGoal,
    xp, streakDays, lastDoneDate, totalMinutes,
  });
  stateRef.current = snapshot();

  const persist = (snap: Snapshot) => { AsyncStorage.setItem(KEY, JSON.stringify(snap)).catch(() => {}); };
  const update = (fn: (s: Snapshot) => Snapshot) => {
    const next = fn(stateRef.current || snapshot());
    stateRef.current = next;
    setProfileState(next.profile); setWaterByDate(next.waterByDate); setWeights(next.weights);
    setChallenge(next.challenge); setDoneWorkouts(next.doneWorkouts); setFavorites(next.favorites);
    setSessions(next.sessions); setWaterGoalState(next.waterGoal);
    setXp(next.xp ?? 0); setStreakDays(next.streakDays ?? 0);
    setLastDoneDate(next.lastDoneDate ?? null); setTotalMinutes(next.totalMinutes ?? 0);
    persist(next);
  };

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const s = JSON.parse(raw);
          // Defaults-merge: older saves predate the gamification fields, so
          // any missing key simply keeps its default from `prev`.
          update(prev => ({
            ...prev, ...s,
            profile: { ...DEFAULT_PROFILE, ...(s.profile || {}) },
            xp: typeof s.xp === 'number' ? s.xp : prev.xp,
            streakDays: typeof s.streakDays === 'number' ? s.streakDays : prev.streakDays,
            lastDoneDate: typeof s.lastDoneDate === 'string' ? s.lastDoneDate : prev.lastDoneDate,
            totalMinutes: typeof s.totalMinutes === 'number' ? s.totalMinutes : prev.totalMinutes,
          }));
        } else {
          // migrate v1 keys if present
          const [w, wt, ch, dn] = await Promise.all([
            AsyncStorage.getItem('water'), AsyncStorage.getItem('weights'),
            AsyncStorage.getItem('challenge'), AsyncStorage.getItem('done')]);
          if (w || wt || ch || dn) {
            update(prev => ({
              ...prev,
              waterByDate: w ? { [todayKey()]: parseInt(w) || 0 } : {},
              weights: wt ? JSON.parse(wt) : prev.weights,
              challenge: ch ? JSON.parse(ch) : [],
              doneWorkouts: dn ? parseInt(dn) || 0 : 0,
            }));
          }
        }
      } catch { /* start fresh */ }
      setLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const store: FitStore = {
    loaded, profile, waterByDate, weights, challenge, doneWorkouts, favorites, sessions, waterGoal,
    xp, streakDays, lastDoneDate, totalMinutes,
    waterToday: waterByDate[todayKey()] || 0,
    setProfile: p => update(s => ({ ...s, profile: { ...s.profile, ...p } })),
    setWaterToday: n => update(s => ({ ...s, waterByDate: { ...s.waterByDate, [todayKey()]: Math.max(0, Math.min(30, n)) } })),
    addWeight: n => update(s => ({ ...s, weights: [...s.weights, n] })),
    toggleChallengeDay: d => update(s => ({
      ...s, challenge: s.challenge.includes(d) ? s.challenge.filter(x => x !== d) : [...s.challenge, d].sort((a, b) => a - b),
    })),
    addDoneWorkout: sess => {
      let result: CompletionResult = { xpEarned: 0, streakDays: 0, leveledUp: false, newLevel: 1 };
      update(s => {
        const minutes = Math.max(0, sess.minutes || 0);
        const xpEarned = xpForWorkout(minutes);
        const today = localDateKey();
        const yesterday = localDateKey(new Date(Date.now() - 86400000));
        let streak = s.streakDays ?? 0;
        if (s.lastDoneDate === today) {
          // already trained today — streak unchanged
        } else if (s.lastDoneDate === yesterday) {
          streak += 1;
        } else {
          streak = 1;
        }
        const prevLevel = levelFromXp(s.xp ?? 0).level;
        const newXp = (s.xp ?? 0) + xpEarned;
        const newLevel = levelFromXp(newXp).level;
        result = { xpEarned, streakDays: streak, leveledUp: newLevel > prevLevel, newLevel };
        return {
          ...s,
          doneWorkouts: s.doneWorkouts + 1,
          sessions: [sess, ...s.sessions].slice(0, 60),
          xp: newXp,
          streakDays: streak,
          lastDoneDate: today,
          totalMinutes: (s.totalMinutes ?? 0) + minutes,
        };
      });
      return result;
    },
    toggleFavorite: id => update(s => ({
      ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id],
    })),
    setWaterGoal: n => update(s => ({ ...s, waterGoal: Math.max(4, Math.min(20, n)) })),
    hydrate: snap => update(s => ({
      ...s, ...snap,
      profile: { ...s.profile, ...(snap.profile || {}) },
      xp: typeof snap.xp === 'number' ? snap.xp : s.xp,
      streakDays: typeof snap.streakDays === 'number' ? snap.streakDays : s.streakDays,
      lastDoneDate: typeof snap.lastDoneDate === 'string' ? snap.lastDoneDate : s.lastDoneDate,
      totalMinutes: typeof snap.totalMinutes === 'number' ? snap.totalMinutes : s.totalMinutes,
    })),
    snapshot,
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useFit() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useFit outside provider');
  return s;
}
