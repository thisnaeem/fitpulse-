import type { IconName } from './icons';

export interface Exercise {
  name: string;
  detail: string;   // "x 12" or "40 sec"
  seconds: number;  // timer duration in the player
  muscle: string;
  tip: string;
}

export interface Workout {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  minutes: number;
  kcal: number;
  icon: IconName;
  tint: string;     // accent color for cards/hero
  focus: string;
  desc: string;
  exercises: Exercise[];
}

const ex = (name: string, detail: string, seconds: number, muscle: string, tip: string): Exercise =>
  ({ name, detail, seconds, muscle, tip });

export const WORKOUTS: Workout[] = [
  {
    id: 'fullbody', title: 'Full Body Burn', level: 'Beginner', minutes: 22, kcal: 180,
    icon: 'flame', tint: '#FF7A45', focus: 'Full body',
    desc: 'A complete starter routine that wakes up every major muscle group — no equipment needed.',
    exercises: [
      ex('Jumping Jacks', '40 sec', 40, 'Full body', 'Keep a light bounce and land softly through your heels.'),
      ex('Push-Ups', 'x 12', 30, 'Chest', 'Keep your body in one straight line, core tight.'),
      ex('Squats', 'x 15', 40, 'Legs', 'Heels on the floor, knees tracking in line with your toes.'),
      ex('Mountain Climbers', '30 sec', 30, 'Core', 'Keep your hips stable and build the speed up slowly.'),
      ex('Lunges', 'x 10 each leg', 40, 'Legs', 'Front knee at 90 degrees, torso tall.'),
      ex('Plank', '30 sec', 30, 'Core', 'Neutral neck — hips neither sagging nor piked.'),
      ex('Burpees', 'x 8', 40, 'Full body', 'Every rep under full control — form first, speed later.'),
      ex('High Knees', '30 sec', 30, 'Cardio', 'Drive your knees up to hip height.'),
    ],
  },
  {
    id: 'abs', title: 'Abs & Core Crusher', level: 'Intermediate', minutes: 15, kcal: 120,
    icon: 'target', tint: '#4CC3FF', focus: 'Core',
    desc: 'The foundation of a strong core — deep core work that also improves posture and balance.',
    exercises: [
      ex('Crunches', 'x 20', 40, 'Abs', "Don't pull on your neck — lift from your abs."),
      ex('Russian Twists', 'x 16', 40, 'Obliques', 'Lift your feet slightly and twist fully to both sides.'),
      ex('Leg Raises', 'x 12', 40, 'Lower abs', 'Keep your lower back glued to the floor.'),
      ex('Bicycle Crunches', 'x 20', 40, 'Abs', 'Touch elbow to opposite knee — no rushing.'),
      ex('Plank', '45 sec', 45, 'Core', 'Breathe evenly and keep your hips level.'),
      ex('Side Plank', '30 sec each side', 60, 'Obliques', "Body in one line — don't let your hips drop."),
      ex('Dead Bug', 'x 12', 40, 'Deep core', 'Move opposite arm and leg together, slowly.'),
    ],
  },
  {
    id: 'hiit', title: 'HIIT Fat Blast', level: 'Advanced', minutes: 18, kcal: 240,
    icon: 'zap', tint: '#FFB020', focus: 'Cardio',
    desc: 'High-intensity intervals — maximum calorie burn in minimum time, with a real afterburn effect.',
    exercises: [
      ex('Burpees', '40 sec', 40, 'Full body', 'Jump with a full extension on every rep.'),
      ex('Jump Squats', '40 sec', 40, 'Legs', 'Land softly and go straight into the next rep.'),
      ex('Mountain Climbers', '40 sec', 40, 'Core', 'Maximum speed, hips stay stable.'),
      ex('Skater Jumps', '40 sec', 40, 'Legs', 'Side to side — control your balance.'),
      ex('High Knees', '40 sec', 40, 'Cardio', 'Pump your arms as you run.'),
      ex('Plank Jacks', '40 sec', 40, 'Core', 'Hold the plank while your feet jump in and out.'),
      ex('Tuck Jumps', '30 sec', 30, 'Power', 'Pull your knees up toward your chest.'),
    ],
  },
  {
    id: 'legs', title: 'Legs & Glutes Power', level: 'Intermediate', minutes: 20, kcal: 190,
    icon: 'run', tint: '#B78CFF', focus: 'Lower body',
    desc: 'A focused lower-body session for stronger, shapelier legs and glutes.',
    exercises: [
      ex('Squats', 'x 18', 40, 'Quads', 'Weight in your heels, chest up.'),
      ex('Reverse Lunges', 'x 12 each', 45, 'Glutes', 'Step back and keep the front knee stable.'),
      ex('Glute Bridge', 'x 20', 40, 'Glutes', 'Pause 2 seconds at the top and squeeze.'),
      ex('Wall Sit', '45 sec', 45, 'Quads', 'Back flat against the wall, knees at 90 degrees.'),
      ex('Calf Raises', 'x 25', 40, 'Calves', 'Full range — pause at the top, lower slowly.'),
      ex('Sumo Squats', 'x 15', 40, 'Inner thigh', 'Feet wide, toes turned out.'),
      ex('Single-Leg Bridge', 'x 10 each', 40, 'Glutes', "Keep your hips level — don't wobble."),
    ],
  },
  {
    id: 'chest', title: 'Chest & Arms Builder', level: 'Intermediate', minutes: 17, kcal: 140,
    icon: 'muscle', tint: '#FF6B5E', focus: 'Upper body',
    desc: 'Push-up variations that build your chest, shoulders and triceps — a full upper-body workout at home.',
    exercises: [
      ex('Push-Ups', 'x 15', 40, 'Chest', 'Full range — chest close to the floor.'),
      ex('Wide Push-Ups', 'x 12', 40, 'Outer chest', 'Hands wider than your shoulders.'),
      ex('Diamond Push-Ups', 'x 10', 40, 'Triceps', 'Make a diamond shape with your hands.'),
      ex('Pike Push-Ups', 'x 10', 40, 'Shoulders', 'Hips high, head moving toward the floor.'),
      ex('Chair Dips', 'x 14', 40, 'Triceps', 'Elbows point straight back as you dip.'),
      ex('Plank to Push-Up', 'x 10', 45, 'Arms + core', 'Alternate the leading arm on every rep.'),
      ex('Shoulder Taps', 'x 20', 40, 'Shoulders', "Don't let your hips sway."),
    ],
  },
  {
    id: 'yoga', title: 'Morning Yoga Flow', level: 'Beginner', minutes: 16, kcal: 70,
    icon: 'yoga', tint: '#7FE0B2', focus: 'Flexibility',
    desc: 'A gentle morning flow — open up your body, calm your mind, start the day fresh.',
    exercises: [
      ex('Cat-Cow Stretch', '60 sec', 60, 'Spine', 'Move with your breath — in and out.'),
      ex('Downward Dog', '45 sec', 45, 'Full body', 'Press your heels toward the floor.'),
      ex("Child's Pose", '60 sec', 60, 'Back', 'Forehead down, breathe deeply.'),
      ex('Warrior I', '40 sec each', 80, 'Legs', 'Hips facing forward, arms reaching up.'),
      ex('Warrior II', '40 sec each', 80, 'Legs', 'Gaze over your front hand.'),
      ex('Bridge Pose', '45 sec', 45, 'Glutes', 'Lift your hips as you exhale.'),
      ex('Seated Twist', '40 sec each', 80, 'Spine', 'Twist a little deeper with every exhale.'),
      ex('Deep Breathing', '60 sec', 60, 'Mind', '4 seconds in, hold for 4, out for 6.'),
    ],
  },
  {
    id: 'cardio', title: 'Cardio Sweat Party', level: 'Beginner', minutes: 14, kcal: 150,
    icon: 'heart', tint: '#FF5E8A', focus: 'Cardio',
    desc: 'Fun, low-impact cardio for heart health and stamina.',
    exercises: [
      ex('March in Place', '60 sec', 60, 'Warm-up', 'Swing your arms and keep your posture tall.'),
      ex('Step Touch', '60 sec', 60, 'Legs', 'Side to side in a light rhythm.'),
      ex('Butt Kicks', '45 sec', 45, 'Hamstrings', 'Heels kick up toward your glutes.'),
      ex('Boxer Shuffle', '60 sec', 60, 'Full body', 'Light bounce, throw punches into the air.'),
      ex('Side Lunges', 'x 12', 45, 'Legs', 'Sit into one side, other leg stays straight.'),
      ex('Standing Cross Crunch', 'x 20', 45, 'Core', 'Bring elbow to opposite knee while standing.'),
    ],
  },
  {
    id: 'strength', title: 'Bodyweight Strength', level: 'Advanced', minutes: 25, kcal: 210,
    icon: 'dumbbell', tint: '#A3E635', focus: 'Strength',
    desc: 'Real strength from bodyweight alone — slow reps, full control, maximum tension.',
    exercises: [
      ex('Archer Push-Ups', 'x 8 each', 50, 'Chest', 'One arm straight, push with the other.'),
      ex('Pistol Squat Practice', 'x 6 each', 50, 'Legs', 'Use a chair for support if you need it.'),
      ex('Decline Push-Ups', 'x 12', 40, 'Upper chest', 'Feet on a chair, body in one line.'),
      ex('Hollow Body Hold', '40 sec', 40, 'Core', 'Lower back pressed down, body shaped like a boat.'),
      ex('Superman Pull', 'x 14', 40, 'Back', 'Pull your arms from front to back.'),
      ex('L-Sit Practice', '30 sec', 30, 'Core + hip', 'Sit on the floor and lift your heels.'),
      ex('Wall Handstand Hold', '40 sec', 40, 'Shoulders', 'Against the wall, breathe evenly.'),
    ],
  },
  {
    id: 'stretch', title: 'Evening Stretch & Recovery', level: 'Beginner', minutes: 12, kcal: 45,
    icon: 'sparkles', tint: '#8AB8FF', focus: 'Recovery',
    desc: "Release the day's tension before bed — better sleep and better recovery.",
    exercises: [
      ex('Neck Rolls', '40 sec', 40, 'Neck', 'Very slowly — no jerking.'),
      ex('Shoulder Stretch', '30 sec each', 60, 'Shoulders', 'Arm across your chest, gentle pressure.'),
      ex('Cat-Cow Stretch', '60 sec', 60, 'Spine', 'Flow with your breath.'),
      ex('Pigeon Pose', '60 sec each', 120, 'Hips', 'A deep hip opener — ease into it.'),
      ex('Hamstring Stretch', '45 sec each', 90, 'Hamstrings', 'Back straight, hinge from the hips.'),
      ex('Lying Spinal Twist', '60 sec each', 120, 'Back', 'Keep both shoulders on the floor.'),
      ex('Deep Breathing', '60 sec', 60, 'Mind', 'Long, slow exhales — end the day calm.'),
    ],
  },
  {
    id: 'quick7', title: '7-Minute Quick Fix', level: 'Beginner', minutes: 7, kcal: 80,
    icon: 'timer', tint: '#FFD84D', focus: 'Quick',
    desc: "Short on time? This classic 7-minute full-body circuit is made for you.",
    exercises: [
      ex('Jumping Jacks', '30 sec', 30, 'Full body', 'Start with full energy.'),
      ex('Wall Sit', '30 sec', 30, 'Legs', 'Knees at 90 degrees, back on the wall.'),
      ex('Push-Ups', '30 sec', 30, 'Chest', 'As many as you can with good form.'),
      ex('Crunches', '30 sec', 30, 'Abs', 'Neck relaxed — work from your abs.'),
      ex('Step-Ups (Chair)', '30 sec', 30, 'Legs', 'Use a sturdy chair.'),
      ex('Squats', '30 sec', 30, 'Legs', 'Heels down, chest up.'),
      ex('Plank', '30 sec', 30, 'Core', 'Final push — keep your body in line.'),
    ],
  },
];

export const WEEK_PLAN = [
  { day: 'Mon', workoutId: 'fullbody' },
  { day: 'Tue', workoutId: 'abs' },
  { day: 'Wed', workoutId: 'yoga' },
  { day: 'Thu', workoutId: 'legs' },
  { day: 'Fri', workoutId: 'hiit' },
  { day: 'Sat', workoutId: 'cardio' },
  { day: 'Sun', workoutId: 'stretch' },
];

export const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const;

export type AchievementKind = 'workouts' | 'streak' | 'xp' | 'weights' | 'challenge';

export interface Achievement { id: string; title: string; desc: string; icon: IconName; need: number; kind: AchievementKind }
export const ACHIEVEMENTS: Achievement[] = [
  // Workout count
  { id: 'first', title: 'First Step', desc: 'Complete your first workout', icon: 'sparkles', need: 1, kind: 'workouts' },
  { id: 'five', title: 'Getting Warm', desc: 'Complete 5 workouts', icon: 'flame', need: 5, kind: 'workouts' },
  { id: 'ten', title: 'On Fire', desc: 'Complete 10 workouts', icon: 'fire', need: 10, kind: 'workouts' },
  { id: 'twentyfive', title: 'Unstoppable', desc: 'Complete 25 workouts', icon: 'trophy', need: 25, kind: 'workouts' },
  { id: 'fifty', title: 'FitPulse Pro', desc: 'Complete 50 workouts', icon: 'medal', need: 50, kind: 'workouts' },
  // Day streaks
  { id: 'streak3', title: 'Hat Trick', desc: 'Reach a 3-day streak', icon: 'calendar', need: 3, kind: 'streak' },
  { id: 'streak7', title: 'Week Warrior', desc: 'Reach a 7-day streak', icon: 'flame', need: 7, kind: 'streak' },
  { id: 'streak14', title: 'Two-Week Machine', desc: 'Reach a 14-day streak', icon: 'fire', need: 14, kind: 'streak' },
  { id: 'streak30', title: 'Unbreakable', desc: 'Reach a 30-day streak', icon: 'award', need: 30, kind: 'streak' },
  // Total XP
  { id: 'xp500', title: 'XP Hunter', desc: 'Earn 500 total XP', icon: 'star', need: 500, kind: 'xp' },
  { id: 'xp1500', title: 'XP Machine', desc: 'Earn 1,500 total XP', icon: 'zap', need: 1500, kind: 'xp' },
  { id: 'xp3000', title: 'XP Legend', desc: 'Earn 3,000 total XP', icon: 'muscle', need: 3000, kind: 'xp' },
  // Weight tracking
  { id: 'weights5', title: 'Self Tracker', desc: 'Log your weight 5 times', icon: 'weight', need: 5, kind: 'weights' },
  // 30-day challenge
  { id: 'challenge7', title: 'Challenger', desc: 'Mark 7 challenge days', icon: 'check', need: 7, kind: 'challenge' },
  { id: 'challenge15', title: 'Halfway Hero', desc: 'Mark 15 challenge days', icon: 'target', need: 15, kind: 'challenge' },
  { id: 'challenge30', title: 'Challenge Champion', desc: 'Complete the 30-day challenge', icon: 'trophy', need: 30, kind: 'challenge' },
];

export const workoutById = (id: string) => WORKOUTS.find(w => w.id === id) || WORKOUTS[0];
export const todayWorkout = () => {
  const idx = (new Date().getDay() + 6) % 7; // Monday = 0
  return workoutById(WEEK_PLAN[idx].workoutId);
};
