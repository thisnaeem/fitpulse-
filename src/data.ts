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
    desc: 'Har bare muscle group ko jagane wala complete starter routine — bina kisi equipment ke.',
    exercises: [
      ex('Jumping Jacks', '40 sec', 40, 'Full body', 'Halki si bounce rakho, heels softly land karo.'),
      ex('Push-Ups', 'x 12', 30, 'Chest', 'Body aik seedhi line mein rakho, core tight.'),
      ex('Squats', 'x 15', 40, 'Legs', 'Heels zameen par, ghutne toes ki direction mein.'),
      ex('Mountain Climbers', '30 sec', 30, 'Core', 'Hips ko stable rakho, speed ahista barhao.'),
      ex('Lunges', 'x 10 each leg', 40, 'Legs', 'Agla ghutna 90 degree tak, torso seedha.'),
      ex('Plank', '30 sec', 30, 'Core', 'Gardun neutral, kamar na jhuke na uthe.'),
      ex('Burpees', 'x 8', 40, 'Full body', 'Har rep full control se, form pehle speed baad mein.'),
      ex('High Knees', '30 sec', 30, 'Cardio', 'Ghutne kamar ki bulandi tak uthao.'),
    ],
  },
  {
    id: 'abs', title: 'Abs & Core Crusher', level: 'Intermediate', minutes: 15, kcal: 120,
    icon: 'target', tint: '#4CC3FF', focus: 'Core',
    desc: 'Six-pack ki bunyad — gehra core work jo posture aur balance bhi behtar kare.',
    exercises: [
      ex('Crunches', 'x 20', 40, 'Abs', 'Gardun ko kheenchna nahi, pait se utho.'),
      ex('Russian Twists', 'x 16', 40, 'Obliques', 'Feet halka sa uthao, dono taraf full twist.'),
      ex('Leg Raises', 'x 12', 40, 'Lower abs', 'Kamar zameen se chipki rahe.'),
      ex('Bicycle Crunches', 'x 20', 40, 'Abs', 'Kehni ko ghutno se milao, jaldi nahi.'),
      ex('Plank', '45 sec', 45, 'Core', 'Sans barabar rakho, hips level.'),
      ex('Side Plank', '30 sec each side', 60, 'Obliques', 'Body aik line mein, kamar na girne do.'),
      ex('Dead Bug', 'x 12', 40, 'Deep core', 'Bazu aur tang bilkul ulte harkat karein.'),
    ],
  },
  {
    id: 'hiit', title: 'HIIT Fat Blast', level: 'Advanced', minutes: 18, kcal: 240,
    icon: 'zap', tint: '#FFB020', focus: 'Cardio',
    desc: 'High intensity intervals — kam waqt mein zyada calorie burn aur afterburn effect.',
    exercises: [
      ex('Burpees', '40 sec', 40, 'Full body', 'Har rep mein full extension pe jump.'),
      ex('Jump Squats', '40 sec', 40, 'Legs', 'Soft landing, foran agla rep.'),
      ex('Mountain Climbers', '40 sec', 40, 'Core', 'Max speed, hips stable.'),
      ex('Skater Jumps', '40 sec', 40, 'Legs', 'Side to side, balance control karo.'),
      ex('High Knees', '40 sec', 40, 'Cardio', 'Arms ko bhi pump karo.'),
      ex('Plank Jacks', '40 sec', 40, 'Core', 'Plank mein feet kholte band karte raho.'),
      ex('Tuck Jumps', '30 sec', 30, 'Power', 'Ghutne chest ki taraf kheenchon.'),
    ],
  },
  {
    id: 'legs', title: 'Legs & Glutes Power', level: 'Intermediate', minutes: 20, kcal: 190,
    icon: 'run', tint: '#B78CFF', focus: 'Lower body',
    desc: 'Tangon aur glutes ki taqat aur shape ke liye focused lower-body session.',
    exercises: [
      ex('Squats', 'x 18', 40, 'Quads', 'Wazan heels par, chest upar.'),
      ex('Reverse Lunges', 'x 12 each', 45, 'Glutes', 'Peeche kadam, agla ghutna stable.'),
      ex('Glute Bridge', 'x 20', 40, 'Glutes', 'Upar 2 sec roko, squeeze karo.'),
      ex('Wall Sit', '45 sec', 45, 'Quads', 'Peeth deewar se, ghutne 90 degree.'),
      ex('Calf Raises', 'x 25', 40, 'Calves', 'Full range — upar ruk kar neeche ahista.'),
      ex('Sumo Squats', 'x 15', 40, 'Inner thigh', 'Pair khule, toes bahar ki taraf.'),
      ex('Single-Leg Bridge', 'x 10 each', 40, 'Glutes', 'Hips level rakho, hila mat.'),
    ],
  },
  {
    id: 'chest', title: 'Chest & Arms Builder', level: 'Intermediate', minutes: 17, kcal: 140,
    icon: 'muscle', tint: '#FF6B5E', focus: 'Upper body',
    desc: 'Push-up variations se chest, shoulders aur triceps ka ghar pe pura workout.',
    exercises: [
      ex('Push-Ups', 'x 15', 40, 'Chest', 'Full range — chest zameen ke qareeb.'),
      ex('Wide Push-Ups', 'x 12', 40, 'Outer chest', 'Haath kandhon se zyada khule.'),
      ex('Diamond Push-Ups', 'x 10', 40, 'Triceps', 'Haathon se diamond shape banao.'),
      ex('Pike Push-Ups', 'x 10', 40, 'Shoulders', 'Hips upar, sar zameen ki taraf.'),
      ex('Chair Dips', 'x 14', 40, 'Triceps', 'Kehniyan peeche ki taraf muden.'),
      ex('Plank to Push-Up', 'x 10', 45, 'Arms + core', 'Har rep mein haath badlo.'),
      ex('Shoulder Taps', 'x 20', 40, 'Shoulders', 'Hips bilkul na hilen.'),
    ],
  },
  {
    id: 'yoga', title: 'Morning Yoga Flow', level: 'Beginner', minutes: 16, kcal: 70,
    icon: 'yoga', tint: '#7FE0B2', focus: 'Flexibility',
    desc: 'Subah ka naram flow — jism khulta hai, zehen shaant, din fresh shuru.',
    exercises: [
      ex('Cat-Cow Stretch', '60 sec', 60, 'Spine', 'Sans ke saath harkat — andar bahar.'),
      ex('Downward Dog', '45 sec', 45, 'Full body', 'Heels zameen ki taraf dabao.'),
      ex("Child's Pose", '60 sec', 60, 'Back', 'Mathaa zameen par, gehri sans.'),
      ex('Warrior I', '40 sec each', 80, 'Legs', 'Hips aage ki taraf, bazu upar.'),
      ex('Warrior II', '40 sec each', 80, 'Legs', 'Nazar agle haath ki taraf.'),
      ex('Bridge Pose', '45 sec', 45, 'Glutes', 'Sans chorhte hue hips uthao.'),
      ex('Seated Twist', '40 sec each', 80, 'Spine', 'Har sans bahar karne pe thoda aur twist.'),
      ex('Deep Breathing', '60 sec', 60, 'Mind', '4 sec andar, 4 roko, 6 bahar.'),
    ],
  },
  {
    id: 'cardio', title: 'Cardio Sweat Party', level: 'Beginner', minutes: 14, kcal: 150,
    icon: 'heart', tint: '#FF5E8A', focus: 'Cardio',
    desc: 'Dil ki sehat aur stamina ke liye mazaydar low-impact cardio.',
    exercises: [
      ex('March in Place', '60 sec', 60, 'Warm-up', 'Bazu swing karo, posture seedha.'),
      ex('Step Touch', '60 sec', 60, 'Legs', 'Side to side halki rhythm mein.'),
      ex('Butt Kicks', '45 sec', 45, 'Hamstrings', 'Heels glutes ko chuayein.'),
      ex('Boxer Shuffle', '60 sec', 60, 'Full body', 'Halki bounce, punches hawa mein.'),
      ex('Side Lunges', 'x 12', 45, 'Legs', 'Aik taraf betho, dusri tang seedhi.'),
      ex('Standing Cross Crunch', 'x 20', 45, 'Core', 'Kehni ghutno se milao khare khare.'),
    ],
  },
  {
    id: 'strength', title: 'Bodyweight Strength', level: 'Advanced', minutes: 25, kcal: 210,
    icon: 'dumbbell', tint: '#A3E635', focus: 'Strength',
    desc: 'Sirf bodyweight se asal taqat — slow reps, full control, zyada tension.',
    exercises: [
      ex('Archer Push-Ups', 'x 8 each', 50, 'Chest', 'Aik bazu seedha, dusre se push.'),
      ex('Pistol Squat Practice', 'x 6 each', 50, 'Legs', 'Kursi ka sahara le sakte ho.'),
      ex('Decline Push-Ups', 'x 12', 40, 'Upper chest', 'Pair kursi par, body line mein.'),
      ex('Hollow Body Hold', '40 sec', 40, 'Core', 'Kamar zameen se chipki, jism boat jaisa.'),
      ex('Superman Pull', 'x 14', 40, 'Back', 'Bazu aage se peeche kheenchon.'),
      ex('L-Sit Practice', '30 sec', 30, 'Core + hip', 'Zameen par beth kar heels uthao.'),
      ex('Wall Handstand Hold', '40 sec', 40, 'Shoulders', 'Deewar ke sahare, sans barabar.'),
    ],
  },
  {
    id: 'stretch', title: 'Evening Stretch & Recovery', level: 'Beginner', minutes: 12, kcal: 45,
    icon: 'sparkles', tint: '#8AB8FF', focus: 'Recovery',
    desc: 'Din ke aakhir mein tension release — neend aur recovery dono behtar.',
    exercises: [
      ex('Neck Rolls', '40 sec', 40, 'Neck', 'Bohat ahista, koi jhatka nahi.'),
      ex('Shoulder Stretch', '30 sec each', 60, 'Shoulders', 'Bazu chest ke paar, halka dabao.'),
      ex('Cat-Cow Stretch', '60 sec', 60, 'Spine', 'Sans ke saath flow karo.'),
      ex('Pigeon Pose', '60 sec each', 120, 'Hips', 'Gehra hip opener — ahista jao.'),
      ex('Hamstring Stretch', '45 sec each', 90, 'Hamstrings', 'Peeth seedhi, aage jhuko hips se.'),
      ex('Lying Spinal Twist', '60 sec each', 120, 'Back', 'Kandhe zameen par rahein.'),
      ex('Deep Breathing', '60 sec', 60, 'Mind', 'Lambi sans bahar — din khatam.'),
    ],
  },
  {
    id: 'quick7', title: '7-Minute Quick Fix', level: 'Beginner', minutes: 7, kcal: 80,
    icon: 'timer', tint: '#FFD84D', focus: 'Quick',
    desc: 'Waqt kam hai? Ye 7 minute ka classic full-body circuit tumhare liye.',
    exercises: [
      ex('Jumping Jacks', '30 sec', 30, 'Full body', 'Full energy se shuru karo.'),
      ex('Wall Sit', '30 sec', 30, 'Legs', 'Ghutne 90 degree, peeth deewar par.'),
      ex('Push-Ups', '30 sec', 30, 'Chest', 'Jitne ho sakein achi form mein.'),
      ex('Crunches', '30 sec', 30, 'Abs', 'Gardun relax, pait se kaam.'),
      ex('Step-Ups (Chair)', '30 sec', 30, 'Legs', 'Mazboot kursi istemal karo.'),
      ex('Squats', '30 sec', 30, 'Legs', 'Heels down, chest up.'),
      ex('Plank', '30 sec', 30, 'Core', 'Aakhri push — body line mein.'),
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

export interface Achievement { id: string; title: string; desc: string; icon: IconName; need: number }
export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first', title: 'First Step', desc: 'Pehla workout mukammal', icon: 'sparkles', need: 1 },
  { id: 'five', title: 'Getting Warm', desc: '5 workouts mukammal', icon: 'flame', need: 5 },
  { id: 'ten', title: 'On Fire', desc: '10 workouts mukammal', icon: 'fire', need: 10 },
  { id: 'twentyfive', title: 'Unstoppable', desc: '25 workouts mukammal', icon: 'trophy', need: 25 },
  { id: 'fifty', title: 'FitPulse Pro', desc: '50 workouts mukammal', icon: 'medal', need: 50 },
];

export const workoutById = (id: string) => WORKOUTS.find(w => w.id === id) || WORKOUTS[0];
export const todayWorkout = () => {
  const idx = (new Date().getDay() + 6) % 7; // Monday = 0
  return workoutById(WEEK_PLAN[idx].workoutId);
};
