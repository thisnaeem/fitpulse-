import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from './config';
import { useFit } from './store';

/** Auth + cloud sync against the FitPulse API (Vercel + Neon).
 *  Offline-first: everything works signed-out; signing in adds backup/sync. */

export interface User { id: number; email: string; name: string }

interface AuthCtx {
  user: User | null;
  token: string | null;
  ready: boolean;
  backendLive: boolean;
  login: (email: string, password: string) => Promise<string | null>;   // error or null
  register: (name: string, email: string, password: string) => Promise<string | null>;
  loginWithGoogleToken: (idToken: string) => Promise<string | null>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const TOKEN_KEY = 'fitpulse_jwt';
const USER_KEY = 'fitpulse_user';

async function api(path: string, opts: { method?: string; body?: object; token?: string | null } = {}) {
  const r = await fetch(API_URL + path, {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `Request failed (${r.status})`);
  return data;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const fit = useFit();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const backendLive = API_URL.length > 4;

  const pushState = async (tok: string) => {
    const s = fit.snapshot();
    await api('/api/state', {
      method: 'PUT', token: tok,
      body: {
        profile: { goal: s.profile.goal, gender: s.profile.gender, age: s.profile.age, height_cm: s.profile.heightCm, onboarded: s.profile.onboarded },
        state: { waterByDate: s.waterByDate, weights: s.weights, challenge: s.challenge, doneWorkouts: s.doneWorkouts, favorites: s.favorites, sessions: s.sessions, waterGoal: s.waterGoal },
      },
    }).catch(() => {});
  };

  const pullState = async (tok: string) => {
    try {
      const d = await api('/api/state', { token: tok });
      const st = d.state || {};
      if (st.weights || st.challenge || st.sessions) {
        fit.hydrate({
          weights: Array.isArray(st.weights) && st.weights.length ? st.weights : undefined,
          challenge: st.challenge || undefined,
          waterByDate: st.waterByDate || undefined,
          doneWorkouts: typeof st.doneWorkouts === 'number' ? st.doneWorkouts : undefined,
          favorites: st.favorites || undefined,
          sessions: st.sessions || undefined,
          waterGoal: st.waterGoal || undefined,
        });
      }
    } catch { /* keep local state */ }
  };

  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync(TOKEN_KEY);
        const u = await SecureStore.getItemAsync(USER_KEY);
        if (t && u) { setToken(t); tokenRef.current = t; setUser(JSON.parse(u)); }
      } catch { /* no stored session */ }
      setReady(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finishAuth = async (data: any) => {
    setToken(data.token); tokenRef.current = data.token; setUser(data.user);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token).catch(() => {});
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(data.user)).catch(() => {});
    if (data.user?.name) fit.setProfile({ name: data.user.name });
    await pullState(data.token);
    await pushState(data.token);
  };

  const wrap = async (fn: () => Promise<any>) => {
    if (!backendLive) return 'Backend abhi connect nahi hua — deployment ke baad login chalega.';
    try { await fn(); return null; }
    catch (e: any) { return String(e.message || 'Kuch ghalat ho gaya'); }
  };

  const ctx: AuthCtx = {
    user, token, ready, backendLive,
    login: (email, password) => wrap(async () => finishAuth(await api('/api/auth/login', { method: 'POST', body: { email, password } }))),
    register: (name, email, password) => wrap(async () => finishAuth(await api('/api/auth/register', { method: 'POST', body: { name, email, password } }))),
    loginWithGoogleToken: idToken => wrap(async () => finishAuth(await api('/api/auth/google', { method: 'POST', body: { idToken } }))),
    logout: async () => {
      setUser(null); setToken(null); tokenRef.current = null;
      await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
      await SecureStore.deleteItemAsync(USER_KEY).catch(() => {});
    },
    syncNow: async () => { if (tokenRef.current) { await pullState(tokenRef.current); await pushState(tokenRef.current); } },
  };
  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const a = useContext(Ctx);
  if (!a) throw new Error('useAuth outside provider');
  return a;
}
