// ChatGPT-generated workout artwork (dark studio, neon lime style that
// matches the app theme). Static requires so Metro can bundle them.
import type { ImageSourcePropType } from 'react-native';

const IMAGES: Record<string, ImageSourcePropType> = {
  fullbody: require('../assets/workouts/workout-fullbody.jpg'),
  abs: require('../assets/workouts/workout-abs.jpg'),
  hiit: require('../assets/workouts/workout-hiit.jpg'),
  legs: require('../assets/workouts/workout-legs.jpg'),
  chest: require('../assets/workouts/workout-chest.jpg'),
  yoga: require('../assets/workouts/workout-yoga.jpg'),
  cardio: require('../assets/workouts/workout-cardio.jpg'),
  strength: require('../assets/workouts/workout-strength.jpg'),
  stretch: require('../assets/workouts/workout-stretch.jpg'),
  quick7: require('../assets/workouts/workout-quick7.jpg'),
};

export function workoutImage(id: string): ImageSourcePropType | undefined {
  return IMAGES[id];
}
