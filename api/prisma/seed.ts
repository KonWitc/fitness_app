import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

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
    description:
      'Lower your body to the ground and push back up using your arms.',
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
    description:
      'Lower your body by bending your knees and hips, then stand back up.',
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
    description:
      'Lift a barbell from the ground to hip level with a straight back.',
    category: 'strength',
    muscleGroup: 'legs',
  },

  // Strength - Shoulders
  {
    name: 'Overhead Press',
    description:
      'Press a barbell or dumbbells overhead while standing or seated.',
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
    description:
      'Sustained cardiovascular exercise at a moderate to fast pace.',
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
    description:
      'A flowing sequence of poses to build flexibility and strength.',
    category: 'flexibility',
    muscleGroup: null,
  },
];

const DEMO_EMAIL = 'demo@fitness.local';

async function seedExercises() {
  const existing = await prisma.exercise.count();
  if (existing > 0) {
    console.log(`Already ${existing} exercises, skipping.`);
    return;
  }
  await prisma.exercise.createMany({ data: exercises });
  console.log(`Seeded ${exercises.length} exercises.`);
}

/** A demo user with a little history, until real sign-up exists. */
async function seedDemoWorkouts() {
  if (await prisma.user.findUnique({ where: { email: DEMO_EMAIL } })) {
    console.log('Demo user exists, skipping workouts.');
    return;
  }

  const byName = new Map(
    (await prisma.exercise.findMany()).map((e) => [e.name, e.id])
  );
  const id = (name: string) => {
    const found = byName.get(name);
    if (!found) throw new Error(`Seed exercise missing: ${name}`);
    return found;
  };
  const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      name: 'Demo User',
      password: 'not-set', // replaced by a real hash once auth lands
    },
  });

  await prisma.workout.create({
    data: {
      userId: user.id,
      name: 'Push day',
      date: daysAgo(3),
      duration: 55,
      exercises: {
        create: [
          {
            exerciseId: id('Bench Press'),
            sets: 4,
            reps: 8,
            weight: 70,
            order: 0,
          },
          {
            exerciseId: id('Overhead Press'),
            sets: 3,
            reps: 10,
            weight: 40,
            order: 1,
          },
          { exerciseId: id('Tricep Dips'), sets: 3, reps: 12, order: 2 },
        ],
      },
    },
  });

  await prisma.workout.create({
    data: {
      userId: user.id,
      name: 'Legs + cardio',
      date: daysAgo(1),
      duration: 70,
      notes: 'Knees felt good, try +5 kg on squats next time.',
      exercises: {
        create: [
          { exerciseId: id('Squats'), sets: 5, reps: 5, weight: 100, order: 0 },
          {
            exerciseId: id('Deadlifts'),
            sets: 3,
            reps: 5,
            weight: 120,
            order: 1,
          },
          { exerciseId: id('Running'), duration: 1200, order: 2 },
        ],
      },
    },
  });

  console.log(`Seeded demo user ${DEMO_EMAIL} with 2 workouts.`);
}

async function main() {
  await seedExercises();
  await seedDemoWorkouts();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
