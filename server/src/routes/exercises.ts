import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

function paramId(req: Request): string {
  const val = req.params.id;
  return Array.isArray(val) ? val[0] : val;
}

// GET /api/exercises - List all exercises with optional filters
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { category, muscleGroup } = _req.query;

    const where: Record<string, string> = {};
    if (category && typeof category === 'string') {
      where.category = category;
    }
    if (muscleGroup && typeof muscleGroup === 'string') {
      where.muscleGroup = muscleGroup;
    }

    const exercises = await prisma.exercise.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
});

// GET /api/exercises/:id - Get a single exercise
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: { id: paramId(req) },
    });

    if (!exercise) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    res.json(exercise);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
});

// POST /api/exercises - Create a new exercise
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, category, muscleGroup, imageUrl, videoUrl } =
      req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(400).json({ error: 'Name is required' });
      return;
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      res.status(400).json({ error: 'Category is required' });
      return;
    }

    const exercise = await prisma.exercise.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        category: category.trim().toLowerCase(),
        muscleGroup: muscleGroup?.trim().toLowerCase() || null,
        imageUrl: imageUrl?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
      },
    });

    res.status(201).json(exercise);
  } catch (error) {
    console.error('Error creating exercise:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
});

// PUT /api/exercises/:id - Update an exercise
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await prisma.exercise.findUnique({
      where: { id: paramId(req) },
    });

    if (!existing) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    const { name, description, category, muscleGroup, imageUrl, videoUrl } =
      req.body;

    const updates: Record<string, string | null> = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        res.status(400).json({ error: 'Name cannot be empty' });
        return;
      }
      updates.name = name.trim();
    }
    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim() === '') {
        res.status(400).json({ error: 'Category cannot be empty' });
        return;
      }
      updates.category = category.trim().toLowerCase();
    }
    if (description !== undefined) {
      updates.description = description?.trim() || null;
    }
    if (muscleGroup !== undefined) {
      updates.muscleGroup = muscleGroup?.trim().toLowerCase() || null;
    }
    if (imageUrl !== undefined) {
      updates.imageUrl = imageUrl?.trim() || null;
    }
    if (videoUrl !== undefined) {
      updates.videoUrl = videoUrl?.trim() || null;
    }

    const exercise = await prisma.exercise.update({
      where: { id: paramId(req) },
      data: updates,
    });

    res.json(exercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
});

// DELETE /api/exercises/:id - Delete an exercise
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const existing = await prisma.exercise.findUnique({
      where: { id: paramId(req) },
    });

    if (!existing) {
      res.status(404).json({ error: 'Exercise not found' });
      return;
    }

    await prisma.exercise.delete({ where: { id: paramId(req) } });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
});

export default router;
