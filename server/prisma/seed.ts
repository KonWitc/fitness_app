import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exercises = [
  // Strength - Chest
  {
    name: 'Bench Press',
    description: 'Lie on a bench and press a barbell upward from chest level.',
    category: 'strength',
    muscleGroup: 'chest',
  },
  {
    name: 'Push-Ups',
    description: 'Lower your body to the ground and push back up using your arms.',
    category: 'strength',
    muscleGroup: 'chest',
  },
  {
    name: 'Dumbbell Flyes',
    description:
      'Lie on a bench with dumbbells and arc them outward then back together.',
    category: 'strength',
    muscleGroup: 'chest',
  },

  // Strength - Back
  {
    name: 'Pull-Ups',
    description: 'Hang from a bar and pull your body upward.',
    category: 'strength',
    muscleGroup: 'back',
  },
  {
    name: 'Bent-Over Rows',
    description: 'Hinge at the hips and row a barbell toward your torso.',
    category: 'strength',
    muscleGroup: 'back',
  },

  // Strength - Legs
  {
    name: 'Squats',
    description: 'Lower your body by bending your knees and hips, then stand back up.',
    category: 'strength',
    muscleGroup: 'legs',
  },
  {
    name: 'Lunges',
    description: 'Step forward and lower your back knee toward the ground.',
    category: 'strength',
    muscleGroup: 'legs',
  },
  {
    name: 'Deadlifts',
    description: 'Lift a barbell from the ground to hip level with a straight back.',
    category: 'strength',
    muscleGroup: 'legs',
  },

  // Strength - Shoulders
  {
    name: 'Overhead Press',
    description: 'Press a barbell or dumbbells overhead while standing or seated.',
    category: 'strength',
    muscleGroup: 'shoulders',
  },

  // Strength - Arms
  {
    name: 'Bicep Curls',
    description: 'Curl dumbbells upward by contracting your biceps.',
    category: 'strength',
    muscleGroup: 'arms',
  },
  {
    name: 'Tricep Dips',
    description: 'Lower your body between parallel bars using your triceps.',
    category: 'strength',
    muscleGroup: 'arms',
  },

  // Cardio
  {
    name: 'Running',
    description: 'Sustained cardiovascular exercise at a moderate to fast pace.',
    category: 'cardio',
    muscleGroup: null,
  },
  {
    name: 'Cycling',
    description: 'Pedal a stationary or outdoor bike for sustained cardio.',
    category: 'cardio',
    muscleGroup: null,
  },
  {
    name: 'Jumping Jacks',
    description: 'Jump with arms and legs spread, then bring them together.',
    category: 'cardio',
    muscleGroup: null,
  },

  // Flexibility
  {
    name: 'Yoga Sun Salutation',
    description: 'A flowing sequence of poses to build flexibility and strength.',
    category: 'flexibility',
    muscleGroup: null,
  },
];

async function main() {
  console.log('Seeding exercises...');

  const existing = await prisma.exercise.count();
  if (existing > 0) {
    console.log(`Database already has ${existing} exercises. Skipping seed.`);
    return;
  }

  await prisma.exercise.createMany({ data: exercises });

  console.log(`Seeded ${exercises.length} exercises successfully.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
