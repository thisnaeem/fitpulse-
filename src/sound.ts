import { NativeModules } from 'react-native';

// expo-audio is a NATIVE module: present in EAS / dev-client builds but NOT
// in Expo Go. Like src/ads.tsx, it is loaded lazily and only when the native
// module actually exists — in Expo Go (or if anything goes wrong) every
// sound silently no-ops and the rest of the app runs normally.
let Audio: any = null;
try {
  if (NativeModules.ExpoAudio) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Audio = require('expo-audio');
  }
} catch {
  Audio = null;
}

type SoundName = 'tick' | 'beep' | 'go' | 'rest' | 'finish' | 'tap' | 'success';

// Static requires so Metro bundles the wav assets.
const SOURCES: Record<SoundName, number> = {
  tick: require('../assets/sounds/tick.wav'),
  beep: require('../assets/sounds/beep.wav'),
  go: require('../assets/sounds/go.wav'),
  rest: require('../assets/sounds/rest.wav'),
  finish: require('../assets/sounds/finish.wav'),
  tap: require('../assets/sounds/tap.wav'),
  success: require('../assets/sounds/success.wav'),
};

// Preload one player per sound at module init (guarded — never throws).
const players = new Map<SoundName, any>();
if (Audio) {
  try {
    (Object.keys(SOURCES) as SoundName[]).forEach(name => {
      try {
        players.set(name, Audio.createAudioPlayer(SOURCES[name]));
      } catch { /* that one sound just stays silent */ }
    });
  } catch {
    players.clear();
  }
}

let enabled = true;
export function setSoundEnabled(v: boolean) {
  enabled = v;
}

function play(name: SoundName) {
  if (!enabled) return;
  const p = players.get(name);
  if (!p) return;
  try {
    // Rewind, then play — safe to call while a previous play is still going.
    const r = p.seekTo(0);
    if (r && typeof r.catch === 'function') r.catch(() => {});
    p.play();
  } catch { /* sound is garnish — never break the flow */ }
}

export const sounds = {
  tick: () => play('tick'),
  beep: () => play('beep'),
  go: () => play('go'),
  rest: () => play('rest'),
  finish: () => play('finish'),
  tap: () => play('tap'),
  success: () => play('success'),
};
