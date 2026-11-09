import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

const router = Router();

function paramId(req: Request): string {
  const val = req.params.id;
  return Array.isArray(val) ? val[0] : val;
}

// GET /api/workouts - List all previous workouts with optional filters
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { dateFrom, dateTo, userId } = _req.query;

    const where: Prisma.WorkoutWhereInput = {
      userId: userId as string,
      ...(dateFrom || dateTo
        ? {
            date: {
              ...(dateFrom && { gte: new Date(dateFrom as string) }),
              ...(dateTo && { lte: new Date(dateTo as string) }),
            },
          }
        : {}),
    };

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        exercises: true,
      },
      orderBy: { date: 'desc' },
    });

    res.json(workouts);
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// GET /api/workouts/:id - Get a single workout
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await prisma.workout.findUnique({
      where: { id: paramId(req) },
    });

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json(workout);
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

export default router;
