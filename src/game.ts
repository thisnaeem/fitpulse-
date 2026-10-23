import type { Achievement } from './data';

/** Gamification engine — XP, levels and achievement evaluation.
 *  Pure functions over the store's game stats; no React, no storage. */

// Cumulative XP required to REACH each level (index 0 = level 1).
export const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
export const LEVEL_TITLES = [
  'Beginner', 'Starter', 'Mover', 'Grinder', 'Warrior',
  'Athlete', 'Beast', 'Champion', 'Elite', 'Legend',
];
// Beyond level 10 each new level needs this much extra cumulative XP.
const XP_STEP_BEYOND = 800;

export interface LevelInfo {
  level: number;
  title: string;
  into: number;    // XP earned inside the current level
  needed: number;  // XP span of the current level
  progress: number; // 0..1 through the current level
}

/** Cumulative XP threshold for reaching `level` (1-based). */
export function levelThreshold(level: number): number {
  if (level <= 1) return 0;
  if (level <= LEVEL_XP.length) return LEVEL_XP[level - 1];
  return LEVEL_XP[LEVEL_XP.length - 1] + XP_STEP_BEYOND * (level - LEVEL_XP.length);
}

export function levelFromXp(xp: number): LevelInfo {
  const safe = Math.max(0, Math.floor(xp || 0));
  let level = 1;
  while (levelThreshold(level + 1) <= safe) level += 1;
  const base = levelThreshold(level);
  const needed = levelThreshold(level + 1) - base;
  const into = safe - base;
  return {
    level,
    title: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1],
    into,
    needed,
    progress: needed > 0 ? Math.min(1, into / needed) : 1,
  };
}

/** XP awarded for finishing a workout: flat base + per-minute bonus. */
export function xpForWorkout(minutes: number): number {
  return Math.round(40 + 2 * Math.max(0, minutes || 0));
}

export interface GameStats {
  doneWorkouts: number;
  streakDays: number;
  xp: number;
  weightsCount: number;
  challengeDays: number;
}

/** The live value an achievement is measured against. */
export function achievementValue(a: Achievement, s: GameStats): number {
  switch (a.kind) {
    case 'streak': return s.streakDays;
    case 'xp': return s.xp;
    case 'weights': return s.weightsCount;
    case 'challenge': return s.challengeDays;
    case 'workouts':
    default: return s.doneWorkouts;
  }
}

export function isAchievementUnlocked(a: Achievement, s: GameStats): boolean {
  return achievementValue(a, s) >= a.need;
}
