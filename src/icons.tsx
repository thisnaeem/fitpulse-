import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react-native';
// Deep per-icon imports — Metro only bundles the icons we actually use.
import Home01Icon from '@hugeicons/core-free-icons/Home01Icon';
import FireIcon from '@hugeicons/core-free-icons/FireIcon';
import DropletIcon from '@hugeicons/core-free-icons/DropletIcon';
import CalculatorIcon from '@hugeicons/core-free-icons/CalculatorIcon';
import ChartLineData01Icon from '@hugeicons/core-free-icons/ChartLineData01Icon';
import PlayIcon from '@hugeicons/core-free-icons/PlayIcon';
import PauseIcon from '@hugeicons/core-free-icons/PauseIcon';
import UserIcon from '@hugeicons/core-free-icons/UserIcon';
import Search01Icon from '@hugeicons/core-free-icons/Search01Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import Award01Icon from '@hugeicons/core-free-icons/Award01Icon';
import Calendar01Icon from '@hugeicons/core-free-icons/Calendar01Icon';
import Logout01Icon from '@hugeicons/core-free-icons/Logout01Icon';
import Dumbbell01Icon from '@hugeicons/core-free-icons/Dumbbell01Icon';
import HeartIcon from '@hugeicons/core-free-icons/HeartIcon';
import FavouriteIcon from '@hugeicons/core-free-icons/FavouriteIcon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import CheckmarkCircle02Icon from '@hugeicons/core-free-icons/CheckmarkCircle02Icon';
import PlusSignIcon from '@hugeicons/core-free-icons/PlusSignIcon';
import MinusSignIcon from '@hugeicons/core-free-icons/MinusSignIcon';
import Settings01Icon from '@hugeicons/core-free-icons/Settings01Icon';
import FlameIcon from '@hugeicons/core-free-icons/FlameIcon';
import SparklesIcon from '@hugeicons/core-free-icons/SparklesIcon';
import Target01Icon from '@hugeicons/core-free-icons/Target01Icon';
import WeightIcon from '@hugeicons/core-free-icons/WeightIcon';
import Timer01Icon from '@hugeicons/core-free-icons/Timer01Icon';
import ZapIcon from '@hugeicons/core-free-icons/ZapIcon';
import GlassWaterIcon from '@hugeicons/core-free-icons/GlassWaterIcon';
import Medal01Icon from '@hugeicons/core-free-icons/Medal01Icon';
import TrophyIcon from '@hugeicons/core-free-icons/TrophyIcon';
import GoogleIcon from '@hugeicons/core-free-icons/GoogleIcon';
import Mail01Icon from '@hugeicons/core-free-icons/Mail01Icon';
import LockPasswordIcon from '@hugeicons/core-free-icons/LockPasswordIcon';
import EyeIcon from '@hugeicons/core-free-icons/EyeIcon';
import ViewOffIcon from '@hugeicons/core-free-icons/ViewOffIcon';
import ChevronRightIcon from '@hugeicons/core-free-icons/ChevronRightIcon';
import BodyPartMuscleIcon from '@hugeicons/core-free-icons/BodyPartMuscleIcon';
import Yoga01Icon from '@hugeicons/core-free-icons/Yoga01Icon';
import WorkoutRunIcon from '@hugeicons/core-free-icons/WorkoutRunIcon';
import Notification01Icon from '@hugeicons/core-free-icons/Notification01Icon';
import Share01Icon from '@hugeicons/core-free-icons/Share01Icon';
import StarIcon from '@hugeicons/core-free-icons/StarIcon';

const MAP = {
  home: Home01Icon, fire: FireIcon, drop: DropletIcon, calc: CalculatorIcon,
  chart: ChartLineData01Icon, play: PlayIcon, pause: PauseIcon, user: UserIcon,
  search: Search01Icon, clock: Clock01Icon, award: Award01Icon,
  calendar: Calendar01Icon, logout: Logout01Icon, dumbbell: Dumbbell01Icon,
  heart: HeartIcon, fav: FavouriteIcon, right: ArrowRight01Icon,
  left: ArrowLeft01Icon, check: CheckmarkCircle02Icon, plus: PlusSignIcon,
  minus: MinusSignIcon, settings: Settings01Icon, flame: FlameIcon,
  sparkles: SparklesIcon, target: Target01Icon, weight: WeightIcon,
  timer: Timer01Icon, zap: ZapIcon, water: GlassWaterIcon, medal: Medal01Icon,
  trophy: TrophyIcon, google: GoogleIcon, mail: Mail01Icon, lock: LockPasswordIcon,
  eye: EyeIcon, eyeOff: ViewOffIcon, chevron: ChevronRightIcon,
  muscle: BodyPartMuscleIcon, yoga: Yoga01Icon, run: WorkoutRunIcon,
  bell: Notification01Icon, share: Share01Icon, star: StarIcon,
} as const;

export type IconName = keyof typeof MAP;

export function Icon({ name, size = 22, color = '#F4F7F8', strokeWidth = 1.8 }: {
  name: IconName; size?: number; color?: string; strokeWidth?: number;
}) {
  return <HugeiconsIcon icon={MAP[name]} size={size} color={color} strokeWidth={strokeWidth} />;
}
